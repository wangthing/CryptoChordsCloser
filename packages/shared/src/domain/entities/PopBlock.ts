import { Entity } from '../base/Entity'
import { TxTypesEnum } from '../enums/TxTypesEnum'
import { Address } from '../valueObjects/Address'
import { TxType } from '../valueObjects/Txtype'
import { Uuid } from '../valueObjects/Uuid'

interface PopBlockProps {
  txType: TxType
  address: Address
}

interface PopBlockJSON {
  txType: string
  address: string
}

export class PopBlock extends Entity<PopBlockProps> {
  private constructor(props: PopBlockProps, id: Uuid) {
    super(props, id)
  }

  static create(props: PopBlockProps, id?: Uuid): PopBlock {
    const blockId = id ?? Uuid.create()
    return new PopBlock(props, blockId)
  }

  static fromJSON(json: PopBlockJSON): PopBlock {
    return PopBlock.create({
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

  toJSON(): PopBlockJSON {
    return {
      txType: this.txType,
      address: this.address,
    }
  }
}
