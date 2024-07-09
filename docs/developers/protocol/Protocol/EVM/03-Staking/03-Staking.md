---
id: staking
title: Staking
sidebar_label: Staking
---

# Staking

Stakers play a crucial role in maintaining the system's integrity by overseeing Order Fillers and ensuring their ethical and efficient operation. To become a staker, you must hold at least 2,100 SEED tokens on the Arbitrum chain. The staking APY is dynamic and depends on the number of Garden users staking and the duration of their stakes. The staking APY can be viewed on Garden's staking page. A staking multiplier incentivize long-term commitment, boosting voting/earning capability based on the staking duration. For instance, staking for 6 months gives 1 vote, while staking for 4 years means 4 votes and 4x the APY compared to a 6-month stake.

## Smart Contracts

```javascript title="GardenStaker.sol"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./DelegateManager.sol";
import "./FillerManager.sol";

contract GardenStaker is DelegateManager, FillerManager {
    constructor(
        address seed,
        uint256 delegateStake,
        uint256 fillerStake,
        uint256 fillerCooldown
    ) BaseStaker(seed, delegateStake, fillerStake, fillerCooldown) {}
}
```

```javascript title="DelegateManager.sol"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./BaseStaker.sol";

abstract contract DelegateManager is BaseStaker {
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.Bytes32Set;

    uint256 constant HALF_YEAR = 180 * 7200;
    uint256 constant ONE_YEAR = 365 * 7200;
    uint256 constant TWO_YEARS = 730 * 7200;
    uint256 constant FOUR_YEARS = 1460 * 7200;
    uint256 constant MAX_UINT_256 = type(uint256).max;

    event Voted(bytes32 indexed stakeID, address indexed filler, uint256 votes);
    event VotesChanged(bytes32 indexed stakeID, address indexed oldFiller, address indexed newFiller);

    event Staked(bytes32 indexed stakeID, address indexed owner, uint256 stake, uint256 expiry);
    event StakeExtended(bytes32 indexed stakeID, uint256 newLockBlocks);
    event StakeRenewed(bytes32 indexed stakeID, uint256 newLockBlocks);
    event StakeRefunded(bytes32 indexed stakeID);

    function vote(address filler, uint256 units, uint256 lockBlocks) external returns (bytes32 stakeID) {
        _checkRole(FILLER, filler);
        require(units != 0, "DelegateManager: zero unit");

        uint8 multiplier = _calculateVoteMultiplier(lockBlocks);
        uint256 stakeAmount = units * DELEGATE_STAKE;

        stakeID = keccak256(abi.encodePacked(_msgSender(), delegateNonce[_msgSender()]));
        uint256 expiry = multiplier == uint8(7) ? MAX_UINT_256 : block.number + lockBlocks;

        stakes[stakeID] = Stake({
            owner: _msgSender(),
            stake: stakeAmount,
            units: units,
            votes: units * multiplier,
            filler: filler,
            expiry: expiry
        });
        delegateNonce[_msgSender()]++;

        require(
            fillers[stakes[stakeID].filler].delegateStakeIDs.add(stakeID),
            "DelegateManager: stakeID already exists"
        );

        SEED.safeTransferFrom(_msgSender(), address(this), stakeAmount);

        emit Staked(stakeID, stakes[stakeID].owner, stakes[stakeID].stake, stakes[stakeID].expiry);

        emit Voted(stakeID, stakes[stakeID].filler, stakes[stakeID].votes);
    }

    function changeVote(bytes32 stakeID, address newFiller) external {
        _checkRole(FILLER, newFiller);

        Stake memory stake = stakes[stakeID];
        require(stake.owner == _msgSender(), "DelegateManager: stake owner mismatch");
        require(stake.expiry > block.number, "DelegateManager: stake expired");

        address oldFiller = stake.filler;
        stake.filler = newFiller;
        stakes[stakeID] = stake;

        emit VotesChanged(stakeID, oldFiller, stake.filler);

        require(fillers[oldFiller].delegateStakeIDs.remove(stakeID), "DelegateManager: stakeID not found");
        require(fillers[stake.filler].delegateStakeIDs.add(stakeID), "DelegateManager: stakeID already exists");
    }

    function refund(bytes32 stakeID) external {
        Stake memory stake = stakes[stakeID];

        require(stake.expiry < block.number, "DelegateManager: stake not expired");
        require(stake.owner != address(0), "DelegateManager: stake not found");

        require(fillers[stake.filler].delegateStakeIDs.remove(stakeID), "DelegateManager: stakeID not found");

        delete (stakes[stakeID]);

        SEED.safeTransfer(stake.owner, stake.stake);

        emit StakeRefunded(stakeID);
    }

    function renew(bytes32 stakeID, uint256 newLockBlocks) external {
        Stake memory stake = stakes[stakeID];

        require(stake.owner == _msgSender(), "DelegateManager: incorrect owner");
        require(stake.expiry < block.number, "DelegateManager: stake not expired");

        uint8 multiplier = _calculateVoteMultiplier(newLockBlocks);
        stake.expiry = multiplier == uint8(7) ? MAX_UINT_256 : block.number + newLockBlocks;
        stake.votes = multiplier * stake.units;

        stakes[stakeID] = stake;

        emit StakeRenewed(stakeID, newLockBlocks);
    }

    function extend(bytes32 stakeID, uint256 newLockBlocks) external {
        Stake memory stake = stakes[stakeID];

        require(stake.owner == _msgSender(), "DelegateManager: caller is not the owner of the stake");
        require(stake.expiry > block.number, "DelegateManager: expired stake");

        uint8 multiplier = _calculateVoteMultiplier(newLockBlocks);
        if (multiplier > stake.votes / stake.units) {
            stake.votes = multiplier * stake.units;
        }
        stake.expiry = multiplier == uint8(7) ? MAX_UINT_256 : stake.expiry + newLockBlocks;

        stakes[stakeID] = stake;

        emit StakeExtended(stakeID, newLockBlocks);
    }

    function getVotes(address filler) external view returns (uint256 voteCount) {
        bytes32[] memory delegates = fillers[filler].delegateStakeIDs.values();
        uint256 delegateLength = delegates.length;

        for (uint256 i = 0; i < delegateLength; i++) {
            Stake memory stake = stakes[delegates[i]];
            if (stake.expiry > block.number) {
                voteCount += stake.votes;
            }
        }
    }

    function _calculateVoteMultiplier(uint256 lockBlocks) internal pure returns (uint8) {
        if (lockBlocks == HALF_YEAR) {
            return 1;
        }
        if (lockBlocks == ONE_YEAR) {
            return 2;
        }
        if (lockBlocks == TWO_YEARS) {
            return 3;
        }
        if (lockBlocks == FOUR_YEARS) {
            return 4;
        }
        if (lockBlocks == MAX_UINT_256) {
            return 7;
        }

        revert("DelegateManager: incorrect lock duration");
    }
}
```

```javascript title="FillerManager.sol"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./BaseStaker.sol";

abstract contract FillerManager is BaseStaker {
    using SafeERC20 for IERC20;

    uint16 constant MAX_Fee_IN_BIPS = 10_000;

    event FillerRegistered(address indexed filler);
    event FillerFeeUpdated(address indexed filler, uint256 fee);
    event FillerDeregistered(address indexed filler, uint256 deregisteredAt);
    event FillerRefunded(address indexed filler);

    function register() external {
        require(fillers[_msgSender()].stake == 0, "FillerManager: already registered");

        fillers[_msgSender()].stake = FILLER_STAKE;

        _grantRole(FILLER, _msgSender());

        SEED.safeTransferFrom(_msgSender(), address(this), FILLER_STAKE);

        emit FillerRegistered(_msgSender());
    }

    function deregister() external onlyRole(FILLER) {
        fillers[_msgSender()].deregisteredAt = block.number;

        _revokeRole(FILLER, _msgSender());

        emit FillerDeregistered(_msgSender(), block.number);
    }

    function refund(address filler_) external {
        Filler storage filler = fillers[filler_];

        require(filler.deregisteredAt != 0, "FillerManager: not deregistered");
        require(filler.deregisteredAt + FILLER_COOL_DOWN < block.number, "FillerManager: cooldown not passed");

        fillers[filler_].feeInBips = 0;
        fillers[filler_].stake = 0;
        fillers[filler_].deregisteredAt = 0;

        SEED.safeTransfer(filler_, FILLER_STAKE);

        emit FillerRefunded(filler_);
    }

    function updateFee(uint16 newFee) external onlyRole(FILLER) {
        require(newFee < MAX_Fee_IN_BIPS, "FillerManager: fee too high");

        fillers[_msgSender()].feeInBips = newFee;

        emit FillerFeeUpdated(_msgSender(), fillers[_msgSender()].feeInBips);
    }
}
```

```javascript title="BaseStaker.sol"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

abstract contract BaseStaker is AccessControl {
    using EnumerableSet for EnumerableSet.Bytes32Set;

    struct Stake {
        address owner;
        uint256 stake;
        uint256 units;
        uint256 votes;
        address filler;
        uint256 expiry;
    }

    struct Filler {
        uint16 feeInBips;
        uint256 stake;
        uint256 deregisteredAt;
        EnumerableSet.Bytes32Set delegateStakeIDs;
    }

    IERC20 public immutable SEED;

    uint256 public immutable DELEGATE_STAKE;

    uint256 public immutable FILLER_STAKE;
    uint256 public immutable FILLER_COOL_DOWN;
    bytes32 public constant FILLER = keccak256("FILLER");

    mapping(bytes32 => Stake) public stakes;
    mapping(address => uint256) public delegateNonce;

    mapping(address => Filler) internal fillers;

    constructor(address seed, uint256 delegateStake, uint256 fillerStake, uint256 fillerCooldown) {
        require(seed != address(0), "BaseStaker: seed is zero address");

        SEED = IERC20(seed);
        DELEGATE_STAKE = delegateStake;
        FILLER_STAKE = fillerStake;
        FILLER_COOL_DOWN = fillerCooldown;
    }

    function getFiller(
        address filler
    )
        external
        view
        returns (uint16 feeInBips, uint256 stake, uint256 deregisteredAt, bytes32[] memory delegateStakeIDs)
    {
        Filler storage f = fillers[filler];
        return (f.feeInBips, f.stake, f.deregisteredAt, f.delegateStakeIDs.values());
    }
}
```

### Deployed Addresses

The Staking smart contracts are deployed at the following address on Arbitrum:
| Network | Chain ID | Address |
| --- | --- | --- |
| Arbitrum | 42161 | [`0x86f65121804d2cdbef79f9f072d4e0c2eebabc08`](https://arbiscan.io/token/0x86f65121804d2cdbef79f9f072d4e0c2eebabc08) |
