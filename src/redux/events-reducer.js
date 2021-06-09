import {eventsAPI} from "../components/API/events-api";
const Web3 = require('web3');

const ADD_NEW_EVENT = 'events-reducer/ADD-NEW-EVENT';
const CLOSE_EVENT = 'events-reducer/CLOSE_EVENT';
const GET_TICKETS = 'events-reducer/GET_TICKETS';
const UPDATE_TICKETS = 'events-reducer/UPDATE_TICKETS';
const EVENT_CREATED = 'events-reducer/EVENT_CREATED';
const TICKET_OWNER_CHANGED = 'events-reducer/TICKET_OWNER_CHANGED';

const initialState = {
    events: {},
    tickets: [],
    isEventAdded: true,
    isTicketOwnerChanged: false
}

const eventsReducer = (state = initialState, action) => {

    switch (action.type) {

        case ADD_NEW_EVENT:
            return {
                ...state,
                events: action.events
            };

        case EVENT_CREATED:
            return {
                ...state,
                isEventAdded: action.flag
            };

        case TICKET_OWNER_CHANGED:
            return {
                ...state,
                isTicketOwnerChanged: action.flag
            };

        case CLOSE_EVENT:
            return {
                ...state,
                events: [state.events.filter(id => id !== action.eventId)]
            };

        case UPDATE_TICKETS:
            return {
                ...state,
                tickets: [...state.tickets
                    .filter(ticket => ticket.eventId !== action.payload.eventID), ...action.payload.ticketsArray]
            };

        default:
            return state;
    }
}

export const actions = {
    updateEventsList: (events) => ({type: ADD_NEW_EVENT, events}),
    getTickets: (ticketsArray, eventID) => ({type: GET_TICKETS, payload: {ticketsArray, eventID}}),
    updateTickets: (ticketsArray, eventID) => ({type: UPDATE_TICKETS, payload: {ticketsArray, eventID}}),
    setEventCreationStatus: (flag) => ({type: EVENT_CREATED, flag}),
    setTicketOwnerChangedStatus: (flag) => ({type: TICKET_OWNER_CHANGED, flag}),
}

export const addNewEvent = (value, userAddress) => async (dispatch) => {
    //start preloader
    dispatch(actions.setEventCreationStatus(false));

    await eventsAPI.addNewEvent(value, userAddress);
    await getEvents();

    //stop preloader
    dispatch(actions.setEventCreationStatus(true))
};

export const getEvents = () => async (dispatch) => {
    const data = await eventsAPI.getEventsList();
    if (data !== 'Error connect to MetaMask') {
        dispatch(actions.updateEventsList(data));
    } else return 'Error'
};

export const closeEventAC = (eventID, userAddress) => async (dispatch) => {
    await eventsAPI.closeEventAPI(eventID, userAddress);
    dispatch(getEvents())
};

export const sellTicketAC = (userAddress, ticketsContractAddress, eventID, ticketsPrice) => async (dispatch) => {
    await eventsAPI.sellTicketAPI(userAddress, ticketsContractAddress, ticketsPrice);
};

export const updateTicketsAC = (ticketsContractAddress, eventID) => async (dispatch) => {
    let newTickets = await eventsAPI.getTicketsAPI(ticketsContractAddress);
    newTickets = toArrayTickets(newTickets);
    dispatch(actions.updateTickets(newTickets, eventID));
};

export const changeTicketOwnerAC = (ticketId, ticketPrice, eventId, ticketNewOwner, ticketsContractAddress, userAddress) => async (dispatch) => {
    dispatch(actions.setTicketOwnerChangedStatus(true))
    await eventsAPI.changeTicketOwnerAPI(ticketId, ticketPrice, ticketNewOwner, ticketsContractAddress, userAddress);
    updateTicketsAC(ticketsContractAddress, eventId);
    dispatch(actions.setTicketOwnerChangedStatus(false))
};

//convert tickets data to array
const toArrayTickets = (ticketsData) => {
    let ticketsArr = [];

    for (let i = 0; i < ticketsData.length; i++) {
        //convert wei to ether
        const ticketsPrice = Web3.utils.fromWei(ticketsData[i].ticketPrice, 'ether');

        const ticket = {
            ticketId: ticketsData[i].id,
            eventId: ticketsData[i].eventId,
            eventName: ticketsData[i].eventName,
            ticketPrice: ticketsPrice,
            ticketOwner: ticketsData[i].ticketOwner
        }

        ticketsArr.push(ticket)
    }

    return ticketsArr
}

export default eventsReducer;
