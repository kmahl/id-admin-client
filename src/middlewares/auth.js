import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { AUTH_TOKEN } from '../constants';

 const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  });
  return forward(operation);
});

export default authMiddleware;