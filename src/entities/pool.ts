import { Pool } from '../../generated/schema'
import { BigInt, Address, dataSource, ethereum } from '@graphprotocol/graph-ts'
import { BIG_INT_ZERO, ADDRESS_ZERO } from '../../packages/constants/index.template'
import { getDialerContract } from './dialercontract'

export function getPool(pid: BigInt, block: ethereum.Block): Pool {
  const dialerContract = getDialerContract(block)

  let pool = Pool.load(pid.toString())

  if (pool === null) {
    pool = new Pool(pid.toString())
    pool.dialerContract = dialerContract.id
    pool.pair = ADDRESS_ZERO
    pool.allocPoint = BIG_INT_ZERO
    pool.lastRewardBlock = BIG_INT_ZERO
    pool.accTelePerShare = BIG_INT_ZERO
    pool.slpBalance = BIG_INT_ZERO
    pool.userCount = BIG_INT_ZERO
  }

  pool.timestamp = block.timestamp
  pool.block = block.number
  pool.save()

  return pool as Pool
}
