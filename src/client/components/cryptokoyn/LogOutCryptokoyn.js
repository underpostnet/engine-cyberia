import { LogOut } from '../core/LogOut.js';
import { AppStoreCryptokoyn } from './AppStoreCryptokoyn.js';

class LogOutCryptokoyn {
  static async Init() {
    LogOut.Event['LogOutCryptokoyn'] = async (result = { user: { _id: '' } }) => {
      AppStoreCryptokoyn.Data.user.main.model.user = result.user;
    };
  }
}

export { LogOutCryptokoyn };
