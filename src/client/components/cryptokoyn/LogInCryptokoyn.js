import { Auth } from '../core/Auth.js';
import { LogIn } from '../core/LogIn.js';
import { AppStoreCryptokoyn } from './AppStoreCryptokoyn.js';

class LogInCryptokoyn {
  static async Init() {
    LogIn.Event['LogInCryptokoyn'] = async (options) => {
      const { token, user } = options;
      AppStoreCryptokoyn.Data.user.main.model.user = user;
    };
    const { user } = await Auth.sessionIn();
    AppStoreCryptokoyn.Data.user.main.model.user = user;
  }
}

export { LogInCryptokoyn };
