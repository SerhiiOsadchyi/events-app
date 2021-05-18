import React, {useState} from 'react';
import s from './Events.module.css';
import EventContainer from "./Event/EventContainer";
import {Formik, Field, ErrorMessage, Form} from 'formik';
import "antd/dist/antd.css";
import { Button } from 'antd';
//import {Form} from "formik-antd";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const Events = React.memo(() => {
    const [newEventMode, setNewEventMode] = useState(false);
    debugger;
    const addEvent = () => {
        setNewEventMode(true)
    }

    const closeNewEventMode = () => {
        setNewEventMode(false)
    }

    return (<>
            {newEventMode ?
                <NewEvent closeNewEventMode={closeNewEventMode}/>
                : <button onClick={addEvent}>Add new event</button>}

            <h1>Events</h1>

            <div>
                <EventContainer/>
            </div>
        </>
    )
});

const NewEvent = ({closeNewEventMode}) => {


    return (<div>
            <h1>Add new event</h1>
            <Formik
                initialValues={{
                    eventName: '', description: '', location: '', amount: '', price: '', startDate: '',
                    endDate: ''
                }}

                onSubmit={(values, {setSubmitting}) => {
                    setTimeout(() => {
                        closeNewEventMode();
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 400);
                }}
            >
                {({isSubmitting}) => (
                    <Form>
                        <div>
                            <label htmlFor="eventName">Event name</label>
                            <Field name="eventName" placeholder="Event name"/>
                            <ErrorMessage name="eventName" component="div"/>
                        </div>

                        <div>
                            <label htmlFor="description">Event description</label>
                            <Field type="textarea" name="description"  component="textarea"/>
                            <ErrorMessage name="description" component="div"/>
                        </div>

                        <div>
                             <label htmlFor="location">Event location</label>
                            <Field name="location" placeholder="location"/>
                            <ErrorMessage name="location" component="div"/>
                        </div>

                        <div>
                            <label htmlFor="amount">Tickets amount</label>
                            <Field type="number" name="amount"/>
                            <ErrorMessage name="amount" component="div"/>
                        </div>

                        <div>
                            <label htmlFor="price">Ticket price</label>
                            <Field type="number" name="price"/>
                            <ErrorMessage name="price" component="div"/>
                        </div>

                        <div>
                            <label htmlFor="startDate">Event's first day</label>
                            <Field type="datetime-local" name="startDate"/>
                            <ErrorMessage name="startDate" component="div"/>
                        </div>

                        <div>
                            <label htmlFor="endDate">Event's last day</label>
                            <Field type="datetime-local" name="endDate"/>
                            <ErrorMessage name="endDate" component="div"/>
                        </div>

                        <div>
                            <button  className="ant-btn ant-btn-primary" type="submit" disabled={isSubmitting}>Submit</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
};


export default Events;