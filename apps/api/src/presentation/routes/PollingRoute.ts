import { WebSocketServer } from 'ws';
import { BlockWebsocketRepository as  HemiBlockWebsocketRepository } from '../../infrastructure/hemi_pop/blockWebsocket';
import { BlockPollingRepository as HemiBlockPollingRepository } from '../../infrastructure/hemi_pop/blockPolling';
import { BlockPollingRepository } from '../../infrastructure/repositories/blockPolling';
import { BlockWebsocketRepository } from '../../infrastructure/repositories/blockWebsocket';
import { PollingService } from '../../application/polling/pollingService';
import 'dotenv/config';

export class PollingRoute {
  private pollingService: PollingService;
  private hemiPollingService: PollingService;
  private url: string;

  constructor() {
    if (process.env['USE_WEBSOCKET_NODE_L2'] === 'true') {
      this.url = process.env['WEBSOCKET_URL'] as string
      const blockWebsocketRepository = new BlockWebsocketRepository();
      const hemiBlockWebsocketRepository = new HemiBlockWebsocketRepository();
      this.pollingService = new PollingService(blockWebsocketRepository);
      this.hemiPollingService = new PollingService(hemiBlockWebsocketRepository);
    } else {
      this.url = process.env['RPC_URL'] as string
      const blockPollingRepository = new BlockPollingRepository();
      const hemiBlockPollingRepository = new HemiBlockPollingRepository();
      this.pollingService = new PollingService(blockPollingRepository);
      this.hemiPollingService = new PollingService(hemiBlockPollingRepository);
    }
  }

  public initialize(wss: WebSocketServer): void {
    this.pollingService.execute(wss, this.url);
    this.hemiPollingService.execute(wss, this.url);
  }

  public stop(): void {
    this.pollingService.stop()
    this.hemiPollingService.stop()
  } 
}
