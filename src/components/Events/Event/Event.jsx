import React, {useEffect, useState} from 'react';
import {Button, Divider} from "antd";
import s from './Event.module.css'
import {useDispatch, useSelector} from "react-redux";
import {sellTicketAC, closeEventAC, getEvents, getTickets} from "../../../redux/events-reducer";
import Preloader from "../../common/Preloader/Preloader";
import {eventsAPI, TicketsFactory, web3} from "../../API/events-api";

const Event = React.memo(({event, userAddress}) => {

    const dispatch = useDispatch();
    //const userAddress = useSelector(state => state.userAuthorize.authAccount);
    const isOwner = useSelector(state => state.userAuthorize.isOwner);
    const tickets = useSelector(state => state.eventsPage.tickets);
    const ticketsContract = new web3.eth.Contract(TicketsFactory.abi, event.ticketsContractAddress);
    const isTransactionConfirmed = useSelector(state => state.eventsPage.isTransactionConfirmed);

    useEffect( () => {
        dispatch(getTickets(event.ticketsContractAddress, event.eventID));
        ticketsContract.events.NewTicketCreated()
            .on('data', function(event){
                console.log(event); // same results as the optional callback above
            });
    },[]);

    const [isClose, setIsClose] = useState(event.isLocked);
    const [isTransactionSent, setTransactionStatus] = useState(false);

    let ticketsRest = event.ticketsTotal;
    if (tickets[event.eventID] && tickets[event.eventID].length) {
        ticketsRest = event.ticketsTotal - tickets[event.eventID].length;
    }

    const convertMillisecondsToDate = (date) => {
        let d = new Date(Number(date));
        return d.toDateString();
    }

    console.log(event.isLocked);
    const closeEvent = () => {
        dispatch(closeEventAC(event.eventID, userAddress));
        setIsClose(true)
    }

    const buyTicket = () => {
        dispatch(sellTicketAC(userAddress, event.ticketsContractAddress, event.eventID, event.ticketsPrice));
        setTransactionStatus(true)
    }

    if(isTransactionConfirmed && isTransactionSent) {
        setTransactionStatus(false)
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
                        <>
                            {isTransactionSent ?
                                    <>
                                        <Button onClick={buyTicket} disabled> Buy ticket to the event</Button>
                                        <h4>Please, waiting for confirm this transaction</h4>
                                        <div className={s.preloader}>
                                            <Preloader/>
                                        </div>
                                    </>
                                    : <Button onClick={buyTicket}> Buy ticket to the event</Button>
                            }
                        </>
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