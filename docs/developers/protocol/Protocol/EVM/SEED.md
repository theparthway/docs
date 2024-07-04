---
id: seed
title: SEED
sidebar_label: SEED
sidebar_position: 1
---

# SEED

SEED an ERC20 token, is the utility token powering the Garden ecosystem. It incentivize participation and community engagement. SEED holders can stake their tokens for decision-making power and earning yields, become market makers by holding a certain amount, and enjoy discounted trading fees. The token also offers exclusive access to new features and contests.

The total SEED supply is 147,000,000, with most allocated to community incentives. The remaining tokens are distributed among liquidity, partnerships, grants, team, and investors. The primary way to earn SEED is through the seasons program, with token rewards decaying over time.

The community can propose revisions to the SEED allocation for community incentives, ensuring the tokenomics adapt to the needs of Garden users.

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
| Arbitrum | 42161 | [TODO](https://etherscan.io/address/0x33d0568941c0c64ff7e0fb4fba0b11bd37deed9f) |
| Ethereum | 1 | [TODO](https://ropsten.etherscan.io/address/0x6f6d7d5f565b8d4c4a5f3bfa9b3c3f5b6e9b0b5f) |
| Sepolia | 11155111 | [TODO](https://rinkeby.etherscan.io/address/0x6f6d7d5f565b8d4c4a5f3bfa9b3c3f5b6e9b0b5f) |
