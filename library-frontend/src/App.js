
import React, { useState } from 'react'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { Switch, Route, Redirect } from 'react-router-dom'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Navbar from './components/Navbar'
import Homepage from './components/Homepage'
import Notification from './components/Notification'



import { ALL_AUTHORS, ALL_BOOKS, ADD_BOOK, EDIT_AUTHOR, ME } from './queries'
import { VStack} from '@chakra-ui/layout'

const App = () => {
    const [token, setToken] = useState(null)
    const [notificationMessage, setNotificationMessage] = useState(null)
    const allAuthorsQuery = useQuery(ALL_AUTHORS)
    const allBooksQuery = useQuery(ALL_BOOKS)
    const [getBooks , books] = useLazyQuery(ALL_BOOKS, {fetchPolicy: "network-only"})
    const [getUser, user] = useLazyQuery(ME, {fetchPolicy: "network-only"})
    const userQuery = useQuery(ME)
    const [addBook] = useMutation(ADD_BOOK, { refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS }  ]})
    const [editAuthor] = useMutation(EDIT_AUTHOR, { refetchQueries: [ { query: ALL_AUTHORS }, { query: ALL_BOOKS } ]})

    

  if (allAuthorsQuery.loading || allBooksQuery.loading || userQuery.loading|| user.loading)  {
        return <div>loading...</div>
  }
   
  return (
    <>
    <Navbar setToken={setToken} user={useQuery}  getUser={getUser} lazyUser={user} />
    <Notification notificationMessage={notificationMessage} delay="3000"/>
    <VStack spacing="5" p="10">
    <Switch>
      <Route
          path="/authors"
          render={() => (token || userQuery?.data?.me?.username ? 
          <Authors authors={allAuthorsQuery.data.allAuthors} editAuthor={editAuthor}/> : <Redirect to="/login" />)}
      />
      <Route
        path="/books"
        render={() => (token || userQuery?.data?.me?.username ? 
          <Books books={allBooksQuery.data.allBooks} getBooks={getBooks} lazyBooks={books?.data?.allBooks}/> : <Redirect to="/login" />)}
     />
      <Route
        path="/newbook"
        render={() => (token || userQuery?.data?.me?.username ? 
          <NewBook addBook={addBook} setNotificationMessage={setNotificationMessage}/> : <Redirect to="/login" />)}
     />

      <Route path="/login" exact render={() => (token || userQuery?.data?.me?.username ? <Redirect to="/"/> : 
      <Login
        setNotificationMessage={setNotificationMessage}
        getUser={getUser}
        setToken={setToken}
      />)}/>

      <Route path="/signup" exact render={() => (token || userQuery?.data?.me?.username ? <Redirect to="/"/> : 
      <SignUp
       setNotificationMessage={setNotificationMessage}
       getUser={getUser}

      />)}/>

      <Route
        path="/"
        exact
        render={() => (token || userQuery?.data?.me?.username ? 
          <Homepage/> : <Redirect to="/login" />)}
     />
    </Switch>

    </VStack>
    </>
  )
}

export default App