---
id: delegate-manager
title: Delegate Manager
sidebar_label: Delegate Manager
sidebar_position: 2
---

# Delegate Manager

The DelegateManager contract enables users to stake tokens, delegate voting power to fillers, and manage (change, extend, renew, refund) their stakes. It also tracks the total votes for each filler and ensures proper vote calculation based on stake duration.

## State Variables

### HALF_YEAR

```solidity
uint256 constant HALF_YEAR = 180 * 7200;
```

Constant value representing approximately half a year in blocks.

### ONE_YEAR

```solidity
uint256 constant ONE_YEAR = 365 * 7200;
```

Constant value representing approximately one year in blocks.

### TWO_YEARS

```solidity
uint256 constant TWO_YEARS = 730 * 7200;
```

Constant value representing approximately two years in blocks.

### FOUR_YEARS

```solidity
uint256 constant FOUR_YEARS = 1460 * 7200;
```

Constant value representing approximately four years in blocks.

### MAX_UINT_256

```solidity
uint256 constant MAX_UINT_256 = type(uint256).max;
```

Maximum value of a `uint256` variable.

## Events

### Voted

```solidity
event Voted(bytes32 indexed stakeID, address indexed filler, uint256 votes);
```

Emitted when a user stakes tokens and delegates voting power to a filler.

- `stakeID`: ID of the stake.
- `filler`: Address of the filler to delegate the voting power to.
- `votes`: Number of votes delegated to the filler.

### VotesChanged

```solidity
event VotesChanged(bytes32 indexed stakeID, address indexed oldFiller, address indexed newFiller);
```

Emitted when the stake owner changes the voting power delegation from one filler to another.

- `stakeID`: ID of the stake.
- `oldFiller`: Address of the previous filler.
- `newFiller`: Address of the new filler.

### Staked

```solidity
event Staked(bytes32 indexed stakeID, address indexed owner, uint256 stake, uint256 expiry);
```

Emitted when a user stakes tokens and delegates voting power to a filler.

- `stakeID`: ID of the stake.
- `owner`: Address of the stake owner.
- `stake`: Amount of tokens staked.
- `expiry`: Block number at which the stake expires.

### StakeExtended

```solidity
event StakeExtended(bytes32 indexed stakeID, uint256 newLockBlocks);
```

Emitted when the stake owner extends the lock duration of a stake.

- `stakeID`: ID of the stake.
- `newLockBlocks`: New number of blocks the stake is locked for.

### StakeRenewed

```solidity
event StakeRenewed(bytes32 indexed stakeID, uint256 newLockBlocks);
```

Emitted when the stake owner renews a stake by again choosing the lock duration.

- `stakeID`: ID of the stake.
- `newLockBlocks`: New number of blocks the stake is locked for.

### StakeRefunded

```solidity
event StakeRefunded(bytes32 indexed stakeID);
```

Emitted when the stake owner refunds their staked tokens.

- `stakeID`: ID of the stake.

## Functions

### vote

```solidity
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
```

- `filler`: The address of the filler to delegate the voting power to.
- `units`: The number of units to stake.
- `lockBlocks`: The number of blocks to lock the stake for.

Allows a user to stake their tokens and delegate their voting power to a filler.

1. Checks if the `filler` address has the `FILLER` role.
2. Requires that the `units` parameter is not zero.
3. Calculates the vote multiplier based on the `lockBlocks` parameter.
4. Calculates the `stakeAmount` by multiplying the `units` with the `DELEGATE_STAKE` value.
5. Generates a unique `stakeID` by hashing the sender's address and the sender's nonce.
6. Sets the `expiry` value based on the vote multiplier.
7. Creates a new `Stake` struct with the stake details.
8. Increments the sender's nonce.
9. Adds the `stakeID` to the `delegateStakeIDs` set of the filler.
10. Transfers the `stakeAmount` from the sender to the contract.
11. Emits a `Staked` event with the stake details.
12. Emits a `Voted` event with the voting details.

### changeVote

```solidity
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
```

- `stakeID`: The ID of the stake to change the vote for.
- `newFiller`: The address of the new filler to delegate the voting power to.

Allows the stake owner to change the voting power delegation from one filler to another.

1. Checks if the `newFiller` address has the `FILLER` role.
2. Retrieves the `Stake` struct using the `stakeID`.
3. Requires that the caller is the owner of the stake.
4. Requires that the stake has not expired.
5. Updates the `filler` address in the `Stake` struct.
6. Updates the `stakes` mapping with the modified `Stake` struct.
7. Emits a `VotesChanged` event with the old and new filler addresses.
8. Removes the `stakeID` from the `delegateStakeIDs` set of the old filler.
9. Adds the `stakeID` to the `delegateStakeIDs` set of the new filler.

### refund

```solidity
function refund(bytes32 stakeID) external {
    Stake memory stake = stakes[stakeID];

    require(stake.expiry < block.number, "DelegateManager: stake not expired");
    require(stake.owner != address(0), "DelegateManager: stake not found");

    require(fillers[stake.filler].delegateStakeIDs.remove(stakeID), "DelegateManager: stakeID not found");

    delete (stakes[stakeID]);

    SEED.safeTransfer(stake.owner, stake.stake);

    emit StakeRefunded(stakeID);
}
```

- `stakeID`: The ID of the stake to refund.

Allows the stake owner to refund their staked tokens.

1. Retrieves the `Stake` struct using the `stakeID`.
2. Requires that the stake has expired.
3. Requires that the stake exists.
4. Removes the `stakeID` from the `delegateStakeIDs` set of the filler.
5. Deletes the `stakeID` from the `stakes` mapping.
6. Transfers the staked tokens back to the stake owner.
7. Emits a `StakeRefunded` event with the `stakeID`.

### renew

```solidity
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
```

- `stakeID`: The ID of the stake to renew.
- `newLockBlocks`: The new number of blocks to lock the stake for.

Allows the stake owner to renew their stake by extending the lock duration and updating the voting power.

1. Retrieves the `Stake` struct using the `stakeID`.
2. Requires that the caller is the owner of the stake.
3. Requires that the stake has expired.
4. Calculates the vote multiplier based on the `newLockBlocks` parameter.
5. Updates the `expiry` value based on the vote multiplier.
6. Updates the `votes` value based on the new vote multiplier.
7. Updates the `stakes` mapping with the modified `Stake` struct.
8. Emits a `StakeRenewed` event with the `stakeID` and the new lock duration.

### extend

```solidity
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
```

- `stakeID`: The ID of the stake to extend.
- `newLockBlocks`: The new number of blocks to lock the stake for.

Allows the stake owner to extend the lock duration and update the voting power of a stake.

1. Retrieves the `Stake` struct using the `stakeID`.
2. Requires that the caller is the owner of the stake.
3. Requires that the stake has not expired.
4. Calculates the vote multiplier based on the `newLockBlocks` parameter.
5. Updates the `votes` value if the new multiplier is greater than the current vote multiplier.
6. Updates the `expiry` value based on the vote multiplier.
7. Updates the `stakes` mapping with the modified `Stake` struct.
8. Emits a `StakeExtended` event with the `stakeID` and the new lock duration.

### getVotes

```solidity
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
```

- `filler`: The address of the filler to retrieve the vote count for.

Retrieves the total number of votes delegated to a specific filler address.

1. Retrieves the list of `delegateStakeIDs` for the filler.
2. Iterates through the list of `delegateStakeIDs`.
3. Retrieves the `Stake` struct using the `stakeID`.
4. Checks if the stake has not expired.
5. Adds the votes delegated to the filler to the `voteCount`.

### \_calculateVoteMultiplier

```solidity
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
```

- `lockBlocks`: The number of blocks to lock the stake for.

Calculates the vote multiplier based on the lock duration in blocks.

1. Checks if the `lockBlocks` parameter is equal to `HALF_YEAR` and returns `1`.
2. Checks if the `lockBlocks` parameter is equal to `ONE_YEAR` and returns `2`.
3. Checks if the `lockBlocks` parameter is equal to `TWO_YEARS` and returns `3`.
4. Checks if the `lockBlocks` parameter is equal to `FOUR_YEARS` and returns `4`.
5. Checks if the `lockBlocks` parameter is equal to `MAX_UINT_256` and returns `7`.
6. Reverts with an error message if the lock duration is not one of the specified values.
