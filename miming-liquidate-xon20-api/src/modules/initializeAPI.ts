import { ApiPromise, WsProvider } from '@polkadot/api';
import '@polkadot/api-augment';

export default class InitializeAPI {
    static apiInitialization = async () => {
        try {
            const wsProvider = new WsProvider(process.env.WSPROVIDER, false);
            wsProvider.connect();
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => {
                reject(Error('Websocket initialization error'));
              }, 30 * 1000);
            });
            await Promise.race([
              wsProvider.isReady,
              timeoutPromise
            ]);
            if (!wsProvider.isConnected) {
              await wsProvider.disconnect();
              return Error('apiInitialization error occurred: ');
            }
            const api = await ApiPromise.create({
              provider: wsProvider
            });
            return api;
        } catch (error) {
            return Error('apiInitialization error occurred: ' + error);
        }
    }
}