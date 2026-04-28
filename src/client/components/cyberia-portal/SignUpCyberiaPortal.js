// import { createCyberiaUser } from '../../services/cyberia-user/cyberia-user.service.js';
import { SignUp } from '../core/SignUp.js';

class SignUpCyberiaPortal {
  static async Init() {
    SignUp.Event['SignUpCyberiaPortal'] = async (options) => {
      const { user } = options;
      // await createCyberiaUser({ user });
    };
  }
}

export { SignUpCyberiaPortal };
