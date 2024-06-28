---
id: orderbook
---

# Orderbook

Orderbook is a order matching engine for [garden.finance](https://garden.finance). Garden Finance is a decentralized exchange which supports atomic swaps, enabling seamless cross-chain bridging. Through this Orderbook API, users can create orders, track the progress of orders, and complete swaps, while market makers/counterparties can accept orders and complete the trades.

Orderbook serves as the intermediary between users and counterparties during swaps. It facilitates transactions by supporting different order types: market orders for immediate execution, limit orders for specific prices(wip), and Dutch auction orders for dynamic price discovery(wip).

# AtomicSwap

Atomic swaps are a method to exchange cryptocurrencies between different block chains without a need for a trusted entity or a centralized exchange.This technology allows users to trade directly from their wallets, enhancing security and reduce reliability on centralized exchanges.

## How does AtomicSwaps work?

Atomic swaps rely on something called as HTLC's (Hash Time-Locked Contracts) to ensure both parties fulfil the terms of the trade.An HTLC (Hash Time-Locked Contract) is a contract or script that holds funds and requires the recipient to provide a cryptographic proof of receipt before a specified deadline to claim the funds. If the proof is not provided within the time limit, the funds are returned to the sender.

#### Process of Atomic Swap

- **Initiation:** Alice and Bob agree on the amount and cryptocurrencies to exchange, like BTC and WBTC in ethereum. Alice creates a random secret and its hash
- **Contract Interaction:** Alice creates an HTLC on the BTC blockchain and deposits BTC into it, including the secret hash and a block-based time limit.
- **Counterparty action:** Bob creates a corresponding HTLC on the ethereum blockchain, depositing WBTC with the same secret hash and a shorter time limit than Alice's BTC script.
- **Secret Reveal:** Alice reveals the secret on the ethereum blockchain to claim WBTC from the HTLC, which also discloses the secret to Bob.
- **Claim:** Bob uses the revealed secret to claim BTC from Alice's HTLC on the BTC blockchain.
- **Completion:** The atomic swap concludes securely and directly between Alice and Bob, without the need for a trusted intermediary.

## Implementing Atomic swaps in Garden

At garden, we leverage atomic swaps to enable seamless and secure exchanges between BTC and WBTC across different chains. Our order matching engine(orderbook) integrates atomic swap functionality to ensure that trades are executed in a decentralized and trustless manner.

1. **Order Creation:** Users create orders specifying the amount of BTC they wish to exchange for WBTC, or vice versa.
2. **Order Matching:** Orderbook matches orders based on price and quantity, ensuring optimal trades.
3. **Swap Execution:** Once matched, the garden frontend prompts the user to deposit funds into an HTLC.
4. **Settlement:** Once the counterparty completes their part, the user can claim funds on their respective chain.
