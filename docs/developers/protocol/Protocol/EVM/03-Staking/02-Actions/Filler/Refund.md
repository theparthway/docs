---
id: refund
title: Refund
sidebar_label: Refund
sidebar_position: 4
---

# Refund

Refunding is the process of refunding the staked amount to the filler in the Garden ecosystem. The filler can refund by calling the `refund` function.

## Process

```typescript
// All required imports, providers, and contracts are assumed to be declared here

await gardenStaker['refund(address)'](alice.address);
```

1. Wait for cooldown period.
2. Call `refund` function to refund the staked amount to the filler.
