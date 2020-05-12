import gql from 'graphql-tag';

const GET_BOOKINGS = gql`
  {
    bookings{
      id
      start,
      duration,
      subsidiary{
        id
        name
      }
      employee {
        id
        name
        color
      }
      client{
        id
        name
      }
      service{
        id
        name
        duration
      }
    }
  }
`;

/* const GET_EMPLOYEE = gql`
  query employee($id: ID!){
      employee(id: $id){
        id
        name
        services{
          id
          name
          duration
        }
      }
  }
`; */

const CREATE_BOOKING = gql`
mutation createBooking($start: String!, $duration: Int!, $clientId: ID, $employeeId: ID, $subsidiaryId: ID, $userId: ID, $serviceId: ID)
{   createBooking(
    start: $start,
    duration: $duration,
    clientId: $clientId,
    employeeId: $employeeId,
    subsidiaryId: $subsidiaryId,
    serviceId: $serviceId,
    userId: $userId,
     ){
    id
  }
}
`;

const UPDATE_BOOKING = gql`
mutation updateBooking($id: ID!, $start: String!, $duration: Int!, $clientId: ID, $employeeId: ID, $subsidiaryId: ID, $userId: ID, $serviceId: ID)
{   updateBooking(
    id: $id,
    start: $start,
    duration: $duration,
    clientId: $clientId,
    employeeId: $employeeId,
    subsidiaryId: $subsidiaryId,
    serviceId: $serviceId,
    userId: $userId,
     ){
    id
  }
}
`;

const DELETE_BOOKING = gql`
  mutation deleteBooking($id: ID!){
    deleteBooking(id: $id){
      id
    }
  }
`;

export {
  GET_BOOKINGS,
  CREATE_BOOKING,
  UPDATE_BOOKING,
  DELETE_BOOKING
};