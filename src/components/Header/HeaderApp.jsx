import React, {useEffect, useState} from 'react';
import s from './Header.module.css'
import {Button, Col, Row} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {setAccount} from "../../redux/auth-reducer";
import logo from '../../assets/image/logo_black.png'

const HeaderApp = () => {

    const isAuth = useSelector(state => state.userAuthorize.isAuth);
    const authAccount = useSelector(state => state.userAuthorize.authAccount);
    const dispatch = useDispatch();

    return (<div className={s.content}>
            <Row>
                <Col span={6}>
                    <div className="logo">
                        <img style={{height: '50px'}}
                             src={logo}
                             alt='logo'/>
                    </div>
                </Col>

                <Col span={18}>
                    <div className={s.login}>
                        {!isAuth ?
                            <div> Please, authorize by MetaMask
                                <Button className={s.button}
                                        onClick={() => dispatch(setAccount())}>
                                    MetaMask
                                </Button>
                            </div>
                            : <div>
                                Your account: <b>{authAccount}</b>
                            </div>
                        }
                    </div>

                </Col>

            </Row>

        </div>
    )
};

export default HeaderApp;