---
id: fee-account
title: Fee Account
sidebar_label: Fee Account
---


# Fee Account Documentation

## Overview
The `FeeAccount` contract is designed to manage funds within a channel between a funder and a recipient. It allows for the closing of the channel, claiming of funds based on hashed time-locked contracts (HTLCs), and settling the channel. Find the source code for the `FeeAccount` contract in the [Garden Sol repository]()

## Imports
- **`ECDSAUpgradeable`**: Utility library for Elliptic Curve Digital Signature Algorithm (ECDSA) operations.
- **`SafeERC20Upgradeable`**: Library for safely interacting with ERC-20 tokens.
- **`EIP712Upgradeable`**: Library for EIP-712 typed structured data hashing and signing.

## State Variables
- **`token`** (`IERC20Upgradeable`): The ERC-20 token used for payments within the channel.
- **`funder`** (`address`): Address of the funder aka underwriter.
- **`recipient`** (`address`): Address of the recipient aka user.
- **`factory`** (`IFeeAccountFactory`): Address of the factory contract that deployed this contract.
- **`amount`** (`uint256`): The amount of tokens claimed in the current claim.
- **`nonce`** (`uint256`): The nonce of the current claim.
- **`expiration`** (`uint256`): The expiration block number for the current claim.
- **`secretsClaimed`** (`mapping(bytes => uint256)`): Mapping to track claimed secrets.
- **`secrets`** (`mapping(bytes32 => bytes)`): Mapping to store secrets corresponding to HTLCs.

## Constants
- **`CLOSE_TYPEHASH`**: Typehash for the `close` function.
- **`CLAIM_HTLC_TYPEHASH`**: Typehash for the `claim` function.
- **`HTLC_TYPEHASH`**: Typehash for the HTLC struct.
- **`TWO_DAYS`**: Constant for two days in block numbers (2 * 7200).

## Structs
- **`HTLC`**
  - **`secretHash`** (`bytes32`): Hash of the secret.
  - **`expiry`** (`uint256`): Expiry block number.
  - **`sendAmount`** (`uint256`): Amount to be sent.
  - **`receiveAmount`** (`uint256`): Amount to be received.

## Constructor
- **`constructor()`**: Disables initializers to prevent the template contract from being initialized.

## Initializers
- **`__FeeAccount_init`**
  - **Parameters**: `IERC20Upgradeable token_`, `address funder_`, `address recipient_`, `string memory feeAccountName`, `string memory feeAccountVersion`
  - Initializes the `FeeAccount` contract.
- **`__FeeAccount_init_unchained`**
  - **Parameters**: `IERC20Upgradeable token_`, `address funder_`, `address recipient_`
  - Internal initialization function.

## Functions
- **`close`**
  - **Parameters**: `uint256 amount_`, `bytes memory funderSig`, `bytes memory recipientSig`
  - Closes the channel and transfers the specified amount to the recipient and the remaining amount to the funder.
- **`claim`**
  - **Parameters**: `uint256 amount_`, `uint256 nonce_`, `HTLC[] memory htlcs`, `bytes[] memory secrets_`, `bytes memory funderSig`, `bytes memory recipientSig`
  - Claims funds based on the provided HTLCs and updates the claim state.
- **`settle`**
  - Settles the channel by transferring the claimed amount to the recipient and the remaining amount to the funder.
- **`totalAmount`**
  - **Returns**: `uint256` - The total amount of tokens held by the `FeeAccount`.
- **`claimHash`**
  - **Parameters**: `uint256 amount_`, `uint256 nonce_`, `HTLC[] memory htlcs`
  - **Returns**: `bytes32` - The hash to be signed for a claim message.
- **`closeChannel`**
  - **Parameters**: `uint256 amount_`
  - Closes the channel and transfers the specified amount to the recipient and the remaining amount to the funder.
