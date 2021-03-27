import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
    query allAuthors{
        allAuthors{
            name
            born
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query allBooks{
    allBooks{
        title
        published
        id
        genres
    }
}
`
export const ME = gql`
    query me{
    me {
        username
    }
}
`

export const ADD_BOOK = gql`
    mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String]!){
    addBook(title: $title, author: $author, published: $published, genres: $genres){
        title
        published
        genres
    }
}
`

export const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $born: Int!){
    editAuthor(name: $name, setBornTo: $born){
        name
        born
        bookCount
    }


}
`
export const LOGIN = gql`
    mutation login($username: String!, $password: String!){
    login(username: $username, password: $password){
        value
    }
}`
