const buyButton = document.querySelector('.purchaseButton');
const contractAddress = '0xE31ED3e36c4337877e041BF8908e893a06F2DA08';
const ABI = [{
    "inputs": [],
    "name": "enter",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
}];

const web3 = new Web3(Web3.givenProvider || "https://bsc-dataseed1.binance.org/");
const contractInstance = new web3.eth.Contract(ABI, contractAddress);

buyButton.addEventListener('click', () => {
    ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
            if (!accounts || !accounts.length) {
                alert("Please connect your wallet.");
                return;
            }
            const amountToSend = web3.utils.toWei('0.05', 'ether'); // Convert 0.05 ether to wei
            contractInstance.methods.enter().send({ from: accounts[0], value: amountToSend })
                .then(function(transactionReceipt) {
                    console.log("Transaction receipt", transactionReceipt);
                    alert("You have purchased a ticket");
                })
                .catch(function(error) {
                    console.error(error);
                    alert("Transaction failed. Please try again");
                });
        });

});