import { useEffect, useState } from "react";
import { Contract, JsonRpcProvider, formatUnits } from "ethers";

type utxo = {
    value: number;
};

enum CHAIN {
    bitcoin = "bitcoin",
    ethereum = "ethereum",
    arbitrum = "arbitrum",
}

const Rpcurls: Map<CHAIN, string> = new Map([
    [CHAIN.bitcoin, "https://mempool.space/api/"],
    [CHAIN.ethereum, "https://rpc.ankr.com/eth"],
    [CHAIN.arbitrum, "https://rpc.ankr.com/arbitrum"],
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
    const rpcUrl = Rpcurls.get(chain);
    if (!rpcUrl) {
        throw new Error("Unsupported chain");
    }

    const provider = new JsonRpcProvider(rpcUrl);
    const contract = new Contract(token, abi, provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    const formattedBalance = parseFloat(formatUnits(balance, decimals));

    return formattedBalance;
}

async function getBtcBalance(chain: CHAIN, address: string): Promise<number> {
    const rpcUrl = Rpcurls.get(chain);
    if (!rpcUrl) {
        throw new Error("Unsupported chain");
    }
    var utxos: utxo[] = await fetch(`${rpcUrl}address/${address}/utxo`).then(
        (res) => res.json()
    );
    var balance = 0;
    for (var i = 0; i < utxos.length; i++) {
        balance += utxos[i].value;
    }

    const formattedBalance = parseFloat(formatUnits(balance, 8));
    return formattedBalance;
}

const Balance = ({
    chain,
    address,
    token,
}: {
    chain: CHAIN;
    address: string;
    token?: string;
}) => {
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                if (chain === CHAIN.ethereum || chain === CHAIN.arbitrum) {
                    if (!token) {
                        throw new Error(
                            "Token address is required for Ethereum and Arbitrum chains"
                        );
                    }
                    const ethBalance = await getEthBalance(
                        chain,
                        address,
                        token
                    );
                    setBalance(ethBalance);
                } else if (chain === CHAIN.bitcoin) {
                    const btcBalance = await getBtcBalance(chain, address);
                    setBalance(btcBalance);
                }
            } catch (e) {
                console.error(e);
                setBalance(0);
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
