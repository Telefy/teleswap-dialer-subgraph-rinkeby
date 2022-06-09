import { DialerContract } from '../../generated/schema'
import { dataSource, ethereum } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO, BIG_INT_ONE_HUNDRED } from '../../packages/constants/index.template'
import { DialerContract as Contract } from '../../generated/DialerContract/DialerContract'

export function getDialerContract(block: ethereum.Block): DialerContract {
  let dialerContract = DialerContract.load(dataSource.address().toHex())

  if (dialerContract === null) {
    const contract = Contract.bind(dataSource.address())
    let bonusInfo = contract.bonusInfo(BIG_INT_ZERO)
    dialerContract = new DialerContract(dataSource.address().toHex())
    dialerContract.totalAllocPoint = BIG_INT_ZERO
    dialerContract.telePerBlock = contract.TELE_PER_BLOCK()
    dialerContract.bonusMultiplier = bonusInfo.value0
    dialerContract.bonusEndBlock = bonusInfo.value2
    dialerContract.poolCount = BIG_INT_ZERO
  }

  dialerContract.timestamp = block.timestamp
  dialerContract.block = block.number
  dialerContract.save()

  return dialerContract as DialerContract
}
