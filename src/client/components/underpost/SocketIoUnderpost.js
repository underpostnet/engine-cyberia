import { SocketIoHandlerProvider } from '../core/SocketIoHandler.js';
import { AppStoreUnderpost } from './AppStoreUnderpost.js';

class SocketIoUnderpost {
  static Handler = SocketIoHandlerProvider.create(AppStoreUnderpost);

  static Init(...args) {
    return this.Handler.Init(...args);
  }
}

export { SocketIoUnderpost };
