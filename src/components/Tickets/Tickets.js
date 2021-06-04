import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getTickets} from "../../redux/events-reducer";
import {Input, Row, Col, Space, Switch, Button, Table, Divider} from "antd";
import s from './Tickets.module.css'

const Tickets = React.memo(() => {

    const userAddress = useSelector(state => state.userAuthorize.authAccount);
    //const events = useSelector(state => state.eventsPage.events);
    const tickets = useSelector(state => state.eventsPage.tickets);

    debugger
    console.log(tickets)

    const [isTableVisible, setTableVisible] = useState(true);

    const hideTable = (e) => {
        setTableVisible(e);
    }

    //const dispatch = useDispatch();

    //ticketId, eventId, eventName, price, msg.sender

    /* useEffect(() => {
         dispatch(getTickets())
     }, []);*/

    let ticketsArray = [];

    if (tickets.length > 0) {
        for (let i = 0; i < tickets.length; i++) {
            if (tickets[i].ticketOwner === userAddress) {
                ticketsArray.push(tickets[i])
            }
        }
    }

    const sendTicket = () => {
        console.log('send')
    }

    const columns = [
        {
            title: 'Event Name',
            width: 100,
            dataIndex: 'eventName',
            key: 'eventName',
        },
        {
            title: 'Ticket number',
            width: 100,
            dataIndex: 'ticketId',
            key: 'ticketId',
        },
        {
            title: 'Price',
            width: 100,
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
                <Input placeholder="Basic usage"/>
                // </Space>
            ),
        },
        {
            title: 'Confirmation',
            width: 100,
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
                                checkedChildren="See"
                                unCheckedChildren="Hide"
                                onChange={(e) => hideTable(e)}/>
                        </Col>
                    </Row>
                </div>
            </Divider>

            <div className={`${s.antTable} ${!isTableVisible && s.visibility}`}>
                <Table dataSource={ticketsArray} columns={columns} scroll={{y: 400}}/>
            </div>

        </div>

    )
});

export default Tickets;