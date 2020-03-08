import React, { useState, useEffect } from 'react';
import { AUTH_TOKEN } from '../../constants';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { withRouter } from "react-router";
import { Form, Icon, Input, Button, Spin } from 'antd';
import { getToken } from '../../query';

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

const Login = ({ history, form }) => {
  const [password, setPassword] = useState({
    value: '',
    help: '',
    validateStatus: '',
  });
  const [spinning, setSpin] = useState(false);
  const { token, loading: tokenLoading, error, client } = getToken();
  const [login] = useMutation(LOGIN);

  const { getFieldDecorator, validateFields } = form;

  if (tokenLoading) return <Spin spinning={true}></Spin>;
  if (error) {
    history.push('/login');
    return `Error! ${error.message}`;
  };
  if (token) {
    history.push(`/`);
  }

  const onSubmit = e => {
    e.preventDefault();
    setSpin(true);
    validateFields(async (err, { username }) => {
      if (!err) {
        try {
          if (password.value === '') {
            setPassword({
              validateStatus: 'error',
              help: 'Ingresa la contraseña!',
              value: '',
            });
            return setSpin(false);
          }
          const { data } = await login({ variables: { user: username, password: password.value } });
          const { token } = data.login;
          localStorage.setItem(AUTH_TOKEN, token);
          client.writeData({ data: { token } });
          history.push(`/`);
          return;
        } catch (error) {
          setPassword({
            validateStatus: 'error',
            help: 'Usuario o clave incorrecta!',
            value: '',
          });
        }
      }
      return setSpin(false);
    });
    ;
  };


  return (
    <div className="login-section">
      <Spin spinning={spinning} >
        <h2 className="header">Bienvenido</h2>
        <Form onSubmit={onSubmit}>
          <div className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Ingresa el usuario!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="text"
                  placeholder="User"
                />
              )}
            </Form.Item>
            <Form.Item
              hasFeedback
              required={true}
              help={password.help}
              validateStatus={password.validateStatus}
            >
              <Input.Password
                placeholder="Password"
                onChange={e => setPassword({ value: e.target.value })}
                value={password.value}
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              />
            </Form.Item>
          </div>
          <div className="login-button">
            <Button type="primary" htmlType="submit" onClick={e => onSubmit(e)} block>
              Login
              </Button>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default Form.create({ name: 'normal_login' })(withRouter(Login));