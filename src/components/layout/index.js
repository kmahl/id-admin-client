import React from 'react';
import { Link } from "react-router-dom";
import { Layout, Menu, Icon, Spin } from 'antd';
const { Header, Content, Sider } = Layout;
import { withRouter } from "react-router";

class MainLayout extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      collapsed: false,
    };

  }

  toggle() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const { children, token, history } = this.props;
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
              collapsed={this.state.collapsed}
              breakpoint="lg"
              onBreakpoint={broken => {
                this.setState({
                  collapsed: false
                });
              }}
              onCollapse={(collapsed, type) => {
                this.setState({
                  collapsed: true
                });
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
                type={this.state.collapsed ? 'left-circle' : 'right-circle'}
                onClick={this.toggle}
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
              <Spin spinning={true} >
                {children}
              </Spin>
            </Content>
          </Layout>
        </Layout>

      </Layout >
    );
  }

}
export default withRouter(MainLayout);
