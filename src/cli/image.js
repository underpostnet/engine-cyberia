import fs from 'fs-extra';
import dotenv from 'dotenv';
import { loggerFactory } from '../server/logger.js';
import Underpost from '../index.js';
import { getUnderpostRootPath } from '../server/conf.js';
import { shellExec } from '../server/process.js';

dotenv.config();

const logger = loggerFactory(import.meta);

class UnderpostImage {
  static API = {
    dockerfile: {
      /**
       * @method pullBaseImages
       * @description Pulls base images and builds a 'rockylinux9-underpost' image,
       * then loads it into the specified Kubernetes cluster type (Kind, Kubeadm, or K3s).
       * @param {object} options - Options for pulling and loading images.
       * @param {boolean} [options.kindLoad=false] - If true, load image into Kind cluster.
       * @param {boolean} [options.kubeadmLoad=false] - If true, load image into Kubeadm cluster.
       * @param {boolean} [options.k3sLoad=false] - If true, load image into K3s cluster.
       * @param {string} [options.path=false] - Path to the Dockerfile context.
       * @param {string} [options.version=''] - Version tag for the image.
       */
      pullBaseImages(
        options = {
          kindLoad: false,
          kubeadmLoad: false,
          k3sLoad: false,
          path: false,
          version: '',
        },
      ) {
        // shellExec(`sudo podman pull docker.io/library/debian:buster`);
        shellExec(`sudo podman pull docker.io/library/rockylinux:9`);
        const IMAGE_NAME = `rockylinux9-underpost`;
        const IMAGE_NAME_FULL = `${IMAGE_NAME}:${options.version ?? Underpost.version}`;
        let LOAD_TYPE = '';
        if (options.kindLoad === true) {
          LOAD_TYPE = `--kind-load`;
        } else if (options.kubeadmLoad === true) {
          LOAD_TYPE = `--kubeadm-load`;
        } else if (options.k3sLoad === true) {
          // Handle K3s load type
          LOAD_TYPE = `--k3s-load`;
        }

        shellExec(
          `underpost dockerfile-image-build --podman-save --reset --image-path=. --path ${
            options.path ?? getUnderpostRootPath()
          } --image-name=${IMAGE_NAME_FULL} ${LOAD_TYPE}`,
        );
      },
      /**
       * @method build
       * @description Builds a Docker image using Podman, optionally saves it as a tar archive,
       * and loads it into a specified Kubernetes cluster (Kind, Kubeadm, or K3s).
       * @param {object} options - Options for building and loading images.
       * @param {string} [options.path=''] - The path to the directory containing the Dockerfile.
       * @param {string} [options.imageName=''] - The name and tag for the image (e.g., 'my-app:latest').
       * @param {string} [options.imagePath=''] - Directory to save the image tar file.
       * @param {string} [options.dockerfileName=''] - Name of the Dockerfile (defaults to 'Dockerfile').
       * @param {boolean} [options.podmanSave=false] - If true, save the image as a tar archive using Podman.
       * @param {boolean} [options.kindLoad=false] - If true, load the image archive into a Kind cluster.
       * @param {boolean} [options.kubeadmLoad=false] - If true, load the image archive into a Kubeadm cluster (uses 'ctr').
       * @param {boolean} [options.k3sLoad=false] - If true, load the image archive into a K3s cluster (uses 'k3s ctr').
       * @param {boolean} [options.secrets=false] - If true, load secrets from the .env file for the build.
       * @param {string} [options.secretsPath=''] - Custom path to the .env file for secrets.
       * @param {boolean} [options.reset=false] - If true, perform a no-cache build.
       */
      build(
        options = {
          path: '',
          imageName: '',
          imagePath: '',
          dockerfileName: '',
          podmanSave: false,
          kindLoad: false,
          kubeadmLoad: false,
          k3sLoad: false,
          secrets: false,
          secretsPath: '',
          reset: false,
        },
      ) {
        const {
          path,
          imageName,
          imagePath,
          dockerfileName,
          podmanSave,
          secrets,
          secretsPath,
          kindLoad,
          kubeadmLoad,
          k3sLoad,
          reset,
        } = options;
        const podManImg = `localhost/${imageName}`;
        if (imagePath && typeof imagePath === 'string' && !fs.existsSync(imagePath))
          fs.mkdirSync(imagePath, { recursive: true });
        const tarFile = `${imagePath}/${imageName.replace(':', '_')}.tar`;
        let secretsInput = ' ';
        let secretDockerInput = '';
        let cache = '';
        if (secrets === true) {
          const envObj = dotenv.parse(
            fs.readFileSync(
              secretsPath && typeof secretsPath === 'string' ? secretsPath : `${getNpmRootPath()}/underpost/.env`,
              'utf8',
            ),
          );
          for (const key of Object.keys(envObj)) {
            secretsInput += ` && export ${key}="${envObj[key]}" `; // Example: $(cat gitlab-token.txt)
            secretDockerInput += ` --secret id=${key},env=${key} \ `;
          }
        }
        if (reset === true) cache += ' --rm --no-cache';
        if (path && typeof path === 'string')
          shellExec(
            `cd ${path}${secretsInput}&& sudo podman build -f ./${
              dockerfileName && typeof dockerfileName === 'string' ? dockerfileName : 'Dockerfile'
            } -t ${imageName} --pull=never --cap-add=CAP_AUDIT_WRITE${cache}${secretDockerInput} --network host`,
          );

        if (podmanSave === true) shellExec(`podman save -o ${tarFile} ${podManImg}`);
        if (kindLoad === true) shellExec(`sudo kind load image-archive ${tarFile}`);
        if (kubeadmLoad === true) {
          // Use 'ctr' for Kubeadm
          shellExec(`sudo ctr -n k8s.io images import ${tarFile}`);
        }
        if (k3sLoad === true) {
          // Use 'k3s ctr' for K3s
          shellExec(`sudo k3s ctr images import ${tarFile}`);
        }
      },
    },
  };
}
export default UnderpostImage;
