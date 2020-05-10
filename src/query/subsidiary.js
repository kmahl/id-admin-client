import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

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


const SUBSIDIARY_ID = gql`
{
  subsidiaryId @client
}
`;

const getSubsidiaryId = (props) => {
  const { data, client, loading, error } = useQuery(SUBSIDIARY_ID);
  return {
    loading,
    error,
    client,
    subsidiaryId: data.subsidiaryId || null
  };
};

export {
  GET_SUBSIDIARIES,
  GET_SUBSIDIARY_NAMES,
  CREATE_SUBSIDIARY,
  UPDATE_SUBSIDIARY,
  DELETE_SUBSIDIARY,
  SUBSIDIARY_ID,
  getSubsidiaryId,
};