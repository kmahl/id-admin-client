import { onError } from 'apollo-link-error';
import { AUTH_TOKEN, USERNAME} from '../constants';

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      if (message === "Unauthorized" || message=== "Not Authenticated") {
        // every 401/unauthorized error will be caught here and update the global local state
        localStorage.removeItem(AUTH_TOKEN);
      }
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    }
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export default errorLink;