---
id: base-staker
title: Base Staker
sidebar_label: Base Staker
sidebar_position: 4
---

# Base Staker

The Base Staker contract is responsible for managing staking operations. It defines the data structures for stakes and fillers and provides a function to retrieve filler information. This contract is designed to be extended by other contracts that implement specific staking mechanisms.

<!-- // SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/**
 * @title BaseStaker
 * @dev This contract serves as the base contract for staking functionality.
 * It provides structs and mappings [STATE] to manage stakes and fillers.
 * It also includes a function to retrieve filler information.
 */
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

    /**
     * @dev Retrieves information about a filler.
     * @param filler The address of the filler.
     * @return feeInBips The fee in basis points set by the filler.
     * @return stake The total stake amount of the filler.
     * @return deregisteredAt The timestamp when the filler was deregistered.
     * @return delegateStakeIDs An array of delegate stake IDs associated with the filler.
     */
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
} -->

## Structs

### Stake

```solidity
struct Stake {
    address owner;
    uint256 stake;
    uint256 units;
    uint256 votes;
    address filler;
    uint256 expiry;
}
```

- `owner`: The address of the staker.
- `stake`: The amount of tokens staked.
- `units`: The number of units the staker has.
- `votes`: The number of votes the staker has.
- `filler`: The address of the filler associated with the stake.
- `expiry`: The block number at which the stake expires.

### Filler

```solidity
struct Filler {
    uint16 feeInBips;
    uint256 stake;
    uint256 deregisteredAt;
    EnumerableSet.Bytes32Set delegateStakeIDs;
}
```

- `feeInBips`: The fee in basis points (bips) set by the filler.
- `stake`: The total stake amount of the filler.
- `deregisteredAt`: The block number at which filler was deregistered.
- `delegateStakeIDs`: An enumerable set of delegate stake IDs associated with the filler.

## State Variables

### SEED

```solidity
IERC20 public immutable SEED;
```

The SEED token contract.

### DELEGATE_STAKE

```solidity
uint256 public immutable DELEGATE_STAKE;
```

The minimum stake required for a delegate.

### FILLER_STAKE

```solidity
uint256 public immutable FILLER_STAKE;
```

The minimum stake required for a filler.

### FILLER_COOL_DOWN

```solidity
uint256 public immutable FILLER_COOL_DOWN;
```

The cooldown period for a filler to deregister.

### FILLER

```solidity
bytes32 public constant FILLER = keccak256("FILLER");
```

The role identifier for a filler.

### stakes

```solidity
mapping(bytes32 => Stake) public stakes;
```

A mapping of stake IDs to stake information.

### delegateNonce

```solidity
mapping(address => uint256) public delegateNonce;
```

A mapping of delegate addresses to nonces.

### fillers

```solidity
mapping(address => Filler) internal fillers;
```

A mapping of filler addresses to filler information.

## Functions

### constructor

```solidity
constructor(address seed, uint256 delegateStake, uint256 fillerStake, uint256 fillerCooldown) {
    require(seed != address(0), "BaseStaker: seed is zero address");

    SEED = IERC20(seed);
    DELEGATE_STAKE = delegateStake;
    FILLER_STAKE = fillerStake;
    FILLER_COOL_DOWN = fillerCooldown;
}
```

- `seed`: The address of the SEED token contract.
- `delegateStake`: The minimum stake required for a delegate.
- `fillerStake`: The minimum stake required for a filler.
- `fillerCooldown`: The cooldown period for a filler to deregister.

Initializes the contract with the specified parameters.

### getFiller

```solidity
function getFiller(address filler) external view returns (uint16 feeInBips, uint256 stake, uint256 deregisteredAt, bytes32[] memory delegateStakeIDs) {
    Filler storage f = fillers[filler];
    return (f.feeInBips, f.stake, f.deregisteredAt, f.delegateStakeIDs.values());
}
```

- `filler`: The address of the filler.

Retrieves information about a filler.

1. Retrieve the filler information from the `fillers` mapping.
2. Return the filler information.
   - `feeInBips`: The fee in basis points set by the filler.
   - `stake`: The total stake amount of the filler.
   - `deregisteredAt`: The timestamp when the filler was deregistered.
   - `delegateStakeIDs`: An array of delegate stake IDs associated with the filler.
