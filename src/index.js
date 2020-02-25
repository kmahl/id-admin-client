import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from "apollo-client";
import { from } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { CookiesProvider } from 'react-cookie';



/* middlewares */
import { authMiddleware, errorLink } from './middlewares';

const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql" });

const link = from([
  authMiddleware,
  errorLink,
  httpLink,
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  credentials: 'same-origin'
});

const Main = (props) => (
  <CookiesProvider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </CookiesProvider>
);

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
