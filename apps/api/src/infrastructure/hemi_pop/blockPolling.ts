import { EventEmitter } from "stream";
import { BlockRepository } from "../../domain/repositories/BlockRepository";
import { TxTypesEnum } from "@cryptochords/shared";
import { TxType } from "@cryptochords/shared";
import { Address } from "@cryptochords/shared";
import { BtcBlock } from "@cryptochords/shared";

export class BlockPollingRepository extends EventEmitter implements BlockRepository {
  private latestBlockNumber = BigInt(0)
  private pollingIntervalId: NodeJS.Timeout | null = null;

  execute(rpcUrl: string, pollingInterval = 5000): void {
    const endpoint = rpcUrl
    this.poll(endpoint, pollingInterval)
  }

  stop() {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
    }
    console.log('Polling stopped.');
  }

  async checkNewBlocks(): Promise<void> {
    try {
      

      const currentBlockNumberResp = await fetch("https://blockstream.info/testnet/api/blocks/tip/height");
      const currentBlockNumber = BigInt(parseInt(await currentBlockNumberResp.text()));
      console.log("Current block height: ", currentBlockNumber)
      if (currentBlockNumber > this.latestBlockNumber) {
        this.latestBlockNumber = currentBlockNumber;

        // const block = await web3.eth.getBlock(currentBlockNumber, true);
        const hashResp = await fetch("https://blockstream.info/testnet/api/blocks/tip/hash");
        const hash = await hashResp.text()
        if (hash) {
          console.log(hash, 'new btc block hash');
          this.emit(TxTypesEnum.Btc, BtcBlock.create({
            txType: TxType.create(TxTypesEnum.Btc), 
            address: Address.create(hash.toString())
          }))
          const blockDetailApi = "https://blockstream.info/testnet/api/block/" + hash
          console.log(blockDetailApi) 
          const blockDetailedResp = await fetch(blockDetailApi);
          const blockDetail = await blockDetailedResp.json();
          // console.log(blockDetail); 
          if (blockDetail.tx_count > 0) {
            console.log("block with count: ", hash, blockDetail.tx_count);
            const blockTxnsResp = await fetch("https://blockstream.info/testnet/api/block/" + hash + "/txids");
            const blockTxns = await blockTxnsResp.json();
            console.log(blockTxns)
            // blockTxns.forEach(async (txnHash: string) => {
            //   try {
            //     const txnDetailResp = await fetch("https://blockstream.info/testnet/api/tx/" + txnHash);
            //     const detail = await txnDetailResp.json();
            //     detail.vout.forEach((script: any) => {
            //       if (script.scriptpubkey_type == "op_return") {
            //         if (script.scriptpubkey_asm.startsWith("OP_RETURN OP_PUSHDATA1 48454d4901")) {
            //           this.emit(TxTypesEnum.Pop, BtcBlock.create({txType: TxType.create(TxTypesEnum.Pop), 
            //                       address: Address.create(detail.txid)}))
            //         }
            //       }
            //     })
            //   } catch (error) {
            //     console.log(error)
            //   }
            //   // console.log(detail.vout);
            // })
          }
        }
      }
    } catch (error) {
        console.log(error)
    }
  }

  poll(endpoint: string, pollingInterval: number) {
    console.log("begin polling with", endpoint)
    this.pollingIntervalId = setInterval(() => this.checkNewBlocks(), pollingInterval);
  }
}
