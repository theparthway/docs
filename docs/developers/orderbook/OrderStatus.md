---
id: order-status
---

# Order Status

In our orderbook, each order is assigned a numerical identifier to track its status, ensuring efficient management and execution of atomic swaps between users and counterparties.These statuses help users and counterparties understand the current state of the order and what actions need to be taken next.

## Order status

The order status serves as a indicator of where each transaction stands in its lifecycle within the orderbook system. It reflects the real-time progress and outcome of a order, from its creation through to its final resolution.

| Status | Description      |
| :----- | :--------------- |
| 0      | Idle             |
| 1      | Order Created    |
| 2      | Order Matched    |
| 3      | Order Success    |
| 4      | Order SoftFailed |
| 5      | Order HardFailed |
| 6      | Order Cancelled  |

## Atomic Swap status

The atomic swap status shows the progress of an HTLC (Hash Time-Locked Contract) on the blockchain. Each order involves two atomic swaps (initiator and follower).The user is the initiator and the counterparty is the follower.

| Status | Description         |
| :----- | :------------------ |
| 0      | Not Started         |
| 1      | Initiation detected |
| 2      | Initiated           |
| 3      | Expired             |
| 4      | Redeem detected     |
| 5      | Refund detected     |
| 6      | Redeem confirmed    |
| 7      | Refund confirmed    |

## Example of a Happy flow order

In our system, the status of an order is represented by a three-digit notation, where each digit indicates a different aspect of the order's progress:

- First Digit: Order status
- Second Digit: Initiator (user) status
- Third Digit: Follower (counterparty) status

Let's walk through an example of a successful atomic swap, demonstrating the status changes at each step:

1. **000 - Idle** The order is Idle and has not yet been created.
2. **100 - Order created** Alice creates an order.
3. **200 - Order Matched** Bob accepts Alice's order, and they are matched.
4. **210 - Initiate Detected** Alice deposited her funds into the HTLC.
5. **220 - Initiate Successful** The alice initiate transaction is confirmed on blockchain.
6. **221 - Counterparty Initiate detected** Bob deposited his funds into the HTLC.
7. **222 - Counterparty Initiate Successful** Bob's initiate transaction is confirmed on blockchain.
8. **242 - Redeem Detected** Alice redeem transaction from the HTLC is detected.
9. **244 - Counterparty Redeem Detected** Bob redeem transaction from the HTLC is detected.
10. **366 - Order Success** Both Alice and Bob's redeem transactions are successful, completing the swap.
