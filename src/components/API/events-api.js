const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

//web3 from Truffle doc
/*if (typeof web3 !== 'undefined') {
    App.web3Provider = web3.currentProvider;
    web3 = new Web3(web3.currentProvider);
} else {
    // If no injected web3 instance is detected, fallback to Ganache.
    App.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:7545');
    web3 = new Web3(App.web3Provider);
}*/

//web3 for Truffle
/*const ganache = require("ganache-core");
const web3 = new Web3(ganache.provider());*/

//abi for Truffle
//const TicketsFactory = require('../../../build/contracts/TicketsFactory.json');
//const EventFactory = require('../../../build/contracts/EventFactory.json');

//ABI for Ropsten
const TicketsFactory = require('../../ABIs/TicketsFactory.json');
const EventFactory = require('../../ABIs/EventFactory.json');

const contractAddress = '0x9865e06db8575b313538202899c4d614dca4ed12';

export const ownerAddress = '0x579a7303065e83B7c2999d6c8FB9a64272d68275';

const eventProductionContract = new web3.eth.Contract(EventFactory.abi, contractAddress);
const eventMethods = eventProductionContract.methods;

export const eventsAPI = {

    auth() {
        if (web3.eth) {
            return web3.eth.requestAccounts().then(response => {
                return response
            })
        } else return 'Error connect to MetaMask'
    },

    addNewEvent(values, userAddress) {
        if (userAddress) {
            return eventMethods.addEvent(
                values.eventName,
                values.description,
                values.location,
                values.image,
                values.price,
                values.amount,
                values.startDate,
                values.endDate
            ).send({from: userAddress})
        } else return 'Please, authorize again'
    },

    getEventsList() {
        if (window.ethereum) {
            return eventMethods.eventsList().call()
        } else return 'Error connect to MetaMask'

    },

    closeEventAPI(eventId, userAddress) {
        return eventMethods.closeEvent(eventId).send({from: userAddress})
    },

    sellTicketAPI(userAddress, ticketsContractAddress, ticketsPrice) {
        const ticketsContract = new web3.eth.Contract(TicketsFactory.abi, ticketsContractAddress);
        return ticketsContract.methods.sellTicket().send({from: userAddress, value: ticketsPrice})
            .on('transactionHash', function (hash) {
                console.log('hash');
                //alert('hash');
                console.log(hash);
               // return 'hash'
            })
            .on('error', function (error, receipt) {
                console.log('error')
                //return `Transaction ${receipt} error`
            })
            .then(response => {
                debugger
                return response.events.NewTicketCreated.returnValues.ticketId
            })
    },
    getTicketsAPI(ticketsContractAddress) {
        const ticketsContract = new web3.eth.Contract(TicketsFactory.abi, ticketsContractAddress);
        return ticketsContract.methods.ticketsList().call()
    },
    /*subscribeEventsAPI() {

    }
    web3.eth.subscribe(type [, options] [, callback]);*/
}
