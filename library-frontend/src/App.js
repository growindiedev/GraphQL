
import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS, ADD_BOOK, EDIT_AUTHOR} from './queries'

const App = () => {
    const [page, setPage] = useState('authors')
    const allAuthorsQuery = useQuery(ALL_AUTHORS)
    const allBooksQuery = useQuery(ALL_BOOKS)
    const [addBook] = useMutation(ADD_BOOK, { refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS }  ]})
    const [editAuthor] = useMutation(EDIT_AUTHOR, { refetchQueries: [ { query: ALL_AUTHORS }, { query: ALL_BOOKS } ]})

    if (allAuthorsQuery.loading || allBooksQuery.loading)  {
        return <div>loading...</div>
      }  

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        show={page === 'authors'}
        authors={allAuthorsQuery.data.allAuthors}
        editAuthor={editAuthor}
      />

      <Books
        show={page === 'books'}
        books={allBooksQuery.data.allBooks}
      />

      <NewBook
        show={page === 'add'}
        addBook={addBook}
      />

    </div>
  )
}

export default App