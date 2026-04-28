import { SocketIoHandlerProvider } from '../core/SocketIoHandler.js';
import { AppStoreCryptokoyn } from './AppStoreCryptokoyn.js';

class SocketIoCryptokoyn {
  static Handler = SocketIoHandlerProvider.create(AppStoreCryptokoyn);

  static Init(...args) {
    return this.Handler.Init(...args);
  }
}

export { SocketIoCryptokoyn };
