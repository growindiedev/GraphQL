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
    query allBooks($filterByAuthor: String, $filterByGenre: String){
    allBooks(author: $filterByAuthor, genres: $filterByGenre){
        title
        published
        id
        genres
        author {
            name
        }
    }
}
`
export const ME = gql`
    query me{
    me {
        username
        favouriteGenre
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

export const SIGNUP = gql`
    mutation createUser($username: String!, $password: String!, $favouriteGenre: String!){
    createUser(username: $username, password: $password, favoriteGenre: $favouriteGenre){
        username
    }
}` 
