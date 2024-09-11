// THIS IS EXAMPLE CODE. DO NOT USE THIS CODE IN PRODUCTION.
import { ethers } from "ethers";

// RandomNumberV2 address where the secure RNG is served (Flare Testnet Coston2)
// See https://dev.flare.network/network/solidity-reference
const ADDRESS = "0x5CdF9eAF3EB8b44fB696984a1420B56A7575D250";
const RPC_URL = "https://coston2-api.flare.network/ext/C/rpc";
// ABI for RandomNumberV2 contract
const ABI =
  '[{"inputs":[{"internalType":"address","name":"_signingPolicySetter","type":"address"},{"internalType":"uint32","name":"_initialRewardEpochId","type":"uint32"},{"internalType":"uint32","name":"_startingVotingRoundIdForInitialRewardEpochId","type":"uint32"},{"internalType":"bytes32","name":"_initialSigningPolicyHash","type":"bytes32"},{"internalType":"uint8","name":"_randomNumberProtocolId","type":"uint8"},{"internalType":"uint32","name":"_firstVotingRoundStartTs","type":"uint32"},{"internalType":"uint8","name":"_votingEpochDurationSeconds","type":"uint8"},{"internalType":"uint32","name":"_firstRewardEpochStartVotingRoundId","type":"uint32"},{"internalType":"uint16","name":"_rewardEpochDurationInVotingEpochs","type":"uint16"},{"internalType":"uint16","name":"_thresholdIncreaseBIPS","type":"uint16"},{"internalType":"uint32","name":"_messageFinalizationWindowInRewardEpochs","type":"uint32"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint8","name":"protocolId","type":"uint8"},{"indexed":true,"internalType":"uint32","name":"votingRoundId","type":"uint32"},{"indexed":false,"internalType":"bool","name":"isSecureRandom","type":"bool"},{"indexed":false,"internalType":"bytes32","name":"merkleRoot","type":"bytes32"}],"name":"ProtocolMessageRelayed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint24","name":"rewardEpochId","type":"uint24"},{"indexed":false,"internalType":"uint32","name":"startVotingRoundId","type":"uint32"},{"indexed":false,"internalType":"uint16","name":"threshold","type":"uint16"},{"indexed":false,"internalType":"uint256","name":"seed","type":"uint256"},{"indexed":false,"internalType":"address[]","name":"voters","type":"address[]"},{"indexed":false,"internalType":"uint16[]","name":"weights","type":"uint16[]"},{"indexed":false,"internalType":"bytes","name":"signingPolicyBytes","type":"bytes"},{"indexed":false,"internalType":"uint64","name":"timestamp","type":"uint64"}],"name":"SigningPolicyInitialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"rewardEpochId","type":"uint256"}],"name":"SigningPolicyRelayed","type":"event"},{"inputs":[{"internalType":"uint256","name":"_protocolId","type":"uint256"},{"internalType":"uint256","name":"_votingRoundId","type":"uint256"}],"name":"getConfirmedMerkleRoot","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRandomNumber","outputs":[{"internalType":"uint256","name":"_randomNumber","type":"uint256"},{"internalType":"bool","name":"_isSecureRandom","type":"bool"},{"internalType":"uint256","name":"_randomTimestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_timestamp","type":"uint256"}],"name":"getVotingRoundId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastInitializedRewardEpochData","outputs":[{"internalType":"uint32","name":"_lastInitializedRewardEpoch","type":"uint32"},{"internalType":"uint32","name":"_startingVotingRoundIdForLastInitializedRewardEpoch","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"protocolId","type":"uint256"},{"internalType":"uint256","name":"votingRoundId","type":"uint256"}],"name":"merkleRoots","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"relay","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint24","name":"rewardEpochId","type":"uint24"},{"internalType":"uint32","name":"startVotingRoundId","type":"uint32"},{"internalType":"uint16","name":"threshold","type":"uint16"},{"internalType":"uint256","name":"seed","type":"uint256"},{"internalType":"address[]","name":"voters","type":"address[]"},{"internalType":"uint16[]","name":"weights","type":"uint16[]"}],"internalType":"struct IIRelay.SigningPolicy","name":"_signingPolicy","type":"tuple"}],"name":"setSigningPolicy","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"signingPolicySetter","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"rewardEpochId","type":"uint256"}],"name":"startingVotingRoundIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"stateData","outputs":[{"internalType":"uint8","name":"randomNumberProtocolId","type":"uint8"},{"internalType":"uint32","name":"firstVotingRoundStartTs","type":"uint32"},{"internalType":"uint8","name":"votingEpochDurationSeconds","type":"uint8"},{"internalType":"uint32","name":"firstRewardEpochStartVotingRoundId","type":"uint32"},{"internalType":"uint16","name":"rewardEpochDurationInVotingEpochs","type":"uint16"},{"internalType":"uint16","name":"thresholdIncreaseBIPS","type":"uint16"},{"internalType":"uint32","name":"randomVotingRoundId","type":"uint32"},{"internalType":"bool","name":"isSecureRandom","type":"bool"},{"internalType":"uint32","name":"lastInitializedRewardEpoch","type":"uint32"},{"internalType":"bool","name":"noSigningPolicyRelay","type":"bool"},{"internalType":"uint32","name":"messageFinalizationWindowInRewardEpochs","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"rewardEpochId","type":"uint256"}],"name":"toSigningPolicyHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"}]';

export async function main() {
  // Connect to an RPC node
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  // Set up contract instance
  const randomV2 = new ethers.Contract(ADDRESS, JSON.parse(ABI), provider);
  // Fetch secure random number
  const res = await randomV2.getRandomNumber();
  // Log results
  console.log("Random Number:", res[0]);
  console.log("Is secure random:", res[1]);
  console.log("Timestamp:", res[2]);
  return res;
}

main();
