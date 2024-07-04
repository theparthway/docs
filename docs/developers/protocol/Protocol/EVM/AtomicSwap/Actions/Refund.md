---
id: refund
title: Refund
sidebar_label: Refund
---

# Refund

The refund phase of an Atomic Swap involves calling the `refund` function on the HTLC smart contract to transfer the locked funds back to the initiator after the timelock has expired.

## Process

### Expire Refund

```javascript
// All required imports, providers, and contracts are assumed to be declared here

await htlc.connect(alice).refund(orderID);
```

1. Alice calls the `refund` function on the HTLC smart contract with the `orderID`.

:::info
The `orderID` is emitted in the `Initiated` event when the order is initiated.
:::

### Instant Refund

```javascript
// All required imports, providers, and contracts are assumed to be declared here

const REFUND_TYPE = {
  Refund: [{ name: 'orderID', type: 'bytes32' }],
};
const DOMAIN = {
  name: 'HTLC',
  version: '1',
  chainId: (await ethers.provider.getNetwork()).chainId,
  verifyingContract: await htlc.getAddress(),
};

const refund = {
  orderID: orderID,
};
const signature = await alice.signTypedData(DOMAIN, REFUND_TYPE, refund);

await htlc.connect(alice).instantRefund(orderID, signature);
```

1. Alice creates a `refund` object with the following properties:
   - `orderID`: The ID of the order to be refunded.
2. Alice signs the `refund` object using the `signTypedData` function.
3. Alice calls the `instantRefund` function on the HTLC smart contract with the `orderID` and the `signature`.

:::info
The `orderID` is emitted in the `Initiated` event when the order is initiated.
:::
