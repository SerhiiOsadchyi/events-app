// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/utils/Counters.sol";
import "./Tickets.sol";

pragma solidity >=0.6.2 <0.9.0;
pragma experimental ABIEncoderV2;

contract EventsFactory {

    using Counters for Counters.Counter;
    Counters.Counter private _eventsID;

    event NewEventAdded(uint indexed eventID);

    address payable public owner;

    struct Event {
        uint eventID;
        address eventFactoryAddress;
        string name;
        string description;
        string location;
        string imageURL;
        uint ticketsPrice;
        uint ticketsTotal;
        uint startDate;
        uint endDate;
        bool isLocked;
    }

    Event[] public events;

    mapping(uint => TicketsFactory) public ticketsForEvents;

    constructor() public {
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    modifier onLockEvent(uint _eventID) {
        require(events[_eventID].isLocked);
        _;
    }

    function addEvent(
        string memory _name,
        string memory _description,
        string memory _location,
        string memory _imageURL,
        uint _ticketsTotal,
        uint _ticketsPrice,
        uint _startDate,
        uint _endDate
    ) public onlyOwner {
        _eventsID.increment();
        uint eventID = _eventsID.current();
        address eventFactoryAddress = address(this);

        TicketsFactory _ticketsForEvent = new TicketsFactory(owner, eventFactoryAddress, eventID, _name,
            _ticketsPrice, _ticketsTotal);

        ticketsForEvents[eventID] =  _ticketsForEvent;

        Event memory newEvent = Event(eventID, address(_ticketsForEvent), _name, _description, _location,
            _imageURL, _ticketsTotal, _ticketsPrice, _startDate, _endDate, false);

        events.push(newEvent);
        emit NewEventAdded(eventID);
    }

    function closeEvent(uint _id) public onlyOwner {
        events[_id].isLocked = true;
    }

    function eventsList() public view returns (Event[] memory){
        return events;
    }

    function eventsCount() public view returns (uint){
        return events.length;
    }

}
