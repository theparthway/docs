---
id: redeem
title: Redeem
sidebar_label: Redeem
---

# Redeem

The redemption phase of an Atomic Swap involves revealing the secret to the HTLC smart contract and calling the `redeem` function to transfer the locked funds to the redeemer.

## Process

```javascript
// All required imports, providers, and contracts are assumed to be declared here

await htlc.connect(bob).redeem(orderID, secret);
```

1. Bob calls the `redeem` function on the HTLC smart contract with the `orderID` and the `secret`.
:::info
The `orderID` is emitted in the `Initiated` event when the order is initiated.
:::
