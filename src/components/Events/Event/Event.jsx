import React, {useState} from 'react';
import {Button, Divider} from "antd";
import s from './Event.module.css'
import {useDispatch, useSelector} from "react-redux";
import {sellTicketAC, closeEventAC} from "../../../redux/events-reducer";
import Preloader from "../../common/Preloader/Preloader";

const Event = React.memo(({event}) => {

    const dispatch = useDispatch();
    const userAddress = useSelector(state => state.userAuthorize.authAccount);
    const isOwner = useSelector(state => state.userAuthorize.isOwner);
    const tickets = useSelector(state => state.eventsPage.tickets);
    const [isClose, setIsClose] = useState(event.isLocked)

    let ticketsRest = event.ticketsTotal;
    if (tickets[event.eventID] && tickets[event.eventID].length) {
        ticketsRest = event.ticketsTotal - tickets[event.eventID].length;
    }

    const convertMillisecondsToDate = (date) => {
        debugger
        let d = new Date(Number(date));
        return d.toDateString();
    }

    console.log(event.isLocked);
    const closeEvent = () => {
        dispatch(closeEventAC(event.eventID, userAddress));
        setIsClose(true)
    }

    const buyTicket = () => {
        dispatch(sellTicketAC( userAddress, event.name, event.eventID, event.ticketsPrice, event.ticketsTotal ));
    }

    return (
        <div className={s.event}>
            <Divider><h2>{event.name}</h2></Divider>
            <div className={s.content}>
                <div className={s.poster}>
                    <img src={event.imageURL || 'https://www.desertspoonfoodhub.org/wp-content/uploads/2018/03/2-4.png'}
                         alt="image"/>
                </div>
                <div className={s.list}>
                    <div className={s.item}>
                        <div> Description:</div>
                        <div> {event.description}</div>
                    </div>
                    <div className={s.item}>
                        <div> Location:</div>
                        <div> {event.location}</div>
                    </div>
                    <div className={s.item}>
                        <div> Tickets left:</div>
                        <div> {ticketsRest}</div>
                    </div>
                    <div className={s.item}>
                        <div> Ticket price, wei:</div>
                        <div> {event.ticketsPrice}</div>
                    </div>
                    <div className={s.item}>
                        <div> Event start date:</div>
                        <div> {convertMillisecondsToDate(event.startDate)}</div>
                    </div>
                    <div className={s.item}>
                        <div> Event end date:</div>
                        <div> {convertMillisecondsToDate(event.endDate)}</div>
                    </div>
                    {isOwner ? <div className={s.closeButton}>
                            <Button onClick={closeEvent}> Close event</Button>
                        </div>
                        : ''
                    }
                    {isClose ? <div className={s.preloader}>
                        <Preloader/>
                    </div> : null
                    }

                </div>
            </div>
            {ticketsRest > 0 ?
                <div className={s.payTicket}>
                    {userAddress ?
                        <Button onClick={buyTicket}> Buy ticket to the event</Button>
                        : <>
                            <h4>Please, authorize by MetaMask</h4>
                            <Button disabled onClick={buyTicket}> Buy ticket to the event</Button>
                        </>
                    }
                </div>
                : <h2> All tickets sold </h2>
            }

        </div>

    )

});

export default Event;