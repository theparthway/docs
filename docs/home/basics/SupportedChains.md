---
id: supported-chains
---

# Supported Chains

This section outlines the various blockchain networks where Bitcoin or its wrapped versions are enabled for swaps. You will find detailed information about each supported chain, ensuring you can seamlessly engage in BTC transactions across different blockchain environments.

<details>
<summary>Bitcoin</summary>

BTC on the Bitcoin chain to WBTC on the Ethereum/Arbitrum chain and vice versa.

Garden supports all Bitcoin address types. Here's the list:
- **Legacy (P2PKH):** The original Bitcoin address format that starts with '1', used for sending payments directly to a recipient's public key hash.
- **Nested SegWit (P2SH-P2WPKH):** Starts with '3', it wraps a SegWit address in a script hash to maintain compatibility with systems that only recognize the older P2SH format.
- **Native SegWit (P2WPKH):** Uses the Bech32 encoding format, starts with 'bc1', and directly supports SegWit, reducing transaction fees and increasing block efficiency.
- **Taproot (P2TR):** A type of Native SegWit address also starting with 'bc1', it leverages Schnorr signatures and MAST to offer more efficient use of block space and enhanced privacy features.

</details>

<details>
<summary>Ethereum</summary>

BTC on the Bitcoin chain to WBTC on the Ethereum chain and vice versa.

</details>

<details>
<summary>Arbitrum</summary>

BTC on the Bitcoin chain to WBTC on the Arbitrum chain and vice versa.

</details>

<details>
<summary>Polygon</summary>

WBTC on any chain to WBTC on Polygon.

</details>

<details>
<summary>Optimism</summary>

WBTC on any chain to WBTC on Optimism.

</details>

<details>
<summary>Avalanche</summary>

BTC.b on Avalanche to WBTC (any chain) / BTCB (BNB Smart Chain)

</details>

<details>
<summary>BNB Smart Chain</summary>

BTCB on BNB Smart Chain to WBTC (any chain) / BTC.b (Avalanche chain)

</details>
