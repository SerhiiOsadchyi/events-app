import React, {useEffect, useState} from 'react';
import {Button, Divider} from "antd";
import s from './Event.module.css'
import {useDispatch, useSelector} from "react-redux";
import {
    sellTicketAC,
    closeEventAC,
    getTicketsAC,
    updateTicketsAC
} from "../../../redux/events-reducer";
import Preloader from "../../common/Preloader/Preloader";
import {eventsAPI, TicketsFactory, web3} from "../../API/events-api";
import Web3 from "web3";

const Event = React.memo(({event, userAddress}) => {

    const dispatch = useDispatch();
    const isOwner = useSelector(state => state.userAuthorize.isOwner);
    const tickets = useSelector(state => state.eventsPage.tickets);
    const ticketsContract = new web3.eth.Contract(TicketsFactory.abi, event.ticketsContractAddress);

    useEffect(() => {
        dispatch(updateTicketsAC(event.ticketsContractAddress, event.eventID));
        ticketsContract.events.NewTicketCreated()
            .on('data', function (e) {
                dispatch(updateTicketsAC(event.ticketsContractAddress, event.eventID));
                setTransactionStatus(false)
            });
    }, []);

    const [isClose, setIsClose] = useState(event.isLocked);
    const [isTransactionSent, setTransactionStatus] = useState(false);

    let ticketsRest = event.ticketsTotal;
    let ticketsEvent = tickets.filter(ticket => ticket.eventId === event.eventID)

    // If tickets for this event exist, calculate tickets rest
    if (tickets[event.eventID]) {
        //debugger
        ticketsRest = +event.ticketsTotal - ticketsEvent.length;
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

    const ticketsPrice = Web3.utils.fromWei(event.ticketsPrice, 'ether');

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
                        <div> Ticket price, Ether:</div>
                        <div> {ticketsPrice}</div>
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
                            <Button onClick={buyTicket}
                                    disabled={isTransactionSent || (Date.now() - event.endDate > 0)}
                            > Buy ticket to the event</Button>
                        </>
                        : <>
                            <h4>Please, authorize by MetaMask</h4>
                            <Button disabled onClick={buyTicket}> Buy ticket to the event</Button>
                        </>
                    }
                </div>
                : <div className={s.ticketsSold}>
                    <h4> All tickets sold </h4>
                </div>
            }

        </div>

    )

});

export default Event;