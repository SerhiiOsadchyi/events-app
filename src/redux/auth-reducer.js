import {eventsAPI, ownerAddress} from "../components/API/events-api";

const LOGIN = 'auth-reducer/LOGIN';

//export const defaultAddress0x40 = '0x0000000000000000000000000000000000000000';

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
    const account = accounts[0];
    let isOwner = false;
    if(account === ownerAddress){
        isOwner = true
    }
    debugger
    dispatch(actions.login(account, isOwner, ownerAddress))
}

export default authReducer;