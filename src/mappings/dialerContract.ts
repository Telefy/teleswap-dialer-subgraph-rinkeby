import {
  Deposit,
  Withdraw,
  EmergencyWithdraw,
  Harvest,
  LogPoolAddition,
  LogSetPool,
  LogUpdatePool,
  AddMultiplier
} from '../../generated/DialerContract/DialerContract'

import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from '@graphprotocol/graph-ts'
import {
  BIG_DECIMAL_1E12,
  BIG_DECIMAL_1E18,
  BIG_DECIMAL_ZERO,
  BIG_INT_ONE,
  BIG_INT_ONE_DAY_SECONDS,
  BIG_INT_ZERO,
  ACC_TELE_PRECISION
} from '../../packages/constants/index.template'
import { DialerContract, Pool, User, Rewarder } from '../../generated/schema'

import {
  getDialerContract,
  getPool,
  getRewarder,
  getUser,
  updateRewarder
} from '../entities'

import { ERC20 as ERC20Contract } from '../../generated/DialerContract/ERC20'

export function logPoolAddition(event: LogPoolAddition): void {
  log.info('[DialerContract] Log Pool Addition {} {} {} {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString(),
    event.params.lpToken.toHex(),
    event.params.rewarder.toHex()
  ])

  const dialercontract = getDialerContract(event.block)
  const pool = getPool(event.params.pid, event.block)
  const rewarder = getRewarder(event.params.rewarder, event.block)

  pool.pair = event.params.lpToken
  pool.rewarder = rewarder.id
  pool.allocPoint = event.params.allocPoint
  pool.save()

  dialercontract.totalAllocPoint = dialercontract.totalAllocPoint.plus(pool.allocPoint)
  dialercontract.poolCount = dialercontract.poolCount.plus(BIG_INT_ONE)
  dialercontract.save()
}

export function logSetPool(event: LogSetPool): void {
  log.info('[DialerContract] Log Set Pool {} {} {} {}', [
    event.params.pid.toString(),
    event.params.allocPoint.toString(),
    event.params.rewarder.toHex(),
    event.params.overwrite == true ? 'true' : 'false'
  ])

  const dialercontract = getDialerContract(event.block)
  const pool = getPool(event.params.pid, event.block)

  if (event.params.overwrite == true) {
    const rewarder = getRewarder(event.params.rewarder, event.block)
    pool.rewarder = rewarder.id
  }

  dialercontract.totalAllocPoint = dialercontract.totalAllocPoint.plus(event.params.allocPoint.minus(pool.allocPoint))
  dialercontract.save()

  pool.allocPoint = event.params.allocPoint
  pool.save()
}

export function logUpdatePool(event: LogUpdatePool): void {
  log.info('[DialerContract] Log Update Pool {} {} {} {}', [
    event.params.pid.toString(),
    event.params.lastRewardBlock.toString(),
    event.params.lpSupply.toString(),
    event.params.accTelePerShare.toString()
  ])

  const dialercontract = getDialerContract(event.block)
  const pool = getPool(event.params.pid, event.block)
  const poolRewarderString = pool.rewarder
  if (poolRewarderString) {
    updateRewarder(Address.fromString(poolRewarderString))
    pool.accTelePerShare = event.params.accTelePerShare
    pool.lastRewardBlock = event.params.lastRewardBlock
    pool.save()
  }
}

export function addMultiplier(event: AddMultiplier): void {
  log.info('[DialerContract] Log new AddMultiplier {} {}', [
    event.params.multiplier.toString(),
    event.params.endBlock.toString(),
  ])
  const dialercontract = getDialerContract(event.block)
  dialercontract.bonusMultiplier = event.params.multiplier
  dialercontract.bonusEndBlock = event.params.endBlock
  dialercontract.save()
}

export function deposit(event: Deposit): void {
  log.info('[DialerContract] Log Deposit {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex()
  ])

  const dialercontract = getDialerContract(event.block)
  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.to, event.params.pid, event.block)

  pool.slpBalance = pool.slpBalance.plus(event.params.amount)
  pool.save()

  user.amount = user.amount.plus(event.params.amount)
  user.rewardDebt = user.rewardDebt.plus(event.params.amount.times(pool.accTelePerShare).div(ACC_TELE_PRECISION))
  user.save()
}

export function withdraw(event: Withdraw): void {
  log.info('[DialerContract] Log Withdraw {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex()
  ])

  const dialercontract = getDialerContract(event.block)
  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.user, event.params.pid, event.block)

  pool.slpBalance = pool.slpBalance.minus(event.params.amount)
  pool.save()

  user.amount = user.amount.minus(event.params.amount)
  user.rewardDebt = user.rewardDebt.minus(event.params.amount.times(pool.accTelePerShare).div(ACC_TELE_PRECISION))
  user.save()
}

export function emergencyWithdraw(event: EmergencyWithdraw): void {
  log.info('[DialerContract] Log Emergency Withdraw {} {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString(),
    event.params.to.toHex()
  ])

  const dialerContract = getDialerContract(event.block)
  const user = getUser(event.params.user, event.params.pid, event.block)

  user.amount = BIG_INT_ZERO
  user.rewardDebt = BIG_INT_ZERO
  user.save()
}

export function harvest(event: Harvest): void {
  log.info('[DialerContract] Log Withdraw {} {} {}', [
    event.params.user.toHex(),
    event.params.pid.toString(),
    event.params.amount.toString()
  ])

  const dialerContract = getDialerContract(event.block)
  const pool = getPool(event.params.pid, event.block)
  const user = getUser(event.params.user, event.params.pid, event.block)

  let accumulatedTele = user.amount.times(pool.accTelePerShare).div(ACC_TELE_PRECISION)

  user.rewardDebt = accumulatedTele
  user.teleHarvested = user.teleHarvested.plus(event.params.amount)
  user.save()
}
