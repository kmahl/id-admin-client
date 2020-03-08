import gql from 'graphql-tag';

const GET_SUBSIDIARIES = gql`
{ 
  subsidiaries {
    id
    name
    address
    city
    state
    country
    phone
  }
}
`;

const GET_SUBSIDIARY_NAMES = gql`
{ 
  subsidiaries{
    id
    name
  }
}
`;

const CREATE_SUBSIDIARY = gql`
mutation createSubsidiary($address: String, $city: String, $country: String, $name: String!, $phone: String, $state: String)
{   createSubsidiary(
     address: $address,
     city: $city,
     country: $country,
     name: $name,
     phone: $phone,
     state: $state,
     ){
    name
  }
}
`;

const UPDATE_SUBSIDIARY = gql`
mutation updateSubsidiary($address: String, $city: String, $country: String, $name: String!, $phone: String, $state: String)
{   updateSubsidiary(
     address: $address,
     city: $city,
     country: $country,
     name: $name,
     phone: $phone,
     state: $state,
     ){
    name
  }
}
`;

const DELETE_SUBSIDIARY = gql`
  mutation deleteSubsidiary($id: ID!){
    deleteSubsidiary(id: $id){
      name
    }
  }
`;

export {
  GET_SUBSIDIARIES,
  GET_SUBSIDIARY_NAMES,
  CREATE_SUBSIDIARY,
  UPDATE_SUBSIDIARY,
  DELETE_SUBSIDIARY,
};