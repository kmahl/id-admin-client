import React, { Component } from 'react';
import { AUTH_TOKEN } from '../../constants';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from "react-router";
import { Icon, Input, Button, Spin } from 'antd';

const LOGIN = gql`
  mutation Login($user: String!, $password: String!) {
    login(username: $user, password: $password) {
      token
      user {
        username
      }
    }
  }
`;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true, // switch between Login and SignUp
      user: '',
      password: '',
    };
  }

  componentWillMount() {
    const token = localStorage.getItem(AUTH_TOKEN);
    if (token) {
      this.props.history.push(`/`);
    } else {
      this.props.updateToken();
    }
  }

  render() {
    const { login, user, password } = this.state;
    return (
      <div className="login-section">
        <h2 className="header">Bienvenido</h2>
        <div className="login-container">
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            value={user}
            onChange={e => this.setState({ user: e.target.value })}
            type="text"
            placeholder="User"
          />
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="login-button">
          <Mutation
            mutation={LOGIN}
            variables={{ user, password }}
            onCompleted={data => this._confirm(data)}
          >
            {mutation => (
              <Button type="primary" onClick={mutation} block>
                Login
              </Button>
            )}
          </Mutation>
        </div>
      </div>
    );
  }

  _confirm = async data => {
    const { token } = data.login;
    this._saveUserData(token);
    this.props.history.push(`/`);
  }

  _saveUserData = token => {
    this.props.save(token);
  }
}

export default withRouter(Login);