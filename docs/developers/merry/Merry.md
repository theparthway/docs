---
id: merry
title: Merry
---

import MerryTitle from "./Title";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# <MerryTitle />

Streamline your multi-chain testing with Merry!

This CLI tool leverages Docker to effortlessly set up a multi-chain testing environment in a single command. Merry includes Bitcoin regtest node, Ethereum localnet node, and essential Catalog services(Filler and Orderbook), providing a self-contained space to test your applications independently of external services.

It supports a variety of features, including a faucet, Electrum services and an Orderbook with Filler.

Orderbook is an order matching engine developed by Catalog, use this [section](/docs/developers/fundamentals/orderbook/Orderbook.md) to learn more about it.

Filler is a bot to fill orders based on strategies set, learn more about it in this [section](/docs/developers/fundamentals/filler/filler.md).

## Installation

:::note
Merry supports arm64 and amd64 architectures. For Windows users, you are required to use Windows Subsystem for Linux (WSL) to run Merry.
:::

### Prerequisites

Before using Merry, ensure you have Docker installed and running on your system. If not, you'll need to download and install Docker from the official [website](https://www.docker.com).

## Install using the script

<Tabs>
<TabItem value="unix" label="Linux & MacOS" default>
Run the following command to install Merry

```bash
curl https://get.merry.dev | bash
```

</TabItem>
<TabItem value="windows" label="Windows">
In a WSL terminal, run `sudo dockerd` and verify if the docker daemon is running, then

```bash
curl https://get.merry.dev | bash
```

</TabItem>
</Tabs>

Merry stores its configuration files and other data in a directory on your system. This directory is typically named `.merry`.
