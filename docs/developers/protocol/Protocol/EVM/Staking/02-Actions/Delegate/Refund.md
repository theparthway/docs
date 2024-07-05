---
id: refund
title: Refund
sidebar_label: Refund
sidebar_position: 5
---

# Refund

Refunding is the process of refunding the staked token to the staker in Garden ecosystem. The staker can refund the staked token by calling the `refund` function.

## Process

```typescript
// All required imports, providers, and contracts are assumed to be declared here

await gardenStaker['refund(bytes32)'](stakeId1);
```

1. The `refund` function is called by the staker to refund the staked token.
