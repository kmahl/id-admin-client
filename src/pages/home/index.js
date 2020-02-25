import React from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { withRouter } from "react-router";

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

  if (!props.token) {
    props.updateToken;
    props.history.push('/login');
  }

  if (loading) return 'Loading...';
  if (error) {
    props.history.push('/login');
    return `Error! ${error.message}`;
  };
  return (
    <div>
      {data.users.map(user => (<p>{user.username}</p>))}
    </div>
  );
};

export default withRouter(Home);