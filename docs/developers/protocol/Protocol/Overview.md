---
id: overview
title: Overview
sidebar_label: Overview
sidebar_position: 1
---

import DocCardList from '@theme/DocCardList';

# Overview

:::info
This section of the documentation is intended only for source code that is relevant to blockchain. If you are looking for the documentation on developing on top of our platform, please refer to the [SDK](/docs/developers/sdk/Sdk.md).
:::

[Garden Finance](https://garden.finance) offers a decentralized and permission-less protocol, enabling users to seamlessly bridge Bitcoin (BTC) to its Wrapped counterpart (WBTC) on Ethereum Virtual Machine (EVM) compatible chains, and vice-versa.

## Key Features

### Bitcoin

<DocCardList
items={[
{
type: "link",
href: "./Bitcoin",
label: "Atomic Swap",
docId: "developers/protocol/Protocol/Bitcoin/bitcoin",
},
]}
/>

### EVM-based Chains

<DocCardList
items={[
{
type: "link",
href: "./EVM/SEED",
label: "SEED",
docId: "developers/protocol/Protocol/EVM/seed",
},
{
type: "link",
href: "./EVM/AtomicSwap",
label: "Atomic Swap",
docId: "developers/protocol/Protocol/EVM/AtomicSwap/atomic-swap",
},
{
type: "link",
href: "./EVM/Staking",
label: "Staking",
docId: "developers/protocol/Protocol/EVM/Staking/staking",
},
{
type: "link",
href: "./EVM/PaymentChannel",
label: "Payment Channel",
docId: "developers/protocol/Protocol/EVM/PaymentChannel/payment-channel",
},
]}
/>
