import {Divider} from "antd";
import {Field as FormikField, Form as FormikForm, Formik} from "formik";
import s from "../Events.module.css";
import {DatePicker} from "formik-antd";
import moment from 'moment';
import React from "react";
import {useDispatch} from "react-redux";
import {addNewEvent} from "../../../redux/events-reducer";

const { RangePicker } = DatePicker;

export const NewEvent = ({closeNewEventMode, userAddress}) => {

    const dateFormat = 'YYYY/MM/DD';
    const dispatch = useDispatch();
    debugger

    const validatorValue = (errorField, value) => {
        let error;
        if (!value) {
            error = errorField;
        }
        return error;
    }

    const validatorValueAndInteger = (errorField, value) => {
        let error;
        if (!value) {
            error = errorField;
        } else if (!Number.isInteger(value) ) {
            //debugger
            error = 'Please, insert integer';
        }
        return error;
    }

    const eventNameValidate = (value) => {
        return validatorValue('Please, add name for this event', value)
    }
    const descriptionValidate = (value) => {
        return validatorValue('Please, fill description of this event', value)
    }
    const locationValidate = (value) => {
        return validatorValue('Please, give me location of this event', value)
    }

    const amountValidate = (value) => {
        return validatorValueAndInteger('Please, give me total supply tickets for this event', value)
    }

    const priceValidate = (value) => {
        return validatorValueAndInteger('Please, insert ticket\'s price', value)
    }

    const rangeDateValidate = (value) => {
        let error;
        if (value.length === 0) {
            error = 'Please, choice start and end dates of this event';
        }
        return error;
    }

    return (
        <>
            <Divider>Add new event</Divider>
            <Formik
                initialValues={{
                    eventName: '', description: '', location: '', image: '', amount: '', price: '', rangeDate: []
                }}

                onSubmit={(values, {setSubmitting},) => {
                    values.startDate = Date.parse(moment(values.rangeDate[0]).format('YYYY-MM-DD'));
                    values.endDate = Date.parse(moment(values.rangeDate[1]).format('YYYY-MM-DD'));
                    dispatch(addNewEvent(values, userAddress));
                    closeNewEventMode();
                    setTimeout(() => {
                        setSubmitting(false);
                    }, 400);

                }}
            >
                {({errors, touched, validateField, validateForm, isSubmitting}) => (
                    <FormikForm>
                        <div className={s.field}>
                            <div>
                                <label htmlFor="eventName">Event name</label>
                            </div>
                            <div>
                                <FormikField name="eventName" placeholder="Event name" validate={eventNameValidate}/>
                                {errors.eventName && touched.eventName &&
                                <div className={s.error}>{errors.eventName}</div>}
                            </div>
                        </div>

                        <div className={s.field}>
                            <div>
                                <label htmlFor="description">Event description</label>
                            </div>
                            <div>
                                <FormikField type="textarea" name="description" placeholder="Event description"
                                             component="textarea" validate={descriptionValidate}/>
                                {errors.description && touched.description &&
                                <div className={s.error}>{errors.description}</div>}
                            </div>
                        </div>

                        <div className={s.field}>
                            <div>
                                <label htmlFor="location">Event location</label>
                            </div>
                            <div>
                                <FormikField name="location" placeholder="location" validate={locationValidate}/>
                                {errors.location && touched.location &&
                                <div className={s.error}>{errors.location}</div>}
                            </div>
                        </div>

                        <div className={s.field}>
                            <div>
                                <label htmlFor="image">URL for image</label>
                            </div>
                            <div>
                                <FormikField type="url" name="image" placeholder="URL for image" />
                                {errors.image && touched.image && <div className={s.error}>{errors.image}</div>}
                            </div>
                        </div>

                        <div className={s.field}>
                            <div>
                                <label htmlFor="price">Ticket price, wei</label>
                            </div>
                            <div>
                                <FormikField type="number" name="price" validate={priceValidate}/>
                                {errors.price && touched.price && <div className={s.error}>{errors.price}</div>}
                            </div>
                        </div>

                        <div className={s.field}>
                            <div>
                                <label htmlFor="amount">Tickets amount</label>
                            </div>
                            <div>
                                <FormikField type="number" name="amount" validate={amountValidate}/>
                                {errors.amount && touched.amount && <div className={s.error}>{errors.amount}</div>}
                            </div>
                        </div>

                        <div className={s.field}>
                            <div>
                                <label htmlFor="rangeDate">Event's duration</label>
                            </div>
                            <div>
                                <RangePicker name="rangeDate" validate={rangeDateValidate} format={dateFormat} />
                                {errors.rangeDate && touched.rangeDate &&
                                <div className={s.error}>{errors.rangeDate}</div>}
                            </div>
                        </div>

                        <div>
                            <button className={`ant-btn ant-btn-primary ${s.submitButton}`} type="submit" disabled={isSubmitting}>Submit
                            </button>
                        </div>
                    </FormikForm>
                )}
            </Formik>
        </>
    )
};


/* const eventNameValidate = (value) => {
        let error;
        if (!value) {
            error = 'Please, add name for this event';
        }
        return error;
    }*/

/*const descriptionValidate = (value) => {
    debugger
    let error;
    if (!value) {
        error = 'Please, fill description of this event';
    }
    return error;
}*/

/*const locationValidate = (value) => {
    let error;
    if (!value) {
        error = 'Please, give me location of this event';
    }
    return error;
}*/

/*const imageValidate = (value) => {
    let error;
    if (!value) {
        error = 'Please, insert url of a poster for this event';
    }
    return error;
}*/

/*const amountValidate = (value) => {
    let error;
    if (!value) {
        error = 'Please, give me total supply tickets for this event';
    }
    return error;
}*/

/* const priceValidate = (value) => {
     let error;
     if (!value) {
         error = 'Please, insert ticket\'s price';
     }
     return error;
 }*/


/*   const startDateValidate = (value) => {
       let error;
       startDateValue = value;
       if (!value) {
           error = 'Please, choice a start date of this event';
       }
       return error;
   }*/