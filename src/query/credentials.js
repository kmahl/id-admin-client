import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export const currentCredentialQuery = gql
  `
    query CurrentCredentialQuery {
        username
        isLogged
    }
  `
;

export const CURRENT_USER = gql(`
  query currentUser{
    currentUser{
      username
    }
  }
`);
// This query should only be ran on the in memory cache on the client.
export const getCurrentCredential = graphql(currentCredentialQuery, {
  name: 'getCurrentCredential'
  ,options: {
    fetchPolicy: 'cache-only'
  }
});