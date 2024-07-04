---
id: redeem
title: Redeem
sidebar_label: Redeem
sidebar_position: 2
---

# Redeem

The redemption phase of an Atomic Swap involves the claim of funds by the redeemer. This process requires the redeemer to reveal the secret and provide their Bitcoin address, unlocking the funds locked in the contract.

## Process

1. **Reveal Secret**: The redeemer will collect the secret from the initiator's redemption on the EVM chain and reveal it to the Bitcoin chain. This secret is used to unlock the funds in the script.
2. **Create Redeem Script**: The redeemer creates a redeem script that includes the secret, redeemer's public key and redeemer's signature.

```typescript
import @gardenfi/core

// ... other imports and statements

const tx = new bitcoin.Transaction();
tx.version = 2;
const utxo = await getUTXO("<script address>");
tx.AddInput(reverse(utxo.id), utxo.value);
tx.AddOutput(bitcoin.address.toOutputScript(redeemerAddress), utxo.value - 1000); // 1000 is the fee

const hashType = bitcoin.Transaction.SIGHASH_ALL;
const signatureHash = tx.hashForWitnessV0(0, htlcScript, utxo.value, hashType);
tx.setWitness(i, [
    bitcoin.script.signature.encode(sign(signatureHash), hashType),
    Buffer.from(redeemerPublicKey, "hex"),
    Buffer.from(secret, "hex"),
    bitcoin.script.number.encode(0x01),
    htlcScript,
]);

const hash = await broadcast(tx.toHex());
```

:::warning
This code example is not directly usable and should be used as a reference only. Look into [Garden SDK](./../../developers/sdk/Sdk.md) for a complete implementation.
:::

3. **Redeem Funds**: The redeemer broadcasts the redeem script to the Bitcoin network, claiming the funds locked in the contract.

Upon successful redemption, the Atomic Swap is completed, and the redeemer receives the funds locked in the contract. If the redemption is not completed within the specified time-frame, the initiator can refund the funds using the refund script. This ensures that the funds are not lost in case of a failed redemption.
