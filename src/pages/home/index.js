import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { withRouter } from "react-router";
import { Icon, Input, Button, Spin } from 'antd';

const GET_USERS = gql`
  {
    users{
      id
      username
    }
  }
`;
const Home = (props) => {
  const { loading, error, data } = useQuery(GET_USERS);
  const [spinning, setSpin] = useState(false);


  useEffect(() => {
    if (!props.token) {
      // props.updateToken;
      props.history.push('/login');
    }
  },[]);

  if (loading) return <Spin spinning={true}></Spin>;
  if (error) {
    props.history.push('/login');
    return `Error! ${error.message}`;
  };


  return (
    <div className="home-section">
      <Spin spinning={spinning} >
        {data.users.map(user => (<p key={user.username}>{user.username}</p>))}
      </Spin>
    </div>
  );
};

export default withRouter(Home);