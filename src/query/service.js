import gql from 'graphql-tag';

const GET_SERVICES = gql`
  {
    services{
      id
      name
      cost
      duration
    }
  }
`;

const CREATE_SERVICE = gql`
mutation createService($name: String!, $cost: Float!, $duration: Int)
{   createService(
      name: $name
      cost: $cost
      duration: $duration
     ){
    name
    cost
    duration
  }
}
`;

const UPDATE_SERVICE = gql`
mutation updateService($name: String!, $cost: Float!, $duration: Int)
{   updateService(
      name: $name
      cost: $cost
      duration: $duration
     ){
    name
    cost
    duration
  }
}
`;

const DELETE_SERVICE = gql`
  mutation deleteService($id: ID!){
    deleteService(id: $id){
      name
    }
  }
`;

export {
  GET_SERVICES,
  CREATE_SERVICE,
  UPDATE_SERVICE,
  DELETE_SERVICE
};