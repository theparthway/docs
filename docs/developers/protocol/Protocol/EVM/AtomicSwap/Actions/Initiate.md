---
id: initiate
title: Initiate
sidebar_label: Initiate
---

# Initiate

The initiation phase of an Atomic Swap involves creating a secret, generating a secret hash of the secret, and calling the `initiate` function to lock the funds in the HTLC smart contract.

## Process

### Direct Initiation

```javascript
// All required imports, providers, and contracts are assumed to be declared here

const secret = randomBytes(32);
const initiate = {
  redeemer: bob.address,
  timelock: 7200,
  amount: ethers.parseUnits('100', 18),
  secretHash: ethers.sha256(secret),
};

await htlc
  .connect(alice)
  .initiate(initiate.redeemer, initiate.timelock, initiate.amount, initiate.secretHash);
```

1. Alice generates a random secret.
2. Alice creates an `initiate` object with the following properties:
   - `redeemer`: Bob's address.
   - `timelock`: The number of blocks after which the order can be refunded.
   - `amount`: The amount of tokens to be transferred in the order.
   - `secretHash`: The hash of the secret.
3. Alice calls the `initiate` function on the HTLC smart contract with the `initiate` object.

### Signature Initiation

```javascript
// All required imports, providers, and contracts are assumed to be declared here

const INITIATE_TYPE = {
  Initiate: [
    { name: 'redeemer', type: 'address' },
    { name: 'timelock', type: 'uint256' },
    { name: 'amount', type: 'uint256' },
    { name: 'secretHash', type: 'bytes32' },
  ],
};
const DOMAIN = {
  name: 'HTLC',
  version: '1',
  chainId: (await ethers.provider.getNetwork()).chainId,
  verifyingContract: await htlc.getAddress(),
};

const secret = randomBytes(32);
const initiate = {
  redeemer: bob.address,
  timelock: 7200,
  amount: ethers.parseUnits('100', 18),
  secretHash: ethers.sha256(secret),
};
const signature = await alice.signTypedData(DOMAIN, INITIATE_TYPE, initiate);

await htlc
  .connect(alice)
  .initiateWithSignature(
    bob.address,
    7200,
    ethers.parseUnits('100', 18),
    ethers.sha256(secret),
    signature
  );
```

1. Alice generates a random secret.
2. Alice creates an `initiate` object with the following properties:
   - `redeemer`: Bob's address.
   - `timelock`: The number of blocks after which the order can be refunded.
   - `amount`: The amount of tokens to be transferred in the order.
   - `secretHash`: The hash of the secret.
3. Alice signs the `initiate` object using the `signTypedData` function.
4. Alice calls the `initiateWithSignature` function on the HTLC smart contract with the `initiate` object and the signature.
