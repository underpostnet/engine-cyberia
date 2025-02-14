import fs from 'fs-extra';
import { loggerFactory } from '../src/server/logger.js';
import { shellExec } from '../src/server/process.js';
import dotenv from 'dotenv';
import { getCapVariableName } from '../src/client/components/core/CommonJs.js';
import { buildProxyRouter, buildPortProxyRouter, Config, getPathsSSR, buildKindPorts } from '../src/server/conf.js';

const baseConfPath = './engine-private/conf/dd-cron/.env.production';
if (fs.existsSync(baseConfPath)) dotenv.config({ path: baseConfPath });

const logger = loggerFactory(import.meta);

// (async () => {
//   return;
//   const files = await fs.readdir(`./src`);
//   for (const relativePath of files) {
//   }
// })();

const confName = process.argv[2];
const basePath = '../pwa-microservices-template';
const repoName = `engine-${confName.split('dd-')[1]}-private`;
const repoNameBackUp = `engine-${confName.split('dd-')[1]}-cron-backups`;
const gitUrl = `https://${process.env.GITHUB_TOKEN}@github.com/underpostnet/${repoName}.git`;
const gitBackUpUrl = `https://${process.env.GITHUB_TOKEN}@github.com/underpostnet/${repoNameBackUp}.git`;

logger.info('', {
  confName,
  // gitUrl,
  repoName,
  repoNameBackUp,
  basePath,
});

if (process.argv.includes('info')) process.exit(0);

if (process.argv.includes('proxy')) {
  const env = process.argv.includes('development') ? 'development' : 'production';
  process.env.NODE_ENV = env;
  process.env.PORT = process.env.NODE_ENV === 'development' ? 4000 : 3000;
  process.argv[2] = 'proxy';
  process.argv[3] = fs.readFileSync('./engine-private/deploy/dd-router', 'utf8').trim();

  await Config.build();
  process.env.NODE_ENV = 'production';
  const router = buildPortProxyRouter(443, buildProxyRouter());
  const confServer = JSON.parse(fs.readFileSync(`./engine-private/conf/${confName}/conf.server.json`, 'utf8'));
  const confHosts = Object.keys(confServer);

  for (const host of Object.keys(router)) {
    if (!confHosts.find((_host) => host.match(_host))) {
      delete router[host];
    }
  }

  const ports = Object.values(router).map((p) => p.split(':')[2]);

  const fromPort = ports[0];
  const toPort = ports[ports.length - 1];

  logger.info('port range', { fromPort, toPort, router });

  const deploymentYamlFilePath = `./engine-private/conf/${confName}/build/${env}/deployment.yaml`;

  const deploymentYamlParts = fs.readFileSync(deploymentYamlFilePath, 'utf8').split('ports:');
  deploymentYamlParts[1] =
    buildKindPorts(fromPort, toPort) +
    `  type: LoadBalancer
`;

  fs.writeFileSync(
    deploymentYamlFilePath,
    deploymentYamlParts.join(`ports:
`),
  );

  let proxyYaml = '';

  for (const host of Object.keys(confServer)) {
    const pathPortConditions = [];
    for (const path of Object.keys(confServer[host])) {
      const { peer } = confServer[host][path];
      const port = parseInt(router[`${host}${path === '/' ? '' : path}`].split(':')[2]);
      // logger.info('', { host, port, path });
      pathPortConditions.push({
        port,
        path,
      });

      if (peer) {
        //  logger.info('', { host, port: port + 1, path: '/peer' });
        pathPortConditions.push({
          port: port + 1,
          path: '/peer',
        });
      }
    }
    // logger.info('', { host, pathPortConditions });
    proxyYaml += `
---
apiVersion: projectcontour.io/v1
kind: HTTPProxy
metadata:
  name: ${host}
spec:
  virtualhost:
    fqdn: ${host}
  routes:`;
    for (const conditionObj of pathPortConditions) {
      const { path, port } = conditionObj;
      proxyYaml += `
    - conditions:
        - prefix: ${path}
      enableWebsockets: true
      services:
        - name: ${confName}-${env}-service
          port: ${port}`;
    }
  }
  const yamlPath = `./engine-private/conf/${confName}/build/${env}/proxy.yaml`;
  fs.writeFileSync(yamlPath, proxyYaml, 'utf8');

  process.exit(0);
}
if (process.argv.includes('conf')) {
  if (!fs.existsSync(`../${repoName}`)) {
    shellExec(`cd .. && git clone ${gitUrl}`, { silent: true });
  } else {
    shellExec(`cd ../${repoName} && git pull`);
  }
  const toPath = `../${repoName}/conf/${confName}`;
  fs.removeSync(toPath);
  fs.mkdirSync(toPath, { recursive: true });
  fs.copySync(`./engine-private/conf/${confName}`, toPath);
  shellExec(
    `cd ../${repoName}` +
      ` && git add .` +
      ` && git commit -m "ci(engine-core-conf): ⚙️ Update ${confName} conf"` +
      ` && git push`,
  );
  process.exit(0);
}

