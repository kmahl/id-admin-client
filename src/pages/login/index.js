import React, { useState, useEffect } from 'react';
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

const Login = (props) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [spinning, setSpin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN);
    if (token) {
      props.history.push(`/`);
    } else {
      props.updateToken();
    }
  }, []);

  const _confirm = async data => {
    const { token } = data.login;
    _saveUserData(token);
    props.history.push(`/`);
  };

  const _saveUserData = token => {
    props.save(token);
  };

  return (
    <div className="login-section">
      <Spin spinning={spinning} >
        <h2 className="header">Bienvenido</h2>
        <div className="login-container">
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            value={user}
            onChange={e => setUser(e.target.value)}
            type="text"
            placeholder="User"
          />
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
        </div>
        <div className="login-button">
          <Mutation
            mutation={LOGIN}
            variables={{ user, password }}
            onCompleted={data => _confirm(data)}
          >
            {mutation => (
              <Button type="primary" onClick={() => { setSpin(true); return mutation(); }} block>
                Login
              </Button>
            )}
          </Mutation>
        </div>
      </Spin>
    </div>
  );
};

export default withRouter(Login);