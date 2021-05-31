import {eventsAPI} from "../components/API/events-api";

const ADD_NEW_EVENT = 'events-reducer/ADD-NEW-EVENT';
const CLOSE_EVENT = 'events-reducer/CLOSE_EVENT';
const WAITING_FOR_ADD_EVENT = 'events-reducer/WAITING_FOR_ADD_EVENT';
const BUY_TICKET = 'events-reducer/BUY_TICKET';
const TICKET_SOLD_CONFIRMED = 'events-reducer/TICKET_SOLD_CONFIRMED';

const initialState = {
    events: {},
    tickets: {},
    isEventAdded: true,
    isTransactionConfirmed: true
}

const eventsReducer = (state = initialState, action) => {
    debugger
    switch (action.type) {
        case WAITING_FOR_ADD_EVENT:
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
        case TICKET_SOLD_CONFIRMED:
            return {
                ...state,
                isTransactionConfirmed: action.flag
            };


        default:
            return state;
    }
}

export const actions = {
    eventCreationFinished: (flag) => ({type: WAITING_FOR_ADD_EVENT, flag}),
    updateEventsList: (events) => ({type: ADD_NEW_EVENT, events}),
    ticketSoldConfirmed: (flag) => ({type: TICKET_SOLD_CONFIRMED, flag}),
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
    debugger
    const data = await eventsAPI.getEventsList();
    if (data !== 'Error connect to MetaMask') {
        dispatch(actions.updateEventsList(data));
    } else return 'Error'
};

export const closeEventAC = (eventID, userAddress) => async (dispatch) => {
    await eventsAPI.closeEventAPI(eventID, userAddress);
    dispatch(getEvents())
};

export const sellTicketAC = (userAddress, eventFactoryAddress, ticketsPrice) => async (dispatch) => {
    dispatch(actions.ticketSoldConfirmed(false));
    await eventsAPI.sellTicketAPI(userAddress, eventFactoryAddress, ticketsPrice);
    dispatch(actions.ticketSoldConfirmed(true));
};

export default eventsReducer;
