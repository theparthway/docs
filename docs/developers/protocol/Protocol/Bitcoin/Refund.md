---
id: refund
title: Refund
sidebar_label: Refund
sidebar_position: 3
---

# Refund

The refund phase of an Atomic Swap allows the initiator to reclaim the locked funds if the redeemer fails to claim them within the specified time-frame. This process ensures that the initiator can recover their assets in case of a failed redemption.

## Process

1. **Check Expiry**: The initiator verifies that the redemption period has expired and the redeemer has not claimed the funds.
2. **Create Refund Script**: The initiator generates a refund script that includes the expiry time and initiator's public key.

```typescript
import @gardenfi/core

// ... other imports and statements

const tx = new bitcoin.Transaction();
tx.version = 2;
const utxo = await getUTXO("<script address>");
tx.AddInput(reverse(utxo.id), utxo.value, expiry);
tx.AddOutput(bitcoin.address.toOutputScript(initiatorAddress), utxo.value - 1000); // 1000 is the fee

const hashType = bitcoin.Transaction.SIGHASH_ALL;
const signatureHash = tx.hashForWitnessV0(0, htlcScript, utxo.value, hashType);
tx.setWitness(i, [
    bitcoin.script.signature.encode(sign(signatureHash), hashType),
    Buffer.from(initiatorPublicKey, "hex"),
    bitcoin.script.number.encode(0x00),
    htlcScript,
]);

const hash = await broadcast(tx.toHex());
```

:::warning
This code example is not directly usable and should be used as a reference only. Look into [Garden SDK](./../../developers/sdk/Sdk.md) for a complete implementation.
:::

3. **Refund Funds**: The initiator broadcasts the refund script to the Bitcoin network, reclaiming the funds locked in the contract.

Upon successful refund, the Atomic Swap is terminated, and the initiator receives the locked funds. This mechanism provides a safety net for the initiator, ensuring that their assets are protected in case of a failed redemption.

> These script addresses are reusable but it is recommended to use a new address for each transaction for privacy and security reasons.
