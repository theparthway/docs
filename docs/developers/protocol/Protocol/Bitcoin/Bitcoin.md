---
id: bitcoin
title: Bitcoin
sidebar_label: Bitcoin
---

Garden Finance uses given Bitcoin script for Atomic Swap, it is a Hash Time-Locked Contract (HTLC), a type of smart contract that allows for conditional execution of a Bitcoin transaction. This script is designed for atomic swaps, cross-chain exchanges, or any scenario where funds should be released only if specific conditions are met within a certain time-frame.

## Atomic Swap Script

```typescript
OP_IF
    OP_SHA256
    ${secretHash}
    OP_EQUALVERIFY
    OP_DUP
    OP_HASH160
    ${fromBase58Check(redeemerAddress).hash.toString("hex")}
OP_ELSE
    ${bitcoin.script.number.encode(expiry).toString("hex")}
    OP_CHECKSEQUENCEVERIFY
    OP_DROP
    OP_DUP
    OP_HASH160
    ${fromBase58Check(initiatorAddress).hash.toString("hex")}
OP_ENDIF
OP_EQUALVERIFY
OP_CHECKSIG
```

### Components

- **`OP_IF`**: Begins the conditional execution block.
- **`OP_SHA256`**: Performs a SHA-256 hash operation.
- **`${secretHash}`**: The hash of the secret used to lock the funds.
- **`OP_EQUALVERIFY`**: Compares the top two stack items and verifies their equality.
- **`OP_DUP`**: Duplicates the top stack item.
- **`OP_HASH160`**: Performs a RIPEMD-160 hash operation.
- **`${fromBase58Check(redeemerAddress).hash.toString("hex")}`**: The hash of the redeemer's Bitcoin address.
- **`OP_ELSE`**: Begins the alternative execution block.
- **`${bitcoin.script.number.encode(expiry).toString("hex")}`**: The expiry time for the contract.
- **`OP_CHECKSEQUENCEVERIFY`**: Verifies the relative lock-time of the transaction.
- **`OP_DROP`**: Removes the top stack item.
- **`${fromBase58Check(initiatorAddress).hash.toString("hex")}`**: The hash of the initiator's Bitcoin address.
- **`OP_ENDIF`**: Ends the conditional execution block.
- **`OP_EQUALVERIFY`**: Compares the top two stack items and verifies their equality.
- **`OP_CHECKSIG`**: Verifies the signature of the transaction.

## Actions

The Atomic Swap script is used in the following actions:

1. **Initiate**: The initiator creates a contract with the secret hash and redeemer's address.
2. **Redeem**: The redeemer claims the funds by revealing the secret and providing their Bitcoin address.
3. **Refund**: If the redeemer fails to claim the funds within the specified time-frame, the initiator can refund the locked funds.

Let's explore each of these workflows in detail.
