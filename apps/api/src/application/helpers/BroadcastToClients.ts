import WebSocket, { WebSocketServer } from 'ws';
import { BtcBlock, L2Block } from '@cryptochords/shared';

const BroadcastToClients = (wss: WebSocketServer, l2Block: L2Block | null, btcBlock: BtcBlock|null): void => {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      if (l2Block) {
      client.send(JSON.stringify(l2Block.toJSON()));

      }
      if (btcBlock) {
        client.send(JSON.stringify(btcBlock.toJSON()));
      }
    }
  });
};

export default BroadcastToClients
