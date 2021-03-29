import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client'
import { ChakraProvider } from '@chakra-ui/react'
import { setContext } from 'apollo-link-context'
import {BrowserRouter as Router} from 'react-router-dom'





const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('graphql-library-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
}) 

ReactDOM.render(
  <ApolloProvider client={client}>
   <ChakraProvider>
   <Router>
      <App />
      </Router>
    </ChakraProvider>
  </ApolloProvider>
  ,
  document.getElementById('root')
);