if (process.argv.includes('cron-backups')) {
  if (!fs.existsSync(`../${repoNameBackUp}`)) {
    shellExec(`cd .. && git clone ${gitBackUpUrl}`, { silent: true });
  } else {
    shellExec(`cd ../${repoNameBackUp} && git pull`);
  }
  const serverConf = JSON.parse(fs.readFileSync(`./engine-private/conf/${confName}/conf.server.json`, 'utf8'));
  for (const host of Object.keys(serverConf)) {
    for (let path of Object.keys(serverConf[host])) {
      path = path.replaceAll('/', '-');
      const toPath = `../${repoNameBackUp}/${host}${path}`;
      const fromPath = `./engine-private/cron-backups/${host}${path}`;
      if (fs.existsSync(fromPath)) {
        if (fs.existsSync(toPath)) fs.removeSync(toPath);
        logger.info('Build', { fromPath, toPath });
        fs.copySync(fromPath, toPath);
      }
    }
  }
  shellExec(
    `cd ../${repoNameBackUp}` +
      ` && git add .` +
      ` && git commit -m "ci(engine-core-cron-backups): ⚙️ Update ${confName} cron backups"` +
      ` && git push`,
  );
  process.exit(0);
}

if (process.argv.includes('test')) {
  fs.mkdirSync(`${basePath}/engine-private/conf`, { recursive: true });
  fs.copySync(`./engine-private/conf/${confName}`, `${basePath}/engine-private/conf/${confName}`);
}

const { DefaultConf } = await import(`../conf.${confName}.js`);

{
  for (const host of Object.keys(DefaultConf.server)) {
    for (const path of Object.keys(DefaultConf.server[host])) {
      const { apis, ws } = DefaultConf.server[host][path];
      if (apis)
        for (const api of apis) {
          {
            const originPath = `./src/api/${api}`;
            logger.info(`Build`, originPath);
            fs.copySync(originPath, `${basePath}/src/api/${api}`);
          }
          {
            const originPath = `./src/client/services/${api}`;
            logger.info(`Build`, originPath);
            fs.copySync(originPath, `${basePath}/src/client/services/${api}`);
          }
        }

      if (ws && ws !== 'core' && ws !== 'default') {
        fs.copySync(`./src/ws/${ws}`, `${basePath}/src/ws/${ws}`);
      }
    }
  }
}

{
  for (const client of Object.keys(DefaultConf.client)) {
    const capName = getCapVariableName(client);
    for (const component of Object.keys(DefaultConf.client[client].components)) {
      const originPath = `./src/client/components/${component}`;
      if (fs.existsSync(originPath)) {
        logger.info(`Build`, originPath);
        fs.copySync(originPath, `${basePath}/src/client/components/${component}`);
      }
    }
    {
      const originPath = `./src/client/${capName}.index.js`;
      if (fs.existsSync(originPath)) {
        logger.info(`Build`, originPath);
        fs.copyFileSync(originPath, `${basePath}/src/client/${capName}.index.js`);
      }
    }
    {
      const originPath = `./src/client/public/${client}`;
      if (fs.existsSync(originPath)) {
        logger.info(`Build`, originPath);
        fs.copySync(originPath, `${basePath}/src/client/public/${client}`);
      }
    }
  }
}

{
  for (const client of Object.keys(DefaultConf.ssr)) {
    const ssrPaths = getPathsSSR(DefaultConf.ssr[client]);
    for (const originPath of ssrPaths) {
      if (fs.existsSync(originPath)) {
        logger.info(`Build`, originPath);
        fs.copySync(originPath, `${basePath}/${originPath}`);
      }
    }
  }

  fs.copyFileSync(`./conf.${confName}.js`, `${basePath}/conf.js`);
}
