import {eventsAPI} from "../components/API/events-api";
import Web3 from "web3";

const ADD_NEW_EVENT = 'events-reducer/ADD-NEW-EVENT';
const CLOSE_EVENT = 'events-reducer/CLOSE_EVENT';
const GET_TICKETS = 'events-reducer/GET_TICKETS';
const UPDATE_TICKETS = 'events-reducer/UPDATE_TICKETS';

const initialState = {
    events: {},
    tickets: [],
}

const eventsReducer = (state = initialState, action) => {

    switch (action.type) {

        case ADD_NEW_EVENT:
            return {
                ...state,
                events: action.events
            };

        case CLOSE_EVENT:
            return {
                ...state,
                events: [state.events.filter(id => id !== action.eventId)]
            };

        case UPDATE_TICKETS:
            return {
                ...state,
                tickets: [...state.tickets.filter(ticket => ticket.eventId !== action.payload.eventID), ...action.payload.ticketsArray]
            };

        default:
            return state;
    }
}

export const actions = {
    updateEventsList: (events) => ({type: ADD_NEW_EVENT, events}),
    getTickets: (ticketsArray, eventID) => ({type: GET_TICKETS, payload: {ticketsArray, eventID}}),
    updateTickets: (ticketsArray, eventID) => ({type: UPDATE_TICKETS, payload: {ticketsArray, eventID}}),
}

export const addNewEvent = (value, userAddress) => async (dispatch) => {
    await eventsAPI.addNewEvent(value, userAddress);
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
