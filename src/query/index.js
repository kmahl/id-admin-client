import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const TOKEN = gql`
{ 
 token @client
}
`;

const getToken = (props) => {
  const { data, client, loading, error } = useQuery(TOKEN);
  return { 
    loading,
    error,
    client,
    token: data.token || null };
};

export {
  TOKEN,
  getToken
};