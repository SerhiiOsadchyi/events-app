// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

pragma solidity >=0.6.2 <0.9.0;
pragma experimental ABIEncoderV2;

contract TicketsFactory is ERC721 {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NewTicketCreated(uint indexed ticketId, address ticketOwner);
    event TicketsNotAvailable(uint indexed eventId);

    address payable public owner;
    uint public price;
    uint public ticketsTotal;
    uint public eventId;
    string public eventName;
    bool public isTicketsAvailable;
    string public ticketSymbol = "T";

    struct Ticket {
        uint id;
        uint eventId;
        string eventName;
        uint ticketPrice;
        address ticketOwner;
    }

    Ticket[] public tickets;

    mapping(uint => uint[]) ticketFromTickets;
    mapping(address => uint) ticketByAddress;
    mapping(uint => address) addressByTicket;

    constructor(
        address payable _owner,
        uint _eventId,
        string memory _eventName,
        uint _price,
        uint _ticketsTotal
    ) public ERC721(_eventName, ticketSymbol) {
        owner = _owner;
        eventName = _eventName;
        eventId = _eventId;
        price = _price;
        ticketsTotal = _ticketsTotal;
        isTicketsAvailable = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier checkIsPaymentEnough() {
        require(msg.value >= price, "Payment is not enough for buy the ticket");
        _;
    }

    modifier checkTicketsAvailable() {
        require(isTicketsAvailable == true, "Tickets not available more");
        _;
    }

    function sellTicket() public payable checkIsPaymentEnough checkTicketsAvailable returns (uint256) {

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

    function changeTicketOwner(address _oldOwner,  address _newOwner, uint256  _id)  external payable {
        require(_oldOwner == ownerOf(_id), "Only owner can to transfer this ticket");
        safeTransferFrom(_oldOwner, _newOwner, _id);

        for (uint i = 0; i < tickets.length; i++) {
            if (tickets[i].id == _id && tickets[i].ticketOwner == _oldOwner) {
                tickets[i].ticketOwner = _newOwner;
                break;
            }
        }

        emit Transfer(msg.sender, _newOwner, _id);
    }

    function ticketsList() public view returns (Ticket[] memory){
        return tickets;
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

/*
Примечания:
1. Прослушивание событий из блокчейна не всегда срабатывает:
для ивентов сделал прослушивание события как круговорот через редюсер,
для тикетов - с помощью слушателя.
2. Начальные данные редактировать можно в файле events-api.js (src/components/API/events-api.js)

*/
