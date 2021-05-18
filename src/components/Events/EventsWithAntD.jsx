import React, {useState} from 'react';
import s from './Events.module.css';
import EventContainer from "./Event/EventContainer";
import {Formik, useFormik} from 'formik';
import "antd/dist/antd.css";
import {Form, Input, Button} from 'antd';

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
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
                <NewEventWithAntD closeNewEventMode={closeNewEventMode}/>
                : <button onClick={addEvent}>Add new event</button>}

            <h1>Events</h1>

            <div>
                <EventContainer/>
            </div>
        </>
    )
});

const NewEventWithAntD = ({closeNewEventMode}) => {
    const formik = useFormik({
        initialValues: {
            eventName: '', description: '', location: '', amount: '', price: '', startDate: '',
            endDate: ''
        },
        /* onSubmit: (values) => {
             alert(JSON.stringify(values, null, 2));
         },*/
        onSubmit: (values) => {
            setTimeout(() => {
                closeNewEventMode();
                alert(JSON.stringify(values, null, 2));
            }, 400);
        }

    });
    return (<>
        <h1>Add new event</h1>
        {({isSubmitting}) => (<Form onSubmit={formik.handleSubmit} labelCol={{span: 4}}
              wrapperCol={{span: 14}}
              layout="horizontal">

            <Form.Item label="Event name"
                       name="eventName"
                       placeholder="Event name"
                       type="textarea"
                       value={formik.values.eventName}
                       onChange={formik.handleChange}
                       >
                <Input/>
            </Form.Item>
            <Form.Item label="Event description"
                       name="description"
                       placeholder="Event description"
                       value={formik.values.description}
                       onChange={formik.handleChange}>
                <Input/>
            </Form.Item>

            <Button color="primary" htmlType="submit"  disabled={isSubmitting}>
                Submit
            </Button>
        </Form>)}
    </>);
};


{/*const NewEvent = ({closeNewEventMode}) => {


    return (

                {({isSubmitting}) => (
                    <Form>
                        <div>
                            <label htmlFor="eventName">Event name</label>
                            <Field name="eventName" placeholder="Event name"/>
                            <ErrorMessage name="eventName" component="div"/>
                        </div>

                        <div>
                            <label htmlFor="description">Event description</label>
                            <Field type="textarea" name="description" component="textarea"/>
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
                            <button className="ant-btn ant-btn-primary" type="submit" disabled={isSubmitting}>Submit
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
};*/
}


export default Events;