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

const contractAddress = '0x257f7e36037eb35f03aed09ccbd7cf8c5222378e';

export const ownerAddress = '0x579a7303065e83B7c2999d6c8FB9a64272d68275';

const eventProductionContract = new web3.eth.Contract(EventFactory.abi, contractAddress);
const eventMethods = eventProductionContract.methods;

export const eventsAPI = {

    auth() {
        debugger
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

    sellTicketAPI(userAddress, eventName, eventID, ticketsPrice, ticketsTotal) {
        debugger
        const ticketsMethods = new web3.eth.Contract(TicketsFactory.abi, contractAddress).methods;
        console.log(ticketsMethods);
        let price = Number(ticketsPrice);
        ticketsMethods.sellTicket().send({from: userAddress, value: price})
            .on('transactionHash', function (hash) {
                console.log('hash');
                //alert('hash');
                console.log(hash);
                // alert(hash)
            })

    /*   debugger
        const transferedEth = await ticketsMethods.transferEth().send({from: userAddress, value: ticketsPrice});
        console.log('transferedEth ' + transferedEth);*/

      /*  debugger
        const ticketId = await ticketsMethods.addTicket();
        console.log('ticketId ' + ticketId);

        debugger
        const mintedTicketId = await ticketsMethods.mintTicket();
        console.log('mintedTicketId ' + mintedTicketId);

        debugger
        const tickets = await ticketsMethods.ticketsList();
        console.log('tickets ' + tickets);
*/


        /* .on('confirmation', function (confirmationNumber, receipt) {
             console.log('confirmationNumber');
             alert('confirmationNumber');
             console.log(confirmationNumber);
             alert(confirmationNumber);
             console.log('receipt');
             alert('receipt');
             console.log(receipt);
             alert(receipt)
         })
         .on('receipt', function (receipt) {
             // receipt example
             console.log(receipt);
             alert(receipt)
         })*/
        // })
    }

}
