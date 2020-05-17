import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { withRouter } from "react-router";
import { Spin } from 'antd';
import { TOKEN } from '../../query';
import Notification from '../../components/notification';

const GET_USERS = gql`
  {
    users{
      id
      username
    }
  }
`;
const Home = ({ history }) => {
  const { loading, error, data } = useQuery(GET_USERS);
  const { data: { token }, loading: loadingUser, error: errorUser } = useQuery(TOKEN);




  if (!token) {
    history.push('/login');
  }


  if (loading || loadingUser) return <Spin spinning={true}></Spin>;
  if (error) Notification(error.message, 'error');
  if (errorUser) Notification(errorUser.message, 'error');



  return (
    <div className="home-section">
      {data && data.users && data.users.map(user => (<p key={user.id}>{user.username}</p>))}
    </div>
  );
};

export default withRouter(Home);