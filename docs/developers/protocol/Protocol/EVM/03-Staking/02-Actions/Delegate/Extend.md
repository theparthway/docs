---
id: extend
title: Extend
sidebar_label: Extend
sidebar_position: 3
---

# Extend

Extending is the process of extending the duration of a stake in Garden ecosystem. The staker can extend the duration of a stake by calling the `extend` function.

## Process

```typescript
// All required imports, providers, and contracts are assumed to be declared here

await gardenStaker.connect(alice).extend(stakeID, 730 * 7200);
```

1. The `extend` function is called by the staker to extend the duration of a stake.
