---
id: payment-channel
title: Payment Channel
sidebar_label: Payment Channel
---
# Payment Channels

## Abstract
Payment Channels enable transactions to be processed entirely through a non-custodial, bidirectional, off-chain transaction system. Akin to the Lightning Network for Bitcoin or Raiden for Ethereum, they operate without relying on any centralized third party holding funds. By leveraging payment channels, value transfer occurs off-chain, ensuring instant and fee-less transactions. In case of uncooperative or hostile behavior, transactions can be settled on-chain through timelocks, preserving the integrity and reliability of the system. ZapPay is our service that utilizes Payment Channels to provide instant, secure, and low-cost transactions for users and is currently empowering pay with $SEED in swaps and payments in reward system for [Garden Finance](https://garden.finance/).

### Features
1. **Instant Transactions**: Immediate balance updates for users.
2. **Bidirectional Payments**: Allows users to both make payments and receive payments.
3. **Atomic Conditional Payments**: Secure conditional payments using HTLC.
4. **Low Fees**: Reduced transaction costs by minimizing on-chain operations.
5. **High Throughput**: Ability to handle a large volume of transactions.
6. **Flexible Channel Capacity**: Channel capacity can be increased without creating a new channel.
7. **Partial Withdrawals**: Users can withdraw partial funds without closing channels through submarine swaps.

## Roles
All payment channels have a user and an underwriter. All payment channels have a common underwriter.
### User
- User can request to create a channel, make payments, deposit funds, withdraw funds and close the channel.
### Underwriter
- Underwriter is the funder in channel factory and has the same privileges as the user in payment channels.
- Manages the payment channels and processes transactions on behalf of the users and is the core responsibility of Payment Channels.
- Apart from that underwriter can fund the channel to increase their balance by externally funding the channel without the user's consent.
- Underwriter is responsible for dispute resolution in case of uncooperative behavior from the user and all on chain transaction for resolving disputes are initiated by the underwriter by default.


