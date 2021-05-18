import {eventsAPI} from "../components/API/events-api";

const ADD_NEW_EVENT = 'events-reducer/ADD-NEW-EVENT';
const CLOSE_EVENT = 'events-reducer/CLOSE_EVENT';
const WAITING_FOR_ADD_EVENT = 'events-reducer/WAITING_FOR_ADD_EVENT';
const BUY_TICKET = 'events-reducer/BUY_TICKET';

const initialState = {
    events: {},
    tickets: {},
    isEventAdded: true,
}

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case WAITING_FOR_ADD_EVENT:
            return {
                ...state,
                isEventAdded: action.flag

            };
            case ADD_NEW_EVENT:
            return {
                ...state,
                events: action.events,
            };
        case CLOSE_EVENT:
            return {
                ...state,
                events: [state.events.filter(id => id !== action.eventId)]
            };
            case BUY_TICKET:
            return {
                ...state,
                events: [state.events.filter(id => id !== action.eventId)]
            };


        default:
            return state;
    }
}

export const actions = {
    eventCreationFinished: (flag) => ({type: WAITING_FOR_ADD_EVENT, flag}),
    updateEventsList: (events) => ({type: ADD_NEW_EVENT, events}),
    //closeEvent: (eventId) => ({type: CLOSE_EVENT, eventId})
}

export const addNewEvent = (value, userAddress) => async (dispatch) => {
    dispatch(actions.eventCreationFinished(false));
    await eventsAPI.addNewEvent(value, userAddress);
    const data = await eventsAPI.getEventsList();
    dispatch(actions.updateEventsList(data));
    //debugger
    dispatch(actions.eventCreationFinished(true))
};

export const getEvents = () =>  async (dispatch) => {
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

export const buyTicketAC = (eventID, ticketsPrice, userAddress) => async (dispatch) => {

    await eventsAPI.buyTicketAPI(eventID, ticketsPrice, userAddress);
    //const data = await eventsAPI.getTicketState();
    //dispatch(getEvents());
};

export default eventsReducer;
