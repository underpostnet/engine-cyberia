import { SocketIoHandlerProvider } from '../core/SocketIoHandler.js';
import { AppStoreItemledger } from './AppStoreItemledger.js';

class SocketIoItemledger {
  static Handler = SocketIoHandlerProvider.create(AppStoreItemledger);

  static Init(...args) {
    return this.Handler.Init(...args);
  }
}

export { SocketIoItemledger };
