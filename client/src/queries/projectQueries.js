import { gql } from '@apollo/client';

const GET_SINGLE_PROJECT = gql`
query getProject($id: ID!) {
    project(id: $id) {
        id
        name
        description
        status
        client {
            id
            name
            email
            phone
        }
    }
}
`

const GET_PROJECTS = gql`
    query getProjects {
        projects {
            id
            name
            status
            client {
                name
            }
        }
    }    
`

export { GET_PROJECTS, GET_SINGLE_PROJECT }