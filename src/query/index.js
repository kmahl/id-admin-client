import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const TOKEN = gql`
{ 
 token @client
}
`;

const CURRENT_USER = gql`
{
  currentUser{
    id
    username
  }
}
`;

/* const getToken = (props) => {
  const { data, client, loading, error } = useQuery(TOKEN);
  const { data: userData } = useQuery(CURRENT_USER);
  return {
    loading,
    error,
    client,
    token: data.token || null,
    user: (userData && userData.currentUser) || null,
  };
}; */

export {
  TOKEN,
  CURRENT_USER,
};