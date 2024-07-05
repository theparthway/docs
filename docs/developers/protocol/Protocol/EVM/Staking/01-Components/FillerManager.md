---
id: filler-manager
title: Filler Manager
sidebar_label: Filler Manager
sidebar_position: 3
---

# Filler Manager

The Filler Manager contract manages the registration and deregistration of fillers, ensuring they stake a required amount of tokens. It also handles fee updates and refunds for fillers after a cooldown period.

## State Variables

### MAX_Fee_IN_BIPS

```solidity
uint16 constant MAX_Fee_IN_BIPS = 10_000;
```

The maximum fee in basis points (bips) that a filler can set.

## Events

### FillerRegistered

```solidity
event FillerRegistered(address indexed filler);
```

Emitted when a filler is successfully registered.

- `filler`: The address of the filler who was registered.

### FillerFeeUpdated

```solidity
event FillerFeeUpdated(address indexed filler, uint256 fee);
```

Emitted when a filler updates their fee.

- `filler`: The address of the filler who updated their fee.
- `fee`: The new fee in basis points (bips) set by the filler.

### FillerDeregistered

```solidity
event FillerDeregistered(address indexed filler, uint256 deregisteredAt);
```

Emitted when a filler deregisters.

- `filler`: The address of the filler who deregistered.
- `deregisteredAt`: The block number at which the filler deregistered.

### FillerRefunded

```solidity
event FillerRefunded(address indexed filler);
```

Emitted when a filler is refunded their staked tokens.

- `filler`: The address of the filler who was refunded.

## Functions

### register

```solidity
function register() external {
    require(fillers[_msgSender()].stake == 0, "FillerManager: already registered");

    fillers[_msgSender()].stake = FILLER_STAKE;

    _grantRole(FILLER, _msgSender());

    SEED.safeTransferFrom(_msgSender(), address(this), FILLER_STAKE);

    emit FillerRegistered(_msgSender());
}
```

Registers a filler by transferring the `FILLER_STAKE` amount of tokens to the contract.

1. The function checks if the caller is not already registered as a filler.
2. The function sets the stake amount of the caller to `FILLER_STAKE`.
3. The function grants the `FILLER` role to the caller.
4. The function transfers the `FILLER_STAKE` amount of tokens from the caller to the contract.
5. The function emits a `FillerRegistered` event with the address of the filler who was registered.

### deregister

```solidity
function deregister() external onlyRole(FILLER) {
    fillers[_msgSender()].deregisteredAt = block.number;

    _revokeRole(FILLER, _msgSender());

    emit FillerDeregistered(_msgSender(), block.number);
}
```

Deregisters a filler by revoking the `FILLER` role from the caller.

1. The function sets the `deregisteredAt` timestamp to the current block number.
2. The function revokes the `FILLER` role from the caller.
3. The function emits a `FillerDeregistered` event with the address of the filler who deregistered and the current block number.

### refund

```solidity
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
```

- `filler_`: The address of the filler to refund the tokens to.

Refunds the staked tokens to a registered filler after the cooldown period has passed.

1. The function checks if the filler has deregistered.
2. The function checks if the cooldown period has passed.
3. The function transfers the `FILLER_STAKE` amount of tokens from the contract to the filler's address.
4. The function deletes the filler's registration information from the fillers mapping.
5. The function emits a `FillerRefunded` event with the address of the filler who was refunded.

### updateFee

```solidity
function updateFee(uint16 newFee) external onlyRole(FILLER) {
    require(newFee < MAX_Fee_IN_BIPS, "FillerManager: fee too high");

    fillers[_msgSender()].feeInBips = newFee;

    emit FillerFeeUpdated(_msgSender(), fillers[_msgSender()].feeInBips);
}
```

- `newFee`: The new fee in basis points (bips) to be set for the filler.

Updates the fee for a registered filler.

1. The function checks if the new fee is less than `MAX_Fee_IN_BIPS`.
2. The function sets the new fee for the caller.
3. The function emits a `FillerFeeUpdated` event with the address of the filler who updated their fee and the new fee in basis points (bips).
