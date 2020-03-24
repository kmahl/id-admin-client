import gql from 'graphql-tag';

const GET_EMPLOYEES = gql`
  {
    employees{
      id
      name
      email
      address
      birth_date
      phone
      city
      country
      state 
      color
      subsidiary{
        id
        name
      }
      services{
        id
        name
      }
    }
  }
`;

const CREATE_EMPLOYEE = gql`
mutation createEmployee($address: String, $birth_date: String!, $city: String, $country: String, $email: String!, $name: String!, $phone: String, $state: String, $color: String!, $subsidiaryId: ID!)
{   createEmployee(
     address: $address,
     birth_date: $birth_date,
     city: $city,
     country: $country,
     email: $email,
     name: $name,
     phone: $phone,
     state: $state,
     color: $color,
     subsidiaryId: $subsidiaryId,
     ){
    name
  }
}
`;

const UPDATE_EMPLOYEE = gql`
mutation updateEmployee($address: String, $birth_date: String!, $city: String, $country: String, $email: String!, $name: String!, $phone: String, $state: String, $color: String!, $subsidiaryId: ID!)
{   updateEmployee(
     address: $address,
     birth_date: $birth_date,
     city: $city,
     country: $country,
     email: $email,
     name: $name,
     phone: $phone,
     state: $state,
     color: $color,
     subsidiaryId: $subsidiaryId,
     ){
    name
  }
}
`;

const DELETE_EMPLOYEE = gql`
  mutation deleteEmployee($id: ID!){
    deleteEmployee(id: $id){
      name
    }
  }
`;

export {
  GET_EMPLOYEES,
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE
};