import React, {useContext, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Divider, Popconfirm, Input, Row, Form, Switch, Table} from "antd";
import s from './Tickets.module.css'
import {changeTicketOwnerAC, updateTicketsAC} from "../../redux/events-reducer";
import {TicketsFactory, web3} from "../API/events-api";

const Tickets = React.memo(() => {

    const userAddress = useSelector(state => state.userAuthorize.authAccount);
    const events = useSelector(state => state.eventsPage.events);
    const tickets = useSelector(state => state.eventsPage.tickets);
    const isTicketOwnerChanged = useSelector(state => state.eventsPage.isTicketOwnerChanged);
    const dispatch = useDispatch();
    debugger
    const [isTableVisible, setTableVisible] = useState(false);
    const [ticketsSentContractAddress, setTicketsContractAddress] = useState();
    const [ticketsSentEventID, setTicketsSentEventID] = useState(false);

    useEffect(() => {
        if(ticketsSentContractAddress) {
            const ticketsContract = new web3.eth.Contract(TicketsFactory.abi, ticketsSentContractAddress);
            ticketsContract.events.Transfer()
                .on('data', function (e) {
                    dispatch(updateTicketsAC(ticketsSentContractAddress, ticketsSentEventID));
                });
        }

    }, [isTicketOwnerChanged]);

    let ticketsForUserArray = [];
    let actualTickets = [];

    const closedEventId = events.filter(item => item.isLocked === true);

    console.log(tickets);

    // Remove tickets from closed events
    if (closedEventId.length === 0) {
        actualTickets = tickets
    } else {
        for (let i = 0; i < closedEventId.length; i++) {
            actualTickets = tickets.filter(ticket => ticket.eventId !== closedEventId.eventID)
        }
    }

    const hideTable = (e) => {
        setTableVisible(e);
    }

    //choice tickets from user only and sort these by event name
    if (actualTickets.length > 0) {
        for (let i = 0; i < actualTickets.length; i++) {
            if (actualTickets[i].ticketOwner === userAddress) {
                actualTickets[i].newOwnerAddress = '';
                ticketsForUserArray.push(actualTickets[i])
            }
        }
        const compareEventId = (a, b) => {
            const first = a.eventId;
            const second = b.eventId;

            let result = 0;
            if (first > second) {
                result = 1;
            } else if (first < second) {
                result = -1;
            }
            return result;
        }
        tickets.sort(compareEventId)
    }

    const getInput = (e, record) => {
        let newOwnerAddress = e.target.value;
        ticketsForUserArray.map(ticket => {
            if (ticket.eventId === record.eventId && ticket.ticketId === record.ticketId) {
                ticket.newOwnerAddress = newOwnerAddress;
                return ticket
            }
            return ticket
        });
        return newOwnerAddress;
    };

    const sendTicket = (value) => {
        const {eventId, eventName, newOwnerAddress, ticketId, ticketOwner, ticketPrice} = value;
        if(web3.utils.isAddress(newOwnerAddress)) {
            const thisEvent = events.filter(eventItem => eventItem.eventID === eventId);
            const ticketsContractAddress = thisEvent[0].ticketsContractAddress;
            setTicketsContractAddress(ticketsContractAddress);
            setTicketsSentEventID(eventId);
            dispatch(changeTicketOwnerAC(ticketId, ticketPrice, eventId, newOwnerAddress, ticketsContractAddress, userAddress));
        }
    }

    // data for antD table
    const {Column} = Table;

    return (
        <div className={s.content}>

            <Divider orientation="left" plain>
                <div className={s.buttonMyTicket}>
                    <Row>
                        <Col span={12}>
                            <h2> My tickets </h2>
                        </Col>
                        <Col span={12}>
                            <Switch
                                checkedChildren="Visible"
                                unCheckedChildren="Hide"
                                onChange={(e) => hideTable(e)}/>
                        </Col>
                    </Row>
                </div>
            </Divider>

            <div className={`${s.tableLayout} ${!isTableVisible && s.visibility}`}>
                {ticketsForUserArray.length > 0 ?
                    <Table dataSource={ticketsForUserArray}>
                        <Column title='Event Name' width='200' dataIndex='eventName' key='eventName'/>
                        <Column title='Ticket ID' width='80' dataIndex='ticketId' key='ticketId'/>
                        <Column title='Price, ether' width='200' dataIndex='ticketPrice' key='ticketPrice'/>
                        <Column
                            title='New owners address'
                            width='200'
                            dataIndex='newOwnerAddress'
                            key='newOwnerAddress'
                            render={(text, record) => (<Input
                                    placeholder="Please, insert new owner address"
                                    onChange={(e) => {
                                        console.log('record ' + record)
                                        getInput(e, record);
                                    }}

                                />
                            )}
                        />
                        <Column
                            title='Confirmation'
                            width='120'
                            float='left'
                            dataIndex='button'
                            key='button'
                            render={(text, record) => (
                                <Button onClick={() => sendTicket(record)} disabled={isTicketOwnerChanged}>Send
                                    ticket</Button>
                            )}
                        />
                    </Table>
                    : <h4>I haven't any tickets</h4>
                }
            </div>

        </div>
    )

});

export default Tickets;
