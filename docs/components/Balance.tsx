import { useEffect, useState } from "react";
import { Contract, JsonRpcProvider, formatUnits } from "ethers";

enum CHAIN {
  Bitcoin = "Bitcoin",
  Ethereum = "Ethereum",
  Arbitrum = "Arbitrum",
}

const rpcs: Map<CHAIN, string> = new Map([
  [CHAIN.Bitcoin, "https://mempool.space/api/"],
  [CHAIN.Ethereum, "https://rpc.ankr.com/eth"],
  [CHAIN.Arbitrum, "https://rpc.ankr.com/arbitrum"],
]);

const abi = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

async function getEthBalance(
  chain: CHAIN,
  address: string,
  token: string
): Promise<number> {
  const rpcUrl = rpcs.get(chain);
  if (!rpcUrl) {
    throw new Error("Unsupported chain");
  }

  const provider = new JsonRpcProvider(rpcUrl);
  const contract = new Contract(token, abi, provider);
  const balancePromise = contract.balanceOf(address);
  const decimalsPromise = contract.decimals();
  const [balance, decimals] = await Promise.all([
    balancePromise,
    decimalsPromise,
  ]);
  return parseFloat(formatUnits(balance, decimals));
}

async function getBtcBalance(chain: CHAIN, address: string): Promise<number> {
  const rpcUrl = rpcs.get(chain);
  if (!rpcUrl) {
    throw new Error("Unsupported chain");
  }
  const utxos: { value: number }[] = await fetch(
    `${rpcUrl}address/${address}/utxo`
  ).then((res) => res.json());
  const balance = utxos.reduce((acc, utxo) => acc + utxo.value, 0);
  return parseFloat(formatUnits(balance, 8));
}

const Balance = ({
  chain,
  address,
  token,
}:
  | {
      chain: CHAIN.Arbitrum | CHAIN.Ethereum;
      address: string;
      token: string;
    }
  | {
      chain: CHAIN.Bitcoin;
      address: string;
      token?: undefined;
    }) => {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (chain === CHAIN.Ethereum || chain === CHAIN.Arbitrum) {
          setBalance(await getEthBalance(chain, address, token));
        } else if (chain === CHAIN.Bitcoin) {
          setBalance(await getBtcBalance(chain, address));
        }
      } catch (e) {
        setBalance(null);
      }
    };

    fetchBalance();
  }, [chain, address, token]);

  if (balance === null) {
    return <span>Loading...</span>;
  }

  return <span>{balance}</span>;
};

export default Balance;
