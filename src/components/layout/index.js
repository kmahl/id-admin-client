import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Layout, Menu, Icon, Spin } from 'antd';
const { Header, Content, Sider } = Layout;
import { withRouter } from "react-router";

const MainLayout = ({ children, token, history }) => {
  const [collapsed, setCollapse] = useState(false);
  const className = history && history.location && history.location.pathname.slice(1);

  return (
    <Layout style={{ minHeight: '100vh' }}>
    <Header className="header">
      <div className="logo" />
    </Header>
    <Layout>
      {token && <div style={{ display: 'flex' }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          onBreakpoint={broken => {
            setCollapse(false);
          }}
          onCollapse={(collapsed, type) => {
            setCollapse(true);
          }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
            theme="dark"
          >
            <Menu.Item key="1">
              <Link to="/">
                <Icon type="pie-chart" />
                <span>Home</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/booking">
                <Icon type="pie-chart" />
                <span>Booking</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/client">
                <Icon type="pie-chart" />
                <span>Client</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <div className="collapse-button">
          <Icon
            className="trigger"
            type={collapsed ? 'left-circle' : 'right-circle'}
            onClick={() => setCollapse(!collapsed)}
          />
        </div>
      </div>}
      <Layout>
        <Content
          className={className}
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
            {children}
        </Content>
      </Layout>
    </Layout>
  </Layout >
  );
};

export default withRouter(MainLayout);
