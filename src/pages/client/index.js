import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { withRouter } from "react-router";
import { Icon, Input, Button, Spin, Table } from 'antd';

const GET_USERS = gql`
  {
    users{
      id
      username
    }
  }
`;

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

const Client = (props) => {
  const { loading, error, data } = useQuery(GET_USERS);
  const [spinning, setSpin] = useState(false);
  if (!props.token) {
    props.updateToken;
    props.history.push('/login');
  }

  if (loading) return <Spin spinning={true}></Spin>;
  if (error) {
    props.history.push('/login');
    return `Error! ${error.message}`;
  };
  return (
    <div className="client-section">
      <Spin spinning={spinning} >
        <Table dataSource={dataSource} columns={columns} />;
  
      </Spin>
    </div>
  );
};

export default withRouter(Client);