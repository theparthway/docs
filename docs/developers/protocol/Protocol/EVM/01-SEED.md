---
id: seed
title: SEED
sidebar_label: SEED
---

# SEED

SEED an ERC20 token, with total supply of 147,000,000 tokens.

## Smart Contract

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SEED is ERC20 {
    constructor() ERC20("SEED", "SEED") {
        _mint(_msgSender(), 147_000_000 * (10 ** decimals()));
    }
}
```

Given Smart contract is an ERC20 token with the following properties:

- Name: SEED
- Symbol: SEED
- Total Supply: `147,000,000`
- Decimals: `18`

### Deployed Address

The SEED smart contract is deployed at the following addresses on different networks:
| Network | Chain ID | Address |
| --- | --- | --- |
| Arbitrum | 42161 | [`0x86f65121804D2Cdbef79F9f072D4e0c2eEbABC08`](https://arbiscan.io/address/0x86f65121804D2Cdbef79F9f072D4e0c2eEbABC08) |
| Ethereum | 1 | [`0x5eed99d066a8caf10f3e4327c1b3d8b673485eed`](https://etherscan.io/address/0x5eed99d066a8caf10f3e4327c1b3d8b673485eed) |
