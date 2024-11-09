import { Event, Observable, TxTypesEnum } from '@cryptochords/shared'
import { ListTransactionsService } from '../../../../application/services/ListTransactions/ListTransactionsService'
import { Presenter } from '../../base/Presenter'
import { TransactionsPresenterState } from './TransactionsPresenterState'

const initalState: TransactionsPresenterState = {
  transactions: [],
}

export const titleMap: Map<TxTypesEnum, string> = new Map([
  [TxTypesEnum.Block, 'ETH BLK'],
  [TxTypesEnum.Eth, 'ETH'],
  [TxTypesEnum.Pop, 'PoP'],
  [TxTypesEnum.Btc, 'BTC'],
  [TxTypesEnum.BtcBlock, 'BTC BLK'],

])

const rgbMap: Map<TxTypesEnum, string> = new Map([
  [TxTypesEnum.Block, '#10FF2A'],
  [TxTypesEnum.Eth, '#00D3FF'],
  [TxTypesEnum.Pop, '#DC53FF'],
  [TxTypesEnum.Btc, '#FFB200'],
  [TxTypesEnum.BtcBlock, '#FFA500']
])

const messageMap: Map<TxTypesEnum, string> = new Map([
  [TxTypesEnum.Block, 'created by'],
  [TxTypesEnum.BtcBlock, 'digged by'],
  [TxTypesEnum.Eth, 'transaction by'],
  [TxTypesEnum.Pop, 'transaction by'],
  [TxTypesEnum.Btc, 'transaction by']
])

const urlPatternMap: Map<TxTypesEnum, string> = new Map([
  [TxTypesEnum.Block, import.meta.env['VITE_EXPLORER_BLOCK_URL']],
  [TxTypesEnum.BtcBlock, import.meta.env['VITE_EXPLORER_BTC_BLOCK_URL']],
  [TxTypesEnum.Eth, import.meta.env['VITE_EXPLORER_ETH_URL']],
  [TxTypesEnum.Pop, import.meta.env['VITE_EXPLORER_POP_URL']],
  [TxTypesEnum.Btc, import.meta.env['VITE_EXPLORER_BTC_URL']]
])

export class TransactionsPresenter extends Presenter<TransactionsPresenterState> {

  private listTransactions: ListTransactionsService

  constructor(listTransactions: ListTransactionsService, transactionsChangeObserver?: Observable<Event>) {
    super(initalState)
    this.listTransactions = listTransactions
    if(transactionsChangeObserver) {
      transactionsChangeObserver.listen(this.refresh.bind(this))
    }
  }

  async refresh() { 
    const response = await this.listTransactions.execute()
    this.changeState({
      transactions: response.transactions.map(transaction => ({
        type: titleMap.get(transaction.txType as TxTypesEnum) ?? 'Unknown',
        color: rgbMap.get(transaction.txType as TxTypesEnum) ?? '#fff',
        message: messageMap.get(transaction.txType as TxTypesEnum) ?? ' ',
        id: transaction.address,
        at: this.formatDate(transaction.timestamp),
        url: this.buildTransactionUrl(transaction.txType as TxTypesEnum, transaction.address)
      }))
    })
  }

  private formatDate(date: number) {
    const formattedDate = new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    })

    return formattedDate.replace(/,/g, '')
  }

  private buildTransactionUrl(txType: TxTypesEnum, address: string) {
    const pattern = urlPatternMap.get(txType)
    if(pattern) {
      // replaces ${hash} with the address ignoring spaces and tabs within the brackets
      const regex = /\$\{[ \t]*hash[ \t]*\}/i
      return pattern.replace(regex, address)
    }
    return `#${address}`
  }
}
