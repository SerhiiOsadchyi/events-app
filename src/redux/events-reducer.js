import {eventsAPI} from "../components/API/events-api";

const ADD_NEW_EVENT = 'events-reducer/ADD-NEW-EVENT';
const CLOSE_EVENT = 'events-reducer/CLOSE_EVENT';
const WAITING_FOR_ADD_EVENT = 'events-reducer/WAITING_FOR_ADD_EVENT';
const WAITING_FOR_TICKET_SOLD = 'events-reducer/WAITING_FOR_TICKET_SOLD';
const TICKET_SOLD = 'events-reducer/TICKET_SOLD_CONFIRMED';
const UPDATE_TICKETS = 'events-reducer/UPDATE_TICKETS';

const initialState = {
    events: {},
    tickets: [],
    isEventAdded: true,
    isTransactionConfirmed: true
}

const eventsReducer = (state = initialState, action) => {

    switch (action.type) {
        case WAITING_FOR_ADD_EVENT:
            debugger
            return {
                ...state,
                isEventAdded: action.flag

            };
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
        case WAITING_FOR_TICKET_SOLD:
            return {
                ...state,
                isEventAdded: action.flag
            };
        /*case TICKET_SOLD:
            return {
                ...state,
                tickets: action.tickets
            };*/
        case UPDATE_TICKETS:
            const ticketsArr = [];
            for (let i = 0; i < action.tickets.length; i++) {
                const ticket = {
                    ticketId: action.tickets[i].id,
                    eventId: action.tickets[i].eventId,
                    eventName: action.tickets[i].eventName,
                    ticketPrice: action.tickets[i].ticketPrice,
                    ticketOwner: action.tickets[i].ticketOwner
                }
                ticketsArr.push(ticket)
            }
            return {
                ...state,
                tickets: [...state.tickets, ...ticketsArr]
            };

        default:
            return state;
    }
}

export const actions = {
    eventCreationFinished: (flag) => ({type: WAITING_FOR_ADD_EVENT, flag}),
    updateEventsList: (events) => ({type: ADD_NEW_EVENT, events}),
    ticketSoldConfirmed: (flag) => ({type: WAITING_FOR_TICKET_SOLD, flag}),
    //ticketSold: (tickets) => ({type: TICKET_SOLD, tickets}),
    updateTickets: (tickets) => ({ type: UPDATE_TICKETS, tickets }),
    //closeEvent: (eventId) => ({type: CLOSE_EVENT, eventId})
}

export const addNewEvent = (value, userAddress) => async (dispatch) => {
    dispatch(actions.eventCreationFinished(false));
    await eventsAPI.addNewEvent(value, userAddress);
    const data = await eventsAPI.getEventsList();
    dispatch(actions.updateEventsList(data));
    dispatch(actions.eventCreationFinished(true))
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
    dispatch(actions.ticketSoldConfirmed(false));
    await eventsAPI.sellTicketAPI(userAddress, ticketsContractAddress, ticketsPrice);
    getTickets(ticketsContractAddress, eventID);
    dispatch(actions.ticketSoldConfirmed(true));
};

export const getTickets = (ticketsContractAddress, eventID) => async (dispatch) => {
    const tickets = await eventsAPI.getTicketsAPI(ticketsContractAddress);
    dispatch(actions.updateTickets(tickets));
};

export default eventsReducer;
