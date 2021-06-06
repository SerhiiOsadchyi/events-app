import React from 'react';
import s from './App.css';
import HeaderApp from "./components/Header/HeaderApp";
import Events from "./components/Events/Events";
import {Layout} from 'antd';
import Tickets from "./components/Tickets/Tickets";
import {useSelector} from "react-redux";

const {Header, Content, Footer} = Layout;

const App = () => {

    const userAddress = useSelector(state => state.userAuthorize.authAccount);
//debugger
    return (
        <Layout className="layout">

            <Header className={s.headerApp}>
                <HeaderApp/>
            </Header>

            <Content style={{padding: '0 50px'}}>
                <div className="site-layout-content">
                    {userAddress ?
                        <>
                            <Tickets userAddress={userAddress} />
                            <Events userAddress={userAddress} />
                        </>
                        : <Events/>
                    }
                </div>
            </Content>

            <Footer style={{textAlign: 'center'}}>SergeO ©2021 Created by SergeO</Footer>

        </Layout>
    );
}

export default App;