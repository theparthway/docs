---
id: initiate
title: Initiate
sidebar_label: Initiate
sidebar_position: 1
---

# Initiate

The initiation phase of an Atomic Swap involves the creation of a script and funding the script address by the initiator. This script includes the secret hash and the redeemer's address, ensuring that the funds are locked until the redeemer claims them.

## Process

1. **Create Secret**: The initiator generates a secret and calculates its hash. This secret will be used to lock the funds in the contract.
2. **Create Script**: The initiator creates a contract script that includes the secret hash, the redeemer's address, initiator's address and the expiry time.

:::info
In a typical cross-chain swap scenario where Alice wants to exchange BTC for WBTC on EVM chain with Bob, the initiation phase use 48 hours as the expiry time. On the other hand Bob wants to exchange WBTC for BTC on Bitcoin chain with Alice, the initiation phase use 24 hours as the expiry time.
:::

3. **Fund Script Address**: The initiator sends the funds to the script address, locking them until the redeemer claims them.

Now that the contract has been created and funded, the Atomic Swap is ready to proceed to the redemption phase. This phase involves the redeemer claiming the funds by revealing the secret and providing their address.
