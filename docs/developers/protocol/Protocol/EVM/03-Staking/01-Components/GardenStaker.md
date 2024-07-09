---
id: garden-staker
title: Garden Staker
sidebar_label: Garden Staker
sidebar_position: 1
---

# Garden Staker

The Garden Staker inherits `DelgateManager` and `FillerManager` contracts directly and `BaseStaker` contract indirectly. It is responsible for managing the staking of native tokens in the Garden.

## Function

### constructor

```solidity
constructor(
    address seed,
    uint256 delegateStake,
    uint256 fillerStake,
    uint256 fillerCooldown
) BaseStaker(seed, delegateStake, fillerStake, fillerCooldown) {}
```

The constructor initializes the `GardenStaker` contract with the following parameters:

- `seed`: Address of the base stake token.
- `delegateStake`: Amount of seed to stake as a delegate.
- `fillerStake`: Amount of seed to stake as a filler.
- `fillerCooldown`: Cooldown period for fillers to be refunded after de-registration.

It inherits from `BaseStaker` and initializes the state with the provided parameters.
