---
id: merry-installation
---

# Installation

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

Merry stores its configuration files and other data in a directory on your system. This directory is typically named `.merry/volumes/`.

## Install from scratch

- Clone the repository

```bash
git clone https://github.com/catalogfi/merry.git
```

- Building and installing

```bash
cd cmd/merry
# build and install the binary
go install
```
