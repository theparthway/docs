---
id: vote
title: Vote
sidebar_label: Vote
sidebar_position: 1
---

# Vote

Voting is the process of selecting a filler to fill a atomic swap in Garden ecosystem. The staker can vote for a filler by calling the `vote` function.

## Process

```typescript
// All required imports, providers, and contracts are assumed to be declared here

await gardenStaker.connect(alice).vote(filler.address, 1, 180 * 7200);
```

1. The `vote` function is called by the staker to vote for a filler.
