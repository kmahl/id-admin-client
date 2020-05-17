import gql from 'graphql-tag';

const GET_CLIENTS = gql`
  {
    clients{
      id
      name
      email
      address
      birth_date
      phone
      city
      country
      state 
      subsidiary{
        id
        name
      }
    }
  }
`;

const CREATE_CLIENT = gql`
mutation createClient($address: String, $birth_date: String, $document: String, $city: String, $country: String, $email: String!, $name: String!, $phone: String, $state: String, $subsidiaryId: ID)
{   createClient(
     address: $address,
     birth_date: $birth_date,
     document: $document,
     city: $city,
     country: $country,
     email: $email,
     name: $name,
     phone: $phone,
     state: $state,
     subsidiaryId: $subsidiaryId,
     ){
    name
  }
}
`;

const UPDATE_CLIENT = gql`
mutation updateClient($address: String, $birth_date: String, $document: String, $city: String, $country: String, $email: String!, $name: String!, $phone: String, $state: String, $subsidiaryId: ID)
{   updateClient(
     address: $address,
     birth_date: $birth_date,
     document: $document,
     city: $city,
     country: $country,
     email: $email,
     name: $name,
     phone: $phone,
     state: $state,
     subsidiaryId: $subsidiaryId,
     ){
    name
  }
}
`;

const DELETE_CLIENT = gql`
  mutation deleteClient($id: ID!){
    deleteClient(id: $id){
      name
    }
  }
`;

export {
  GET_CLIENTS,
  CREATE_CLIENT,
  UPDATE_CLIENT,
  DELETE_CLIENT
};