
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { Switch, Route, Redirect } from 'react-router-dom'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Navbar from './components/Navbar'



import { ALL_AUTHORS, ALL_BOOKS, ADD_BOOK, EDIT_AUTHOR, ME, LOGIN} from './queries'
import { VStack, Alert} from '@chakra-ui/layout'

const App = () => {
    const [token, setToken] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const allAuthorsQuery = useQuery(ALL_AUTHORS)
    const allBooksQuery = useQuery(ALL_BOOKS)
    //const [getUsers, userQuery] = useLazyQuery(ME, { partialRefetch: true})
    const userQuery = useQuery(ME)
    const [addBook] = useMutation(ADD_BOOK, { refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS }  ]})
    const [editAuthor] = useMutation(EDIT_AUTHOR, { refetchQueries: [ { query: ALL_AUTHORS }, { query: ALL_BOOKS } ]})

    const [login, loginResult] = useMutation(LOGIN, {
      onError: (error) => setErrorMessage(error.graphQLErrors[0].message),
  })
       

  useEffect(() => {
    if (loginResult.data) {
        const token = loginResult.data.login.value
        setToken(token)
        localStorage.setItem('graphql-library-token', token)
    }
  }, [loginResult.data])

  if (allAuthorsQuery.loading || allBooksQuery.loading || userQuery.loading)  {
        return <div>loading...</div>
  }
      
  return (
    <>
    <Navbar setToken={setToken} user={userQuery.data?.me} token={token}/>
    <VStack spacing="5">
    <Switch>
      <Route path="/" exact>
      <Authors
        authors={allAuthorsQuery.data.allAuthors}
        editAuthor={editAuthor}
      />
      </Route>
      <Route path="/books">
      <Books
        books={allBooksQuery.data.allBooks}
      />
      </Route>
      <Route path="/newbook">
      <NewBook
        addBook={addBook}
      />
      </Route>
      <Route path="/login">
      <Login
        setToken={setToken}
        setErrorMessage={setErrorMessage}
        login={login}
        loginResult={loginResult}
        //getUsers={getUsers}
      />
      </Route>
      <Route
        path="/"
        render={() => (userQuery.data?.me?.username ? 
          <Redirect to="/"/> : <Redirect to="/login" />)}
     />
    </Switch>

    </VStack>
    </>
  )
}

export default App