import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'

// create httpLink to backend
const httpLink = createHttpLink({
    uri: process.env.REACT_APP_BACKEND_URI,
  })
  
  // authorization link allows us to pass our token under authorization header
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: localStorage.getItem("token") || ""
      }
    }
  });
  
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          clients: {
            merge(existing, incoming) {
              return incoming;
            }
          },
          projects: {
            merge(existing, incoming) {
              return incoming;
            }
          }
        }
      }
    }
  })
  
  const client  = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });

  export default client;