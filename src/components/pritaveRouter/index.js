import React from "react";
import { Route, Redirect } from "react-router-dom";
import { CURRENT_USER } from '../../query/credentials';
import { ApolloConsumer } from '@apollo/react-hooks';
import { getCurrentCredential } from '../../query/credentials';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <ApolloConsumer>
      {apolloClient => {
        try {
          const userToken = getCurrentCredential();
          console.log('\n', '===============================================', '\n');
          console.log('credential');
          console.log(userToken);
          console.log('\n', '===============================================', '\n');
          return (<Route
            {...rest}
            render={props =>
              userToken ? (
                <Component {...props} />
              ) : (
                  <Redirect to="/login" />
                )
            }
          />);
        } catch (error) {
          console.log('\n', '===============================================', '\n');
          console.log('error');
          console.log(error);
          console.log('\n', '===============================================', '\n');
          return (<Redirect to="/login" />);
        }

      }}
    </ApolloConsumer>
  );
};

export default PrivateRoute;