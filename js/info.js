const contractAddress = '0xE31ED3e36c4337877e041BF8908e893a06F2DA08';

// The ABI for the smart contract
const contractABI = [{
        "inputs": [],
        "name": "getTickets",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lotteryId",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    }
];
async function getTicketCount() {
    try {
        const web3 = new Web3('https://bsc-dataseed.binance.org');
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const currentTicketCount = (await contract.methods.getTickets().call()).toString();
        const ticketCountResult = document.getElementById("ticketCountResult");
        ticketCountResult.textContent = `${currentTicketCount} out of 25`;
    } catch (error) {
        console.error(error);
    }
}

async function checkLotteryId() {
    try {
        const web3 = new Web3('https://bsc-dataseed.binance.org');
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const currentLotteryId = (await contract.methods.lotteryId().call()).toString();
        const drawCountResult = document.getElementById("drawCountResult");
        drawCountResult.textContent = `Total: ${parseInt(currentLotteryId) - 1}`;
    } catch (error) {
        console.error(error);
    }
}

document.querySelector('.ticket-count-btn').addEventListener('click', getTicketCount);
document.querySelector('.draw-count-btn').addEventListener('click', checkLotteryId);