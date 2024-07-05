---
id: change-vote
title: Change Vote
sidebar_label: Change Vote
sidebar_position: 2
---

# Change Vote

Changing vote is the process of changing the vote of a staker for a filler in Garden ecosystem. The staker can change the vote by calling the `changeVote` function.

## Process

```typescript
// All required imports, providers, and contracts are assumed to be declared here

await gardenStaker.connect(alice).changeVote(stakeID, anotherFiller.address);
```

:::info
The `stakeID` is the ID of the stake that emitted by event `Stake` when the staker stakes the token.
:::

1. The `changeVote` function is called by the staker to change the vote for a filler.
