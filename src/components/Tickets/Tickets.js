import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getTickets} from "../../redux/events-reducer";
import {Input, Row, Col, Space, Switch, Button, Table, Divider} from "antd";
import s from './Tickets.module.css'

const Tickets = React.memo(() => {

    const userAddress = useSelector(state => state.userAuthorize.authAccount);
    const events = useSelector(state => state.eventsPage.events);
    const tickets = useSelector(state => state.eventsPage.tickets);

    //debugger
    console.log(tickets);

    const closedEventId = events.filter(item => item.isLocked === true);

    // Remove tickets from closed events
    let actualTickets = [];

    if (closedEventId.length === 0) {
        actualTickets = tickets
    } else {
        for (let i = 0;  i < closedEventId.length; i++) {
            actualTickets = tickets.filter(ticket => ticket.eventId !== closedEventId.eventID)
        }
    }


    const [isTableVisible, setTableVisible] = useState(false);

    const hideTable = (e) => {
        setTableVisible(e);
    }

    let ticketsForUserArray = [];
debugger
    if (actualTickets.length > 0) {
        for (let i = 0; i < actualTickets.length; i++) {
            if (actualTickets[i].ticketOwner === userAddress) {
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

    const sendTicket = () => {
        console.log('send')
    }

    const columns = [
        {
            title: 'Event Name',
            width: 200,
            dataIndex: 'eventName',
            key: 'eventName',
        },
        {
            title: 'Ticket ID',
            width: 80,
            dataIndex: 'ticketId',
            key: 'ticketId',
        },
        {
            title: 'Price, ether',
            width: 200,
            dataIndex: 'ticketPrice',
            key: 'ticketPrice',
        },
        {
            title: 'New owners address',
            width: 200,
            dataIndex: 'ticketOwner',
            key: 'ticketOwner',
            render: () => (
                // <Space size="middle">
                <Input placeholder="Insert new owner address"/>
                // </Space>
            ),
        },
        {
            title: 'Confirmation',
            width: 120,
            float: 'left',
            dataIndex: 'button',
            key: 'button',
            render: () => (
                // <Space size="middle">
                <Button onClick={sendTicket}>Send ticket</Button>
                // </Space>
            ),
        }

    ];

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
                <Table dataSource={ticketsForUserArray} columns={columns} scroll={{y: 400}}/>
            </div>

        </div>

    )
});

export default Tickets;