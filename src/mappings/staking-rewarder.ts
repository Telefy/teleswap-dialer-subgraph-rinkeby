import { Address, BigInt, log } from '@graphprotocol/graph-ts'

import { StakingRewardsTele as StakingRewardsContract} from '../../generated/templates/StakingRewardsTele/StakingRewardsTele'
import { RewardAdded } from '../../generated/templates/StakingRewardsTele/StakingRewardsTele'
import { getRewarder } from '../entities'

export function rewardAdded(event: RewardAdded): void {
  log.info('[DialerContract:StakingRewarder] Log Reward Added {}', [
    event.params.reward.toString()
  ])
  const rewarderContract = StakingRewardsContract.bind(event.address)

  const rewarder = getRewarder(event.address, event.block)
  rewarder.rewardPerSecond = rewarderContract.rewardPerSecond()
  rewarder.save()
}
