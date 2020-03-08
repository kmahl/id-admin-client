/* import { onError } from 'apollo-link-error';
import { AUTH_TOKEN } from '../constants';

const errorLink = onError(({ networkError, graphQLErrors, operation, forward, response }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path, extensions }) => {
      if (message === "Unauthorized" || message === "Not Authenticated") {
        // every 401/unauthorized error will be caught here and update the global local state
        localStorage.removeItem(AUTH_TOKEN);
        return forward(operation);
      } else if (message && extensions && extensions.code) {
        switch (extensions.code) {
          case 'P2002': {
            if (extensions.class) {
              switch (extensions.class) {
                case 'Client': {
                  response.errors = { code: extensions.code, message: 'El Correo ya está registrado.' };
                  return forward(operation);
                }
                case 'Subsidiary':
                  response.errors = ({ code: extensions.code, message: 'El Nombre de Sucursal ya está registrado.' });
                  return forward(operation);
                case 'Employee':
                  response.errors = ({ code: extensions.code, message: 'El Nombre de Empleado ya está registrado.' });
                  return forward(operation);
                case 'User':
                  response.errors = ({ code: extensions.code, message: 'El Nombre de Usuario ya está registrado.' });
                  return forward(operation);
                default:
                  response.errors = ({ code: extensions.code, message: `Error en ${extensions.class}, ${extensions.field}` });
                  return forward(operation);
              }
            }
            response.errors = ({ code: extensions.code, message: `Error en ${extensions.field}` });
            return forward(operation);
          }
          default:
            Promise.reject({ code: extensions.code, message: `${extensions.field}, ${message}` });
        }
        response.errors = ({ code: extensions.code, message: `Error Inesperado: ${message}` });
        return forward(operation);
      }
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      response.errors = (message);
      return forward(operation);
      //throw new Error(message);
    }
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
    throw new Error(networkError);
  };
});

export default errorLink; */

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