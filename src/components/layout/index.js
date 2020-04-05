import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import {
  Layout,
  Menu,
  Button
} from 'antd';
import {
  HomeOutlined,
  CalendarOutlined,
  IdcardOutlined,
  ShopOutlined,
  UserOutlined,
  SettingOutlined,
  ScissorOutlined,
  LeftCircleOutlined,
  RightCircleOutlined
} from '@ant-design/icons';
const { Header, Content, Sider } = Layout;

import { getToken } from '../../query';
import { withRouter } from "react-router";

const MainLayout = ({ children, history }) => {
  const [collapsed, setCollapse] = useState(false);
  const className = history && history.location && history.location.pathname.slice(1);
  const [selectedKey, setSelectedKey] = useState('/');
  const { token, client } = getToken();
  const logout = () => {
    localStorage.clear();
    client.writeData({ data: { token: null } });
    history.push('/login');
  };

  useEffect(() => {
    setSelectedKey(history.location.pathname);
  }, [history.location]);

  const menu = [
    {
      route: '/',
      icon: <HomeOutlined />,
      displayName: 'Inicio',
    },
    {
      route: '/booking',
      icon: <CalendarOutlined />,
      displayName: 'Reservas',
    },
    {
      route: '/client',
      icon: <IdcardOutlined />,
      displayName: 'Clientes',
    },
    {
      route: '/subsidiary',
      icon: <ShopOutlined />,
      displayName: 'Sucursales',
    },
    {
      route: '/employee',
      icon: <UserOutlined />,
      displayName: 'Empleados',
    },
    {
      route: '/service',
      icon: <ScissorOutlined />,
      displayName: 'Servicios',
    },
    {
      route: '/configuration',
      icon: <SettingOutlined />,
      displayName: 'Configuración',
    },
  ];
  return (
    <Layout style={{ minHeight: '100vh', height: '100vh' }}>
      <Header className="c">
        <div className="logo">logo</div>
        {/* TODO: nombre, avatar, opciones */}
        {token && <Button onClick={logout}>Salir</Button>}
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
              defaultSelectedKeys={['/']}
              style={{ height: '100%', borderRight: 0 }}
              theme="dark"
              selectedKeys={[selectedKey]}
            >
              {
                menu.map(item =>
                  <Menu.Item key={item.route} onClick={() => setSelectedKey(item.route)}>
                    <Link className="menu-item" to={item.route}>
                      {item.icon}
                      <span className="title">{item.displayName}</span>
                    </Link>
                  </Menu.Item>
                )
              }
            </Menu>
          </Sider>
          <div className="collapse-button">
            <a className="trigger" onClick={() => setCollapse(!collapsed)}>
              {collapsed ? <LeftCircleOutlined /> : <RightCircleOutlined />}
            </a>
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
