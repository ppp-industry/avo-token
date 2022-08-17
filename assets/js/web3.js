const ABI = [
    { inputs: [], name: "buyTokens", outputs: [], stateMutability: "payable", type: "function" },
    {
        inputs: [],
        name: "price",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
];

const contractAddress = "0x00a1a06aE75c7e1503103fBeAc872d2321697e99";
const chainId = 56;
let wallet = null;
let contract = null;
const provider = new ethers.providers.Web3Provider(window.ethereum);

async function getPriceFromBinance(pairSymbol) {
    const res = await fetch(`https://www.binance.com/api/v3/ticker/price?symbol=${pairSymbol}`);
    const { price } = await res.json();
    return price;
}

async function setPrices() {
    try {
        contract = new ethers.Contract(
            contractAddress,
            ABI,
            new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org/")
        );
        const bnbusdPrice = await getPriceFromBinance("BNBUSDT");
        const bnbrubPrice = await getPriceFromBinance("BNBRUB");
        const price = await contract.price();
        const avobnbPrice = 1 / ethers.utils.formatUnits(price, 8);
        const avousdPrice = bnbusdPrice * avobnbPrice;
        const avorubPrice = bnbrubPrice * avobnbPrice;

        $("#rub-course").text(avorubPrice.toFixed(3));
        $("#bnb-course").text(avobnbPrice);
        $("#usd-course").text(Number(avousdPrice).toFixed(3));
    } catch (err) {
        console.error(err);
    }
}

$(document).ready(setPrices);

async function checkNetwork() {
    try {
        if (window.ethereum.networkVersion !== chainId) {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: ethers.utils.hexlify(chainId) }],
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function connectWallet() {
    await checkNetwork();
    const accounts = await provider.send("eth_requestAccounts", []);

    wallet = accounts[0];

    $("#connectWallet").text(wallet.slice(0, 5) + "...." + wallet.slice(-5));

    window.ethereum.on("accountsChanged", function (accounts) {
        wallet = accounts[0];
        $("#connectWallet").text(wallet.slice(0, 5) + "...." + wallet.slice(-5));
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        contract = new ethers.Contract(contractAddress, ABI, provider);
    });

    contract = new ethers.Contract(contractAddress, ABI, provider);
}

$("#connectWallet").on("click", async () => {
    await connectWallet();
});

$("#buyBtn").on("click", async (event) => {
    try {
        await checkNetwork();
        if (event.target.classList.contains("tokens-amount")) return;
        if (!wallet) await connectWallet();
        const price = await contract.price();
        const bnbPrice = ethers.utils.parseEther((1 / ethers.utils.formatUnits(price, 8)).toString());
        const trusted = contract.connect(provider.getSigner());
        await trusted.buyTokens({ value: bnbPrice.mul($("#tokensAmount").val()).toHexString() });
    } catch (err) {
        if (err.code === -32603) {
            alert("Недостаточно средств");
        }
        console.error(err);
    }
});

async function setIcoPrices() {
    const round2BnbPrice = 0.0000364884;
    const round3BnbPrice = 0.000364884;
    try {
        const res = await fetch("https://www.binance.com/api/v3/ticker/price?symbol=BNBRUB");

        const { price } = await res.json();

        $("#icoRound2Price").text(`${round2BnbPrice.toFixed(6)}BNB(~${(price * round2BnbPrice).toFixed()}руб)`);
        $("#icoRound3Price").text(`${round3BnbPrice.toFixed(6)}BNB(~${(price * round3BnbPrice).toFixed()}руб)`);
    } catch (err) {
        $("#icoRound2Price").text(`${round2BnbPrice.toFixed(6)}BNB`);
        $("#icoRound3Price").text(`${round3BnbPrice.toFixed(6)}BNB`);
        console.error(err);
    }
}

window.addEventListener("load", setIcoPrices);
