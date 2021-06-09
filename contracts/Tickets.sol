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

/////  Administrator rules  \\\\\

The site visitor, after entering the administrator's address and password in the Metamask authorization panel, has access to:

1. Creation of a new event (Add new event button).
After confirmation, a new event is created in the blockchain with the possibility of issuing tickets for the event.
The number of tickets is limited to the specified number when creating an event.
When all tickets have been sold, sell button will hide, an inscription will be displayed that all tickets have been sold.

2. Closing events (button Close event).
After confirmation, the event will go into the “closed” state, existing tickets for this event will be unavailable,
and the event will be removed from the list of events on the site.

If the event has an end time less than the current time, the ticket sales button will be disactive.


/////  Regular user  \\\\\

A regular site visitor after authorization by Metamask:

1. Can buy a ticket by clicking on the "Buy ticket to the event" button.
The buy button becomes inactive after all tickets have been sold and after the end date of the event
2. The user can transfer his ticket to another address in the "My tickets" section (as a gift, without the sale option)

*/

/*
Примечания:
1. Прослушивание событий из блокчейна не всегда срабатывает:
для ивентов сделал прослушивание события как круговорот через редюсер,
для тикетов - с помощью слушателя.
2. Начальные данные редактировать можно в файле events-api.js (src/components/API/events-api.js)

*/
