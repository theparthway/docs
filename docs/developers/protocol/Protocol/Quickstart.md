---
id: quickstart
title: Quickstart
sidebar_label: Quickstart
sidebar_position: 2
---

# Quickstart

We have our deployments shhh... 🤫! Directly hop on to setup Garden Finance protocol locally.

## Usage

### Prerequisites

There are a few things you need to have installed before you can setup Garden locally:

- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/getting-started/install/)
- [HardHat](https://hardhat.org/hardhat-runner/docs/getting-started/)
- [Docker](https://docs.docker.com/get-docker/) (optional)

Now that you have all the prerequisites installed, you can setup Garden locally. So let's get started!

### Setup

Garden can be setup locally using Hardhat Network or Docker. You can choose the method that suits you best.

> The Docker method is helpful for users who do not want to install the prerequisites on their local machine.

#### Hardhat Network

```bash
# Clone the repository
git clone https://github.com/gardenfi/garden-sol.git
cd garden-sol

# Install dependencies
yarn install

# Start the Hardhat network in another terminal
npx hardhat node

# Deploy the contracts
npx hardhat ignition deploy ignition/modules/fullDeploy.ts --network hardhat --reset
```

#### Docker

```bash
# Clone the repository
git clone https://github.com/gardenfi/garden-sol.git
cd garden-sol

# Build the Docker image
docker build -t garden-sol .

# Run the Docker container
docker run -it garden-sol
```

### Testing

Garden has a comprehensive test suite that covers all the Smart Contracts and Bitcoin Scripts. It ensures that the code is working as expected and there are no regressions.

```bash
# Clone the repository
git clone https://github.com/gardenfi/garden-sol.git
cd garden-sol

# Install dependencies
yarn install

# Run the tests
npx hardhat test

# Run the coverage (optional)
npx hardhat coverage
```

## Security

If you discover a security vulnerability within Garden, please send an e-mail to [security@garden.finance](mailto:security@garden.finance). We take these issues very seriously and will respond promptly.

You may view our full security and bug bounty policy [here](https://docs.garden.finance/home/security/bug-bounty).
