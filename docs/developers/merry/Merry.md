---
id: merry
title: Merry
---

import MerryTitle from "./Title";

# <MerryTitle />

Streamline your multi-chain testing with merry!

This CLI tool leverages Docker to effortlessly set up a multi-chain testing environment in a single command. Merry includes Bitcoin regtest node, Ethereum localnet node, and essential Catalog services, providing a self-contained space to test your applications independently of external services.

It supports a variety of features, including a faucet, electrum services and an orderbook with COBI.

## Installation

:::note
Merry is only available for Linux and MacOS with arm64 and amd64 architectures.
:::

### Prerequisites

Before using merry, ensure you have Docker installed and running on your system. If not, you'll need to download and install Docker from the official [website](https://www.docker.com).

## Install using the script

You can install merry using the following command.

```bash
curl https://get.merry.dev | bash
```

Merry stores its configuration files and other data in a directory on your system. This directory is typically named `.merry`.
