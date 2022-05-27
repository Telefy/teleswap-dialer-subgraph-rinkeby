import { DialerContract } from '../../generated/schema'
import { dataSource, ethereum } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO } from '../../packages/constants/index.template'

export function getDialerContract(block: ethereum.Block): DialerContract {
  let dialerContract = DialerContract.load(dataSource.address().toHex())

  if (dialerContract === null) {
    dialerContract = new DialerContract(dataSource.address().toHex())
    dialerContract.totalAllocPoint = BIG_INT_ZERO
    dialerContract.poolCount = BIG_INT_ZERO
  }

  dialerContract.timestamp = block.timestamp
  dialerContract.block = block.number
  dialerContract.save()

  return dialerContract as DialerContract
}
