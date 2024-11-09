import { WebSocketServer } from "ws";
import { BlockRepository } from "../../domain/repositories/BlockRepository";
import BroadcastToClients from "../helpers/BroadcastToClients";
import { BtcBlock, L2Block, TxTypesEnum } from "@cryptochords/shared";

export class PollingService {
  constructor(private blockRepository: BlockRepository) {}

  execute(wss: WebSocketServer, url: string): void {
    this.blockRepository.execute(url)
    
    this.blockRepository.on(TxTypesEnum.BtcBlock, (btcBlock: BtcBlock) => BroadcastToClients(wss, null, btcBlock));
    this.blockRepository.on(TxTypesEnum.Block, (l2Block: L2Block) => BroadcastToClients(wss, l2Block, null));
    this.blockRepository.on(TxTypesEnum.Eth, (l2Block: L2Block) => BroadcastToClients(wss, l2Block, null));
    this.blockRepository.on(TxTypesEnum.Btc, (btcBlock: BtcBlock) => BroadcastToClients(wss, null, btcBlock));
    this.blockRepository.on(TxTypesEnum.Pop, (l2Block: L2Block) => BroadcastToClients(wss, l2Block, null));
  }

  stop() {
    this.blockRepository.stop()
  }
}