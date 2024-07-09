---
id: update-fee
title: Update Fee
sidebar_label: Update Fee
sidebar_position: 2
---

# Update Fee

Filler can update the fee for filling the order.

## Process

```typescript
// All required imports, providers, and contracts are assumed to be declared here

await gardenStaker.connect(alice).updateFee(100);
```

1. Call `updateFee` function with fees in bips.
