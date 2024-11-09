import { Entity } from '../base/Entity'
import { TxTypesEnum } from '../enums/TxTypesEnum'
import { Address } from '../valueObjects/Address'
import { TxType } from '../valueObjects/Txtype'
import { Uuid } from '../valueObjects/Uuid'

interface BtcBlockProps {
  txType: TxType
  address: Address
}

interface BtcBlockJSON {
  txType: string
  address: string
}

export class BtcBlock extends Entity<BtcBlockProps> {
  private constructor(props: BtcBlockProps, id: Uuid) {
    super(props, id)
  }

  static create(props: BtcBlockProps, id?: Uuid): BtcBlock {
    const blockId = id ?? Uuid.create()
    return new BtcBlock(props, blockId)
  }

  static fromJSON(json: BtcBlockJSON): BtcBlock {
    return BtcBlock.create({
      txType: TxType.create(json.txType as TxTypesEnum),
      address: Address.create(json.address)
    })
  }

  get txType(): string {
    return this.props.txType.value
  }

  get address(): string {
    return this.props.address.value
  }

  toJSON(): BtcBlockJSON {
    return {
      txType: this.txType,
      address: this.address,
    }
  }
}
