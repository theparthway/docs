---
id: renew
title: Renew
sidebar_label: Renew
sidebar_position: 4
---

# Renew

Renewing is the process of renewing the duration of a stake in Garden ecosystem. The staker can renew the duration of a stake by calling the `renew` function.

## Process

```typescript
// All required imports, providers, and contracts are assumed to be declared here

await gardenStaker.connect(alice).renew(stakeId, 730 * 7200);
```

1. The `renew` function is called by the staker to renew the duration of a stake.
