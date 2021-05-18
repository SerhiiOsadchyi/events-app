import React from 'react';
//import './App.css';
import HeaderApp from "./components/Header/HeaderApp";
import Events from "./components/Events/Events";
import {Layout} from 'antd';

const {Header, Content, Footer} = Layout;

class App extends React.Component {

    render() {

        return (
            <Layout className="layout">
                <Header className="header">
                    <HeaderApp/>

                </Header>
                <Content style={{padding: '0 50px'}}>

                    <div className="site-layout-content">
                        <Events/>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>SergeO ©2021 Created by SergeO</Footer>
            </Layout>
        );
    }
}

export default App;