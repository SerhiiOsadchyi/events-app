import React, {useEffect, useState} from 'react';
import s from './Events.module.css';
import "antd/dist/antd.css";
import {Button, Divider} from "antd";
import Event from "./Event/Event";
import {NewEvent} from "./Event/NewEvent";
import {useDispatch, useSelector} from "react-redux";
import {getEvents} from "../../redux/events-reducer";
import Preloader from "../common/Preloader/Preloader";
import {eventProductionContract} from "../API/events-api";

const Events = React.memo(({userAddress}) => {

    const isOwner =  useSelector(state => state.userAuthorize.isOwner);
    const events = useSelector(state => state.eventsPage.events);

    //open and close table "Add new event"
    const [newEventMode, setNewEventMode] = useState(false);
    //open and close spinner while event response received from MetaMask
    const [isEventAdded, setEventEndWaiting] = useState(true);

    const dispatch = useDispatch();

    useEffect( () => {
        dispatch(getEvents());

        //addEventListener web3 for new Event
        eventProductionContract.events.NewEventAdded()
            .on('data', function(event){
                dispatch(getEvents());
                setEventEndWaiting(true)
                console.log('event');
                console.log(event); // same results as the optional callback above
            });
    },[]);

    const addEvent = () => {
        setNewEventMode(true)
    }

    //close Add new event table
    const closeNewEventMode = () => {
        setNewEventMode(false);
        setEventEndWaiting(false)
    }

    return (
        <div className={s.content}>
            <Divider orientation="left" plain><h1>List of Events</h1></Divider>
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
                                <Preloader/>
                            </div>
                        </>
                    }

                </div>
                : ''
            }

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