---
id: atomic-swap
title: Atomic Swap
sidebar_label: Atomic Swap
---

# Atomic Swap

Hashed Time-Locked Contracts (HTLCs) are smart contracts that facilitate secure asset transfers between parties on different blockchains. They work by creating time-bound conditions for both parties to fulfill before the transaction is completed.

In a typical scenario, the sender deposits their asset into a secure vault on their blockchain. The receiver, upon verifying the deposit, does the same on their blockchain. Once both deposits are confirmed, the sender unlocks the receiver's vault, and the receiver can then access their asset.

To prevent issues like incorrect deposits or one party backing out, HTLCs incorporate time-locks. The receiver has a limited time to claim their asset, while the sender can reclaim theirs if the receiver fails to act within the specified time frame. This ensures a fair and secure exchange, even without direct trust between the parties involved.

## Smart Contract

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract HTLC is EIP712 {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    struct Order {
        bool isFulfilled;
        address initiator;
        address redeemer;
        uint256 initiatedAt;
        uint256 timelock;
        uint256 amount;
    }

    IERC20 public immutable token;

    mapping(bytes32 => Order) public orders;

    bytes32 private constant _INITIATE_TYPEHASH = keccak256("Initiate(address redeemer,uint256 timelock,uint256 amount,bytes32 secretHash)");

    bytes32 private constant _REFUND_TYPEHASH = keccak256("Refund(bytes32 orderId)");

    event Initiated(bytes32 indexed orderID, bytes32 indexed secretHash, uint256 amount);
    event Redeemed(bytes32 indexed orderID, bytes32 indexed secretHash, bytes secret);
    event Refunded(bytes32 indexed orderID);

    modifier safeParams(
        address redeemer,
        uint256 timelock,
        uint256 amount
    ) {
        require(redeemer != address(0), "HTLC: zero address redeemer");
        require(timelock > 0, "HTLC: zero timelock");
        require(amount > 0, "HTLC: zero amount");
        _;
    }

    constructor(address token_, string memory name, string memory version) EIP712(name, version) {
        token = IERC20(token_);
    }

    function initiate(
        address redeemer,
        uint256 timelock,
        uint256 amount,
        bytes32 secretHash
    ) external safeParams(redeemer, timelock, amount) {
        _initiate(msg.sender, redeemer, timelock, amount, secretHash);
    }

    function initiateWithSignature(
        address redeemer,
        uint256 timelock,
        uint256 amount,
        bytes32 secretHash,
        bytes calldata signature
    ) external safeParams(redeemer, timelock, amount) {
        address initiator = _hashTypedDataV4(
            keccak256(abi.encode(_INITIATE_TYPEHASH, redeemer, timelock, amount, secretHash))
        ).recover(signature);

        _initiate(initiator, redeemer, timelock, amount, secretHash);
    }

    function redeem(bytes32 orderID, bytes calldata secret) external {
        Order storage order = orders[orderID];

        require(order.redeemer != address(0x0), "HTLC: order not initiated");
        require(!order.isFulfilled, "HTLC: order fulfilled");

        bytes32 secretHash = sha256(secret);

        require(sha256(abi.encode(secretHash, order.initiator)) == orderID, "HTLC: incorrect secret");

        order.isFulfilled = true;

        emit Redeemed(orderID, secretHash, secret);

        token.safeTransfer(order.redeemer, order.amount);
    }

    function refund(bytes32 orderID) external {
        Order storage order = orders[orderID];

        require(order.redeemer != address(0), "HTLC: order not initiated");
        require(!order.isFulfilled, "HTLC: order fulfilled");
        require(order.initiatedAt + order.timelock < block.number, "HTLC: order not expired");

        order.isFulfilled = true;

        emit Refunded(orderID);

        token.safeTransfer(order.initiator, order.amount);
    }

    function _initiate(
        address initiator_,
        address redeemer_,
        uint256 timelock_,
        uint256 amount_,
        bytes32 secretHash_
    ) internal {
        require(initiator_ != redeemer_, "HTLC: same initiator and redeemer");

        bytes32 orderID = sha256(abi.encode(secretHash_, initiator_));
        Order memory order = orders[orderID];

        require(order.redeemer == address(0), "HTLC: duplicate order");

        Order memory newOrder = Order({
            isFulfilled: false,
            initiator: initiator_,
            redeemer: redeemer_,
            initiatedAt: block.number,
            timelock: timelock_,
            amount: amount_
        });
        orders[orderID] = newOrder;

        emit Initiated(orderID, secretHash_, orders[orderID].amount);

        token.safeTransferFrom(initiator_, address(this), orders[orderID].amount);
    }

    function instantRefund(bytes32 orderID, bytes calldata signature) external {
        address redeemer = _hashTypedDataV4(keccak256(abi.encode(_REFUND_TYPEHASH, orderID))).recover(signature);
        Order storage order = orders[orderID];

        require(order.redeemer == redeemer, "HTLC: invalid redeemer signature");
        require(!order.isFulfilled, "HTLC: order fulfilled");

        order.isFulfilled = true;

        emit Refunded(orderID);

        token.safeTransfer(order.initiator, order.amount);
    }
}
```

### Deployed Address

The Atomic Swap smart contract is deployed at the following addresses on different networks:
| Network | Chain ID | Address |
| --- | --- | --- |
| Arbitrum | 42161 | [TODO](https://etherscan.io/address/0x33d0568941c0c64ff7e0fb4fba0b11bd37deed9f) |
| Ethereum | 1 | [TODO](https://ropsten.etherscan.io/address/0x6f6d7d5f565b8d4c4a5f3bfa9b3c3f5b6e9b0b5f) |
| Sepolia | 11155111 | [TODO](https://rinkeby.etherscan.io/address/0x6f6d7d5f565b8d4c4a5f3bfa9b3c3f5b6e9b0b5f) |
