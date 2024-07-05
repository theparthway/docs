---
id: deregister
title: DeRegister
sidebar_label: DeRegister
sidebar_position: 3
---

# DeRegister

DeRegistering is the process of deregistering a filler in the Garden ecosystem. The filler can deregister by calling the `deRegister` function.

## Process

```typescript
// All required imports, providers, and contracts are assumed to be declared here

await gardenStaker.connect(alice).deregister();
```

1. Call `deRegister` function to deregister as a filler.
