const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const EvmChains = window.EvmChains;
const Fortmatic = window.Fortmatic;
let web3Modal
let provider;
let selectedAccount;

function init() {
    console.log("Initializing example");
    console.log("WalletConnectProvider is", WalletConnectProvider);
    console.log("Fortmatic is", Fortmatic);
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: "19affef0dbd140e0aca95546e1c5bdd0",
            }
        },
    };
    web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
    });

}
async function fetchAccountData() {
    const web3 = new Web3(provider);
    console.log("Web3 instance is", web3);
    const chainId = await web3.eth.getChainId();
    const chainData = await EvmChains.getChain(chainId);
    document.querySelector("#network-name").textContent = chainData.name;
    const accounts = await web3.eth.getAccounts();
    console.log("Got accounts", accounts);
    selectedAccount = accounts[0];
    document.querySelector("#selected-account").textContent = selectedAccount;
    const template = document.querySelector("#template-balance");
    const accountContainer = document.querySelector("#accounts");
    accountContainer.innerHTML = '';
    const rowResolvers = accounts.map(async(address) => {
        const balance = await web3.eth.getBalance(address);
        const ethBalance = web3.utils.fromWei(balance, "ether");
        const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
        const clone = template.content.cloneNode(true);
        clone.querySelector(".address").textContent = address;
        clone.querySelector(".balance").textContent = humanFriendlyBalance;
        accountContainer.appendChild(clone);
    });
    await Promise.all(rowResolvers);
    document.querySelector("#prepare").style.display = "none";
    document.querySelector("#connected").style.display = "block";
}
async function refreshAccountData() {
    document.querySelector("#connected").style.display = "none";
    document.querySelector("#prepare").style.display = "block";
    document.querySelectorAll("#btn-connect").setAttribute("disabled", "disabled")
    await fetchAccountData(provider);
    document.querySelectorAll("#btn-connect").removeAttribute("disabled")
}

async function onConnect() {


    console.log("Opening a dialog", web3Modal);
    try {
        provider = await web3Modal.connect();
        alert("Connected")
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }
    provider.on("accountsChanged", (accounts) => {
        fetchAccountData();
    });
    provider.on("chainChanged", (chainId) => {
        fetchAccountData();
    });
    provider.on("chainChanged", (networkId) => {
        fetchAccountData();
    });
    await refreshAccountData();
}
window.addEventListener('load', async() => {
    init();
    let connectTriggers = document.querySelectorAll("#btn-connect");

    connectTriggers.forEach(trigger => {
        trigger.addEventListener("click", onConnect);
    });
});