// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.2 <0.9.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TicketsFactory is ERC721 {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NewTicketCreated(uint indexed ticketId, address ticketOwner);
    event TicketsNotAvailable(uint indexed eventId);

    address payable public owner;
    address public eventFactoryAddress;
    uint public price;
    uint public ticketsTotal;
    uint public eventId;
    string public eventName;
    bool public isTicketsAvailable = true;
    string public ticketSymbol = "T";

    struct Ticket {
        uint id;
        uint eventId;
        string eventName;
        uint ticketPrice;
        address ticketOwner;
    }

    Ticket[] public tickets;

    mapping(uint => uint) ticketByEvent;
    mapping(address => uint) ticketByAddress;
    mapping(uint => address) addressByTicket;

    constructor(
        address payable _owner,
        address _eventFactoryAddress,
        uint _eventId,
        string memory _eventName,
        uint _price,
        uint _ticketsTotal
    ) public ERC721(_eventName, ticketSymbol) {
        owner = _owner;
        eventName = _eventName;
        eventFactoryAddress = _eventFactoryAddress;
        eventId = _eventId;
        price = _price;
        ticketsTotal = _ticketsTotal;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier checkIsPaymentEnough() {
        require(msg.value == price, "Payment is not enough for buy the ticket");
        _;
    }

    modifier checkTicketsAvailable() {
        require(isTicketsAvailable == true, "Tickets not available more");
        _;
    }

    function sellTicket() public payable returns (uint256) {

         _tokenIds.increment();
         owner.transfer(msg.value);

         uint ticketId = _tokenIds.current();
         Ticket memory ticket = Ticket(ticketId, eventId, eventName, price, msg.sender);
         tickets.push(ticket);

         _mint(msg.sender, ticketId);

         emit NewTicketCreated(ticketId, msg.sender);

         if(ticketId == ticketsTotal) {
             isTicketsAvailable = false;
             emit TicketsNotAvailable(eventId);
         }

         return ticketId;
     }

    function changeTicketOwner(uint _id, address payable _newOwnerAddress) public payable onlyOwner {
        address ticketOwner = tickets[_id].ticketOwner;
        require(msg.sender == ticketOwner, "Only ticket's' owner can call this function");
        safeTransferFrom(ticketOwner, _newOwnerAddress, tickets[_id].id);
    }

}

/*
        for(uint256 i = 1; i <= totalSupply; i++){
            _tokenIds.increment();
            uint256 ticketId = _tokenIds.current();
            _mint(owner, ticketId);
            Ticket memory ticket = Ticket(ticketId, eventId, eventName, price, msg.sender);
            tickets.push(ticket);
        }
*/

/*    function sellTicket() public payable returns (uint256) {
        _ticketOwner = tickets[ticketId].ticketOwner;
        _ticketOwner.transfer(msg.value);

        changeTicketOwner(ticketId, msg.sender);

        ticketId++;

        if(ticketId == totalSupply) {
            isTicketsAvailable = false;
            emit TicketsNotAvailable(eventId);
        }

        return ticketId;
    }*/



/*
        for(uint256 i = 1; i<= totalSupply; i++){
            _tokenIds.increment();
            uint256 ticketId = _tokenIds.current();
            _mint(owner, ticketId);
        }*/

/*    function transferEth() public payable returns (uint256) {
        owner.transfer(msg.value);
        return msg.value;
    }

    function addTicket() public returns (uint256) {
        _ticketsId.increment();
        ticketId = _ticketsId.current();
        Ticket memory newTicket = Ticket(ticketId, eventId, eventName, msg.sender);
        tickets.push(newTicket);

        if(ticketId == ticketsTotal) {
            isTicketsAvailable = false;
            emit TicketsNotAvailable(eventId);
        }

        return ticketId;
    }

    function mintTicket() public payable returns (uint256) {
        _mint(msg.sender, ticketId);
        emit NewTicketCreated(ticketId, msg.sender);
        return ticketId;
    }

    function ticketsList() public view returns (uint){
        return tickets.length;
    }*/


/*
USE CASE / USER STORIES

The event organizer creates a new event:
1. The user enters an events creation page under the login / password issued to him and fills out a form with the necessary data for the event -
name, description, location, number of available tickets, cost of tickets in   ETH, start date and end date.
2. After clicking the confirmation button, a new event is created in the blockchain, while before the start date
or before the sale of all tickets, ticket sales are available on the ticket purchase page (then the buy button is inactive),
after the end date the event is not displayed in the list of available
3. The user can cancel the event by clicking the Cancel button. After click  the button, the event disappears from the available ones.
The organizer makes refunds  to customers manually without using the application.

On the second page of the application, a regular visitor can buy a ticket to the event
1. The page displays a list of events, end date that greater than a current date. Each event displays an information -
name, description, location, ticket price tickets in ETH, start date and end date.
2. Each event has a window for entering an  ether wallet address and a ticket purchase button for buy it, which is active if there are free tickets
4. At the bottom of the event block there is a ticket control block - a ticket ID entry window with information near
about the ticket status ("Pending", "Payment was successful”), also a block has a window for entering an ether wallet address
and " Transfer ticket "button, after clicking on this button the owner of the ticket will changes on entered address

*/