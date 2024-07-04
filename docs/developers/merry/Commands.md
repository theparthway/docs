---
id: merry-cmds
---

# Commands

Merry provides a variety of commands to manage your testing environment:

### Starting Merry

```bash
merry go
```

Starts all services, including the Bitcoin regtest node, Ethereum localnet node, explorers for the nodes and the catalog services.

- `--bare` flag: Starts only the multi-chain services (Bitcoin and Ethereum nodes with explorers) and excludes catalog services. This option is useful if you don't need the additional functionalities such as Filler and Orderbook by Catalog.

- `--headless` flag: Starts all services except for frontend interfaces. This can be helpful for running Merry in headless environments (e.g., servers) where a graphical user interface is not required.

### Stopping Merry

```bash
merry stop

# reset data
merry stop -d
```

Stops all running services. Use `--delete` or `-d` to remove data.

### Getting logs

```bash
merry logs -s <service>

# getting logs of evm service
merry logs -s evm
```

Replace \<service> with the specific service (e.g., Filler, EVM) to view its logs.

### Replacing a service with a local one

```bash
merry replace <service>
```

This command allows you to replace a service with your local development version. Make sure you're in the directory containing the local service's Dockerfile. Supported services include Filler, Orderbook, and EVM.

### Calling bitcoin rpc methods

```bash
merry rpc <method> <params>

# example: get blockchain info
merry rpc getblockchaininfo
```

Interact with the Bitcoin regtest node directly using RPC methods.

### Updating Docker images

```bash
merry update
```

Keep your testing environment up-to-date by updating all Docker images.

### Fund accounts

```bash
merry faucet <address>
```

Fund any EVM or Bitcoin address for testing purposes. Replace `<address/>` with the address you want to fund. It could be a Bitcoin or Ethereum address.

### List all commands

```bash
merry --help
```

### Generate auto-completion scripts

```bash
merry completion <shell>
```

Generate auto-completion scripts for your shell. Supported shells include bash, zsh, fish, and powershell.

### Get the version of Merry

```bash
merry version
```
