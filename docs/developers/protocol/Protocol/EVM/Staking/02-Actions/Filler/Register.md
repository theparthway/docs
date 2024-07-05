---
id: register
title: Register
sidebar_label: Register
sidebar_position: 1
---

# Register

Registering is the process of registering a filler in Garden ecosystem. The filler can register by calling the `register` function.

## Process

```typescript
// All required imports, providers, and contracts are assumed to be declared here

await gardenStaker.connect(alice).register();
```

1. Call `register` function to be a filler.
