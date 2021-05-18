//import Web3 from 'web3';
//const Web3 = require('web3');
import Web3 from "web3";

const web3 = new Web3(window.ethereum);
//const web3 = new Web3(Web3.givenProvider)
const TicketsFactory = require('../../ABIs/TicketsFactory.json');
//const TicketsFactory = require('../../../build/contracts/TicketsFactory.json');
const EventFactory = require('../../ABIs/EventFactory.json');
//const EventFactory = require('../../../build/contracts/EventFactory.json');
const contractAddress = '0xcb7b5e994b5d3d247b1d4a26e5fcb158679bdb31';

export const ownerAddress = '0x579a7303065e83B7c2999d6c8FB9a64272d68275';

// Cannot read property 'Contract' of undefined  - What's a problem?
//const eventProductionContract = new Web3.eth.Contract(EventFactory.abi, "0xf6a5c33d1b5e2a903daa4e9b1121c363e53b900d" );

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
        debugger
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

    buyTicketAPI(eventID, ticketsPrice, userAddress) {
        debugger
        const TicketsFactoryContract = new web3.eth.Contract(TicketsFactory.abi, contractAddress);
        console.log(TicketsFactoryContract.methods);
        TicketsFactoryContract.methods.sellTicket().send({from: userAddress, value: ticketsPrice})
            .on('transactionHash', function (hash) {
                console.log('hash');
                //alert('hash');
                console.log(hash);
                // alert(hash)
            })

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
