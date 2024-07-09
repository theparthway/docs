---
id: payment-channel-specs
title: Specifications
sidebar_label: Specifications
---

# Payment Channel Specifications
This document outlines the requirements and specifications for a payment channel system, focusing on channel management, transaction handling, and security. The system should ensure data consistency, failure recovery, and protection against unauthorized access and DoS attacks. Channels have various states (Open, Closed, DisputeInitiated, DisputeResolved, Settled) and lifecycle stages (creation, transaction processing, settlement). State and HTLC specifications define the balance and conditional payments, while transaction specifications cover instant and conditional transactions, resolution, withdrawal, and deposit. **These guidelines ensure the system's reliability and security, having been tested and audited.**

## Functional Requirements
1. **Channel Management**:
   - Open and close channels.
   - Increase channel capacity.
   - Monitor on-chain channel updates.
2. **Transaction Handling**:
   - Process transactions and update channel balances.
   - Swap in-channel funds to on-chain funds.
   - Resolve conditional payments.
3. **Security**:
   - Ensure authenticity and integrity of transactions.
   - Prevent double-spending and replay attacks.
   - Ensure on-chain channel disputes are handled in a timely fashion.
   - Ensure conditional payments are resolved in a timely fashion.

## Non-functional Requirements
1. **Reliability**
   1. Ensure data consistency across transactions.
   2. Ability to recover from failures and automatic retries.
2. **Security**:
   1. Protect against unauthorized access.
   2. Protect against DOS attacks by disallowing 0 cost resource creation.
   3. Protect against DOS attacks preventing timely dispute resolution.

## Channel Specification
---
| Field                  | Type            | Description                                                                 |
|------------------------|-----------------|-----------------------------------------------------------------------------|
| `channelAddress`       | `common.Address`| Address of the channel on chain that can be use for settlement              |
| `userAddress`          | `common.Address`| Address of the user owning the channel                                      |
| `funderAddress`        | `common.Address`| Address of the underwriter                                              |
| `tokenAddress`         | `common.Address`| Address of the erc20 token native to the channel                            |
| `balance`              | `BigInt`        | Current balance in the channel                                              |
| `status`               | `ChannelStatus` | Status of the channel                                                       |
| `latestState`          | `State`         | Latest state of the channel                                                 |
| `resolvableState`      | `State`         | Latest state of the channel that can be resolved when dispute is raised     |
### <u>Channel Status</u>
1. `Open`:
   - The channel is active and can process transactions.
2. `Closed`: 
   - Both parties agree on the final balance and closed the channel on-chain.
   - It is terminal state when the channel is closed on-chain via mutual agreement.
3. `DisputeInitiated`: 
   - Intermediate state where the channel is in dispute and waiting for the dispute resolution.
4. `DisputeResolved`:
   - The dispute is resolved when the latest state is submitted on chain.
   - The channel will now wait for the timeout to expire before closing.
5. `Settled`:
   - The channel is settled on-chain and the funds are withdrawn by the users.
   - It is terminal state when the channel is settled on-chain via dispute resolution.

### <u>Payment Channel Lifecycle</u>
1. **Channel Creation**:
   - A user opens a payment channel with the underwriter.
   - Underwriter can create a channel on user's behalf with zero balance.
   - The channel becomes `open` after the balance in initial agreed state is found deposited on chain. And is opened on creation if the balance is zero.
2. **Transaction Processing**:
   - Transactions are processed off-chain and updated in the channel state. All transactions are described in the following [sections](#Transaction-Specifications).
3. **Channel Settlement**:    
   Users can close the channel at any time via any of the following methods:
   1. **Close**(Mutual agreement)
      - Users can close the channel at any time by submitting a close request to the underwriter and agreeing on the final balance.
      - The final balance is settled on-chain using the signatures of both parties and is submitted by the underwriter.
      - Either party can close the channel by requesting a signature from the other party to close the channel by choosing to resolve the conditional payments from the their side to avoid waiting for the timeout. Resolving can be done by finalizing all the pending conditional payments.
      - The channel status is updated to `Closed` on successful closure.
   2. **Claim**(Dispute resolution)
      - If a user is unresponsive or malicious, the other party can close the channel unilaterally after a timeout period.
      - The final balance is settled on-chain using the latest state signed by the both parties.
      - Underwriter checks if the submitted state is valid and the nonce is equal to the nonce of current state.
      - If the state is valid, the channel status is updated to `DisputeResolved`.
      - If the state is invalid, underwriter initiates a dispute resolution process by submitting the latest resolvable state on-chain.
      - The channel status is updated to `DisputeResolved` on successful resolution.
      - The channel status is updated to `Closed` on successful settlement of the claim.

## State Specification for Channels
---
- State of the channels reflects current balance and active conditional payments in the channel. It is designed according to the smart contract requirements.
- State is expected to be signed by the user and underwriter to be called a resolvable state.
- State generated after a payment from the user to the underwriter is always resolvable.
- It is suggested for the clients to maintain track of latest state in their payment channel and verify the state signed by the underwriter after every transaction.

| Field                  | Type           | Description                                                                 |
|------------------------|----------------|-----------------------------------------------------------------------------|
| `nonce`                | `uint`         | Latest processed transaction nonce                                          |
| `balance`              | `BigInt`       | Current balance in the channel                                              |
| `htlcs`          | `[]HTLC`       | Htlcs active within this state                   |

## HTLC Specification
---
Hashed Time Locked Contracts are used to create conditional payments in the channel.
| Field                  | Type           | Description                                                                 |
|------------------------|----------------|-----------------------------------------------------------------------------|
| `secretHash`           | `common.Hash`       | Hash of the secret used to lock the payment                                 |
| `sendAmount`               | `BigInt`       | It is non-zero if the conditional payment is from underwriter to channel                                            |
| `receiveAmount`               | `BigInt`       | It is non-zero if the conditional payment is from channel to underwriter                                            |
| `expiry`               | `uint`         | Duration after which the payment is invalid                                     |
| `secret`               | `[]byte`       | Secret used to unlock the payment                                           |

## Transaction Specifications
## Instant transactions specification 
---
- Instant transactions are processed instantly and will update the state balance.

| Field                  | Type            | Description                                                                 |
|------------------------|-----------------|-----------------------------------------------------------------------------|
| `txHash`            | `common.Hash`          | Unique identifier for a transaction generated deterministically|
| `nonce`                | `uint`          | Transaction order within the channel                                        |
| `amount`               | `BigInt`        | Amount paid in the transaction                                              |
| `from`                 | `common.Address`| Address of the transaction initiator                                       |
| `to`                   | `common.Address`| Address of the transaction recipient                                       |
| `channelAddress`       | `common.Address`| Address of the channel on whose state the transaction should be processed           |
| `signature`        | `string`        | Signature of the user for the new state this tx generates                                     |
### <u>State Change Specification</u> 
   1. Update the nonce by 1
   2. Update the balance 
      1. By adding the amount of the transaction if the recipient is the user address 
      2. By subtracting the amount if the sender is the channel address.
   3. Verify the signature against this newly generated state
   4. Sign the new state 
                             
## Conditional Tx Specification
---
- Conditional transaction are used to make payments with a htlc.
- These transactions when processed doesn't update the state balance immediately but requires an instant payment to be made by the sender of that conditional payment to the recipient with the same amount.

| Field                  | Type           | Description                                                                 |
|------------------------|----------------|-----------------------------------------------------------------------------|
| `txHash`                 | `common.Hash`         | Unique identifier for a transaction generated deterministically  |
| `amount`               | `BigInt`        | Amount paid in the transaction                                              |
| `from`                 | `common.Address`| Address of the transaction initiator                                       |
| `to`                   | `common.Address`| Address of the transaction recipient                                       |
| `channelAddress`       | `common.Address`| Address of the channel on whose state the transaction should be processed           |
| `secretHash`           | `common.Hash`       | Hash of the secret used to lock the payment                                 |
| `expiry`               | `uint`         | Time after which the payment is invalid                                     |
| `signature`        | `string`        | Signature of the user for the new state this tx generates  |
### <u>State Change Specification</u> 
   1. Construct and append HTLC to the list.
   2. Update the nonce by 1
   3. Verify the signature against this newly generated state
   4. Sign the new state 

### <u>Further Processing rules</u>
   1. If the secret is not submitted within the expiry, the channel is closed and the funds are settled on-chain.
   2. If the secret is submitted within the expiry with an instant payment for the same amount, the channel balance is updated and the HTLC is removed from the list.

## Resolve Conditional Tx Specification
---
- HTLC's generated by conditional payments are resolved when the user signs a state removing the pending HTLC in the state and updating the balance accordingly.
- Balance should be deducted if the recipient in the HTLC under consideration is the channel address.
- Balance should be added if the recipient in the HTLC under consideration is the user address.
- Participants should only be able to resolve the conditional payment where they are the sender.

| Field                  | Type            | Description                                                                 |
|------------------------|-----------------|-----------------------------------------------------------------------------|
| `txHash`               | `common.Hash`   | Unique identifier for a transaction generated deterministically             |
| `nonce`                | `uint`          | Transaction order within the channel                                        |
| `from`                 | `common.Address`| Address of the transaction initiator                                        |
| `to`                   | `common.Address`| Address of the transaction recipient                                        |
| `channelAddress`       | `common.Address`| Address of the channel on whose state the transaction should be processed           |
| `secretHash`               | `[]common.Hash`      | Secret used to unlock the payment                                           |
| `signature`            | `string`        | Signature of the user for the new state this tx generates                   |
### <u>State Change Specification</u> 
   1. Remove the htlc's with the secret hash corresponding to the secret.
   2. Update the nonce by 1
   3. Update the balance 
      1. By adding the amount of the transaction if the recipient is the user address 
      2. By subtracting the amount if the sender is the user address.
   4. Verify the signature against this newly generated state.
   5. Sign the new state.
## Remove Conditional Tx Specification
---
- HTLC's generated by conditional payments are removed using the secret hash.
- Participants should only be able to remove the conditional payment where they are the sender but should be accepted by the receiver.

| Field                  | Type           | Description                                                                 |
|------------------------|----------------|-----------------------------------------------------------------------------|
| `txHash`               | `common.Hash`         | Unique identifier for a transaction generated deterministically                                                     |
| `nonce`                | `uint`          | Transaction order within the channel                                       |
| `from`                 | `common.Address`| Address of the transaction initiator                                       |
| `to`                   | `common.Address`| Address of the transaction recipient                                       |
| `channelAddress`       | `common.Address`| Address of the channel on whose state the transaction should be processed           |
| `secretHash`           | `[]common.Hash`       | Hash of the secret used to lock the payment                                 |
| `signature`        | `string`        | Signature of the user for the new state this tx generates (required only if `from` is user address)|
### <u>Pre-requisites</u> 
   1. Auth of the receiver  must be verified before removing the conditional payment.
### <u>State Change Specification</u> 
   1. Use all the un-resolved conditional payments and remove the conditional payment with required secret hash from the list.
   2. Update the nonce by 1
   3. Verify the signature against this newly generated state
   4. Sign the new state 

## Withdrawal Specification
---
| Field                  | Type           | Description                                                                 |
|------------------------|----------------|-----------------------------------------------------------------------------|
| `txHash`                 | `common.Hash`         | Unique identifier for a transaction generated deterministically  |
| `amount`               | `BigInt`        | Amount paid in the transaction                                             |
| `from`                 | `common.Address`| Address of the transaction initiator                                       |
| `channelAddress`       | `common.Address`| Address of the channel on whose state the transaction should be processed           |
| `secretHash`           | `common.Hash`   | Hash of the secret used to lock the payment                                |
| `expiry`               | `uint`          | Time after which the payment is invalid                                    |
| `signature`            | `string`        | Signature of the user for the new state this tx generates                  |
### <u>Assumptions</u>
   1. t should be optimally set. t is 24 hours in the current implementation.
### <u>State Change Specification</u> 
   1. Verify if expiry is at-least 2*t duration from the current time.
   2. Append the new HTLC to the list.
   3. Update the nonce by 1
   4. Verify the signature against this newly generated state
   5. Sign the new state 
   
### <u>Sub-marine swap steps</u>
   1. Initiate an on-chain HTLC to lock the funds in the channel using the same secret hash, initiator as underwriter, recipient as the owner address of the channel and with an expiry of t duration.
   2. Resolve the conditional payment off-chain via resolution specified in the `Resolve Conditional Tx Specification`.
   3. Failing to resolve the conditional payment within the expiry should result in:
      1. Refund of the initial HTLC on-chain.
      2. Start channel dispute resolution process on-chain.

## Deposit Specification
---
| Field                  | Type           | Description                                                                 |
|------------------------|----------------|-----------------------------------------------------------------------------|
| `txHash`               | `common.Hash`  | Unique identifier for a transaction generated deterministically             |
| `channelAddress`       | `common.Address`| Address of the channel on whose state the transaction should be processed           |
| `amount`               | `BigInt`       | Amount paid in the transaction                                              |
### <u>Assumptions</u>
   1. t should be optimally set. t is 24 hours in the current implementation.

### <u>State Change Specification</u> 
   1. Append the new HTLC to the list with t duration expiry and newly generated secret hash.
   2. Update the nonce by 1
   3. Verify the signature against this newly generated state
   4. Sign the new state 

###  <u>Sub-marine swap steps</u>
   1. User initiates an on-chain transaction to lock the funds in the channel using the same secret hash, initiator as user address, recipient as the channel address and with an expiry of 2*t duration.
   2. When a initiate event is detected on-chain, the secret is submitted on-chain.
   3. The conditional payment is resolved off-chain via resolution specified in the `Resolve Conditional Tx Specification`.

Receive Amount