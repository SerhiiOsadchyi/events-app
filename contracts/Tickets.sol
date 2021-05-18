// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.6.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TicketsFactory is ERC721 {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NewTicketCreated(uint indexed ticketId, address newOwner);
    event TicketsNotAvailable(uint indexed eventId);

    address payable public owner;
    address public eventFactoryAddress;
    uint public price;
    uint public ticketsTotal;
    uint public eventId;
    string public eventName;
    bool public isTicketsAvailable = true;


    struct Ticket {
        uint id;
        uint eventId;
        string eventName;
        address newOwner;
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
    ) public ERC721(_eventName, "T") {
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

    function mint() public payable {
        _tokenIds.increment();
        uint newTokenId = _tokenIds.current();

        owner.transfer(msg.value);
        _mint(msg.sender, newTokenId);

        Ticket memory ticket = Ticket(newTokenId, eventId, msg.sender);
        tickets.push(ticket);

        emit NewTicketCreated(newTokenId, msg.sender);

        if(newTokenId == ticketsTotal) {
            isTicketsAvailable = false;
            emit TicketsNotAvailable(eventId);
        }
    }

    function changeTicketOwner(uint _id, address payable _newOwnerAddress) public payable onlyOwner {
        safeTransferFrom(owner, _newOwnerAddress, tickets[_id].id);
    }

}

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