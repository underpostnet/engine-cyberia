import { SignUp } from '../core/SignUp.js';

class SignUpCryptokoyn {
  static async Init() {
    SignUp.Event['SignUpCryptokoyn'] = async (options) => {
      const { user } = options;
    };
  }
}

export { SignUpCryptokoyn };
