import React, {useEffect, useState} from 'react';
import s from './Events.module.css';
import "antd/dist/antd.css";
import {Button, Divider} from "antd";
import Event from "./Event/Event";
import {NewEvent} from "./Event/NewEvent";
import {useDispatch, useSelector} from "react-redux";
import {getEvents} from "../../redux/events-reducer";
import Preloader from "../common/Preloader/Preloader";

const Events = React.memo((userAddress) => {

//    const stateView = useSelector(state => state.eventsPage);
    //const userAddress = useSelector(state => state.userAuthorize.authAccount);
    const isOwner =  useSelector(state => state.userAuthorize.isOwner);
    const events = useSelector(state => state.eventsPage.events);
    const isEventAdded = useSelector(state => state.eventsPage.isEventAdded);

    const [newEventMode, setNewEventMode] = useState(false);

//debugger
//    console.log(stateView)

    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(getEvents())
    },[]);

    const addEvent = () => {
        setNewEventMode(true)
    }

    const closeNewEventMode = () => {
        setNewEventMode(false)
    }

    return (
        <div className={s.content}>
            {isOwner ?
                <div>

                    {isEventAdded ?
                        newEventMode ?
                            <NewEvent
                                closeNewEventMode={closeNewEventMode}
                                userAddress={userAddress}
                            />
                            : <div className={s.formContent}>
                                <Button onClick={addEvent}>Add new event</Button>
                            </div>
                        : <>
                            <h3> Please, waiting for confirm transaction by MetaMask </h3>
                            <div className={s.preloader}>
                                <Preloader />
                            </div>
                          </>
                    }

                </div>
                : ''
            }

            <Divider orientation="left" plain><h1>List of Events</h1></Divider>
            {events.length > 0 ?
                <div className={s.formContent}>
                    {events.map((event) => {
                        if (!event.isLocked) {
                            return <div><Event event={event} key={event.eventID} userAddress={userAddress} /></div>
                        }
                        return null
                    })}
                </div>
                : userAddress ? ''
                        : <h2>Please, connect to Metamask</h2>
            }

        </div>
    )
});

export default Events;