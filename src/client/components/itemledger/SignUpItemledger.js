import { SignUp } from '../core/SignUp.js';

class SignUpItemledger {
  static async Init() {
    SignUp.Event['SignUpItemledger'] = async (options) => {
      const { user } = options;
    };
  }
}

export { SignUpItemledger };
