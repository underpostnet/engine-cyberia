import { SocketIoHandlerProvider } from '../core/SocketIoHandler.js';
import { AppStoreCyberiaPortal } from './AppStoreCyberiaPortal.js';

class SocketIoCyberiaPortal {
  static Handler = SocketIoHandlerProvider.create(AppStoreCyberiaPortal);

  static Init(...args) {
    return this.Handler.Init(...args);
  }
}

export { SocketIoCyberiaPortal };
