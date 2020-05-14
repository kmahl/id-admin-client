import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { Link } from "react-router-dom";

import {
  Layout,
  Menu,
  Button,
  Spin,
  Select
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

import { TOKEN, CURRENT_USER } from '../../query';
import { GET_SUBSIDIARY_ID, GET_SUBSIDIARY_NAMES } from '../../query/subsidiary';
import { withRouter } from "react-router";
import { SUBSIDIARY_ID } from '../../constants';

import logoId from '../../assets/logo.jpeg';

const { Header, Content, Sider } = Layout;

const MainLayout = ({ children, history }) => {

  const [collapsed, setCollapse] = useState(false);
  const [selectedSubsidiary, setSelectedSubsidiary] = useState();

  let className = history && history.location && history.location.pathname.slice(1);
  const [selectedKey, setSelectedKey] = useState('/');
  const { data: { token }, client, loading, error } = useQuery(TOKEN);
  const { data: user } = useQuery(CURRENT_USER);

  /* subsidiary select */
  const [getSubsidiaries, { loading: loadingSubsidiary, error: errorSubsidiary, data: dataSubsidiary }] = useLazyQuery(GET_SUBSIDIARY_NAMES);
  const { data: { subsidiaryId }, loading: loadingSubsidiaryId, error: errorSubsidiaryId } = useQuery(GET_SUBSIDIARY_ID);

  const logout = () => {
    localStorage.clear();
    client.writeData({ data: { token: null } });
    history.push('/login');
  };

  useEffect(() => {
    if (token) {

      if (!subsidiaryId && dataSubsidiary && dataSubsidiary.subsidiaries) {
        if (!dataSubsidiary.subsidiaries.length > 0) {
          // Si no hay sucursales creadas
          history.push('/subsidiary');
        } else {
          clientSubsidiary.writeData({ data: { subsidiaryId: dataSubsidiary.subsidiaries[0].id } });
          localStorage.setItem(SUBSIDIARY_ID, dataSubsidiary.subsidiaries[0].id);
          setSelectedSubsidiary(dataSubsidiary.subsidiaries[0].id);
        }
      } else {
        setSelectedSubsidiary(subsidiaryId);
      }
    }
  }, [dataSubsidiary]);

  useEffect(() => {
    setSelectedKey(history.location.pathname);
    if (token) {
      getSubsidiaries();
    }
  }, [history.location]);


  if (loadingSubsidiary) return <div><Spin spinning={true}></Spin></div>;

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

  const subsidiaryChange = value => {
    clientSubsidiary.writeData({ data: { subsidiaryId: value } });
    localStorage.setItem(SUBSIDIARY_ID, value);
    setSelectedSubsidiary(value);
  };

  return (
    <Layout style={{ minHeight: '100vh', height: '100vh' }}>
      <Header className="header">
        <div className="logo"><img src={logoId}></img></div>
        {/* TODO: nombre, avatar, opciones */}
        {token && <div className="header-panel">
          {dataSubsidiary && dataSubsidiary.subsidiaries &&
            <div className="subsidiary">
              <span className="label">Sucursal</span>
              <Select value={selectedSubsidiary} label="sucursal" size="small" style={{ width: '200px' }} onChange={subsidiaryChange}>
                {dataSubsidiary.subsidiaries.map(subsidiary => <Select.Option key={subsidiary.id} value={subsidiary.id}>{subsidiary.name}</Select.Option>)}
              </Select>
            </div>}
          <div className="loggon">
            {user && user.currentUser && <span className="user">{user.currentUser.username}</span>}
            <Button type="link" className="logout" onClick={logout}>Salir</Button>
          </div>
        </div>}
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
