import { SignUp } from '../core/SignUp.js';

class SignUpUnderpost {
  static async Init() {
    SignUp.Event['SignUpUnderpost'] = async (options) => {
      const { user } = options;
    };
  }
}

export { SignUpUnderpost };
