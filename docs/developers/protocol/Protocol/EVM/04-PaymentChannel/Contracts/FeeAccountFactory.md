---
id: fee-account-factory
title: Fee Account Factory
sidebar_label: Fee Account Factory
---

# Fee Account Factory Contract Documentation

## Overview
The `FeeAccountFactory` contract is used to deploy and manage `FeeAccount` contracts. It allows for the creation, closing, and claiming of fee channels between a funder and a recipient. Find the source code for the `FeeAccountFactory` contract in the [Garden Sol repository](https://github.com/gardenfi/garden-sol)

## Imports
- **`ClonesUpgradeable`**: Library for deploying minimal proxy contracts (clones).
- **`FeeAccount`**: The `FeeAccount` contract.

## State Variables
- **`token`** (`IERC20Upgradeable`): The ERC-20 token used in the fee channels.
- **`feeManager`** (`address`): Address responsible for managing fee channels.
- **`template`** (`address`): Address of the template `FeeAccount` contract.
- **`feeAccountName`** (`string`): Name for initializing `FeeAccount` contracts.
- **`feeAccountVersion`** (`string`): Version for initializing `FeeAccount` contracts.
- **`nonces`** (`mapping(address => uint256)`): Nonces for each recipient.
- **`channels`** (`mapping(address => FeeAccount)`): Maps recipient addresses to their respective `FeeAccount` contracts.

## Events
- **`Claimed`**: Emitted when funds are claimed from a fee channel marking the initiation of dispute resolution.
- **`Created`**: Emitted when a new fee channel is created.
- **`Closed`**: Emitted when a fee channel is closed marking the end of dispute resolution.

## Constructor
- **Parameters**: `IERC20Upgradeable token_`, `address feeManager_`, `string memory feeAccountName_`, `string memory feeAccountVersion_`
- Initializes the factory with the provided parameters and deploys a template `FeeAccount` contract.

## Functions
- **`createAndClose`**
  - **Parameters**: `uint256 amount`, `bytes memory funderSig`, `bytes memory recipientSig`
  - Creates a fee channel and immediately closes it.
- **`createAndClaim`**
  - **Parameters**: `uint256 amount`, `uint256 nonce`, `FeeAccount.HTLC[] memory htlcs`, `bytes[] memory secrets`, `bytes memory funderSig`, `bytes memory recipientSig`
  - Creates a fee channel and immediately claims funds from it.
- **`settle`**
  - **Parameters**: `address recipient`
  - Settles the fee channel for the specified recipient. Settling a channel transfers the claimed amount to the recipient and the remaining amount to the funder. The channel is then closed.
- **`claimed`**
  - **Parameters**: `address recipient`, `uint256 amount`, `uint256 nonce`, `uint256 expiration`
  - Called by `FeeAccount` contracts when funds are claimed.
- **`closed`**
  - **Parameters**: `address recipient`
  - Called by `FeeAccount` contracts when a channel is closed.
- **`feeManagerCreate`**
  - **Parameters**: `address recipient`
  - Creates a fee channel, callable only by the fee manager.
- **`create`**
  - Creates a fee channel, callable by any recipient.
- **`_create`**
  - **Parameters**: `address funder`, `address recipient`
  - Internal function to create a fee channel.
