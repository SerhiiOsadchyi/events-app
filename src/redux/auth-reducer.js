import {eventsAPI, ownerAddress} from "../components/API/events-api";

const LOGIN = 'auth-reducer/LOGIN';

const initialState = {
    isAuth: false,
    authAccount: '',
    isOwner: false,
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                isAuth: true,
                authAccount: action.payload.account,
                isOwner: action.payload.isOwner,
            };
        default:
            return state;
    }
}

export const actions = {
    login: (account, isOwner, ownerAddress) => ({type: LOGIN, payload: {account, isOwner} }),
}

export const setAccount = () => async (dispatch) => {
    const accounts = await eventsAPI.auth();

    if(!accounts){
        return console.log('Something is wrong. Please, try to connect again')
    }

    const account = accounts[0];
    let isOwner = false;

    if(account === ownerAddress){
        isOwner = true
    }

    dispatch(actions.login(account, isOwner, ownerAddress))
}

export default authReducer;