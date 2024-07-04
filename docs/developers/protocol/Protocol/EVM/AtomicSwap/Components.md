---
id: components
title: Components
sidebar_label: Components
sidebar_position: 1
---

# Components

The Atomic Swap contract is composed of the following components:

## Structs

### Order

The `Order` struct represents the details of an atomic swap order.

```solidity
struct Order {
    bool isFulfilled;
    address initiator;
    address redeemer;
    uint256 initiatedAt;
    uint256 timelock;
    uint256 amount;
}
```

- `isFulfilled`: A boolean flag indicating whether the order has been fulfilled.
- `initiator`: The address of the party that initiated the order.
- `redeemer`: The address of the party that can redeem the order.
- `initiatedAt`: The block number at which the order was initiated.
- `timelock`: The number of blocks after which the order can be refunded.
- `amount`: The amount of tokens to be transferred in the order.

## State Variables

### token

The `token` state variable is an immutable reference to the ERC20 token contract.

```solidity
IERC20 public immutable token;
```

### orders

The `orders` state variable is a mapping of order IDs to `Order` structs.

```solidity
mapping(bytes32 => Order) public orders;
```

### \_INITIATE_TYPEHASH

The `_INITIATE_TYPEHASH` state variable is the EIP712 type hash for the `initiate` function.

```solidity
bytes32 private constant _INITIATE_TYPEHASH = keccak256("Initiate(address redeemer,uint256 timelock,uint256 amount,bytes32 secretHash)");
```

### \_REFUND_TYPEHASH

The `_REFUND_TYPEHASH` state variable is the EIP712 type hash for the `refund` function.

```solidity
bytes32 private constant _REFUND_TYPEHASH = keccak256("Refund(bytes32 orderId)");
```

## Events

### Initiated

The `Initiated` event is emitted when an order is initiated.

```solidity
event Initiated(bytes32 indexed orderID, bytes32 indexed secretHash, uint256 amount);
```

- `orderID`: The ID of the order.
- `secretHash`: The hash of the secret used in the order.
- `amount`: The amount of tokens transferred in the order.

### Redeemed

The `Redeemed` event is emitted when an order is redeemed.

```solidity
event Redeemed(bytes32 indexed orderID, bytes32 indexed secretHash, bytes secret);
```

- `orderID`: The ID of the order.
- `secretHash`: The hash of the secret used in the order.
- `secret`: The secret used to redeem the order.

### Refunded

The `Refunded` event is emitted when an order is refunded.

```solidity
event Refunded(bytes32 indexed orderID);
```

- `orderID`: The ID of the order.

## Modifiers

### safeParams

The `safeParams` modifier ensures that the parameters of the `initiate` and `initiateWithSignature` functions are valid.

```solidity
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
```

- `redeemer`: The address of the redeemer.
- `timelock`: The timelock duration.
- `amount`: The amount of tokens to be transferred.

It ensures the following conditions:

- The redeemer address is not zero.
- The timelock duration is greater than zero.
- The amount of tokens to be transferred is greater than zero.

## Functions

### constructor

The `constructor` function initializes the contract with the ERC20 token address, name, and version.

```solidity
constructor(address token_, string memory name, string memory version) EIP712(name, version) {
    token = IERC20(token_);
}
```

- `token_`: The address of the ERC20 token contract.
- `name`: The name of the contract.
- `version`: The version of the contract.

It sets the `token` state variable to the ERC20 token contract.

### initiate

The `initiate` function initiates an atomic swap order.

```solidity
function initiate(
    address redeemer,
    uint256 timelock,
    uint256 amount,
    bytes32 secretHash
) external safeParams(redeemer, timelock, amount) {
    _initiate(msg.sender, redeemer, timelock, amount, secretHash);
}
```

- `redeemer`: The address of the redeemer.
- `timelock`: The timelock duration.
- `amount`: The amount of tokens to be transferred.
- `secretHash`: The hash of the secret used in the order.

It calls the internal `_initiate` function with the initiator as the sender address.

### initiateWithSignature

The `initiateWithSignature` function initiates an atomic swap order with a signature.

```solidity
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
```

- `redeemer`: The address of the redeemer.
- `timelock`: The timelock duration.
- `amount`: The amount of tokens to be transferred.
- `secretHash`: The hash of the secret used in the order.
- `signature`: The signature of the initiator.

It recovers the initiator address from the signature and calls the internal `_initiate` function.

### redeem

The `redeem` function redeems an atomic swap order.

```solidity
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
```

- `orderID`: The ID of the order.
- `secret`: The secret used to redeem the order.

It checks that the order is initiated and not fulfilled. Then, it verifies the secret and transfers the tokens to the redeemer.

### refund

The `refund` function refunds an atomic swap order.

```solidity
function refund(bytes32 orderID) external {
    Order storage order = orders[orderID];

    require(order.redeemer != address(0), "HTLC: order not initiated");
    require(!order.isFulfilled, "HTLC: order fulfilled");
    require(order.initiatedAt + order.timelock < block.number, "HTLC: order not expired");

    order.isFulfilled = true;

    emit Refunded(orderID);

    token.safeTransfer(order.initiator, order.amount);
}
```

- `orderID`: The ID of the order.

It checks that the order is initiated, not fulfilled, and has expired. Then, it refunds the tokens to the initiator.

### instantRefund

The `instantRefund` function refunds an atomic swap order instantly with a signature.

```solidity
function instantRefund(bytes32 orderID, bytes calldata signature) external {
    address redeemer = _hashTypedDataV4(keccak256(abi.encode(_REFUND_TYPEHASH, orderID))).recover(signature);
    Order storage order = orders[orderID];

    require(order.redeemer == redeemer, "HTLC: invalid redeemer signature");
    require(!order.isFulfilled, "HTLC: order fulfilled");

    order.isFulfilled = true;

    emit Refunded(orderID);

    token.safeTransfer(order.initiator, order.amount);
}
```

- `orderID`: The ID of the order.
- `signature`: The signature of the redeemer.

It recovers the redeemer address from the signature and refunds the tokens to the initiator instantly.

### \_initiate

The `_initiate` function initiates an atomic swap order.

```solidity
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
```

- `initiator_`: The address of the initiator.
- `redeemer_`: The address of the redeemer.
- `timelock_`: The timelock duration.
- `amount_`: The amount of tokens to be transferred.
- `secretHash_`: The hash of the secret used in the order.

It checks that the initiator and redeemer addresses are different, and there is no duplicate order. Then, it creates a new order and transfers the tokens from the initiator to the contract.
