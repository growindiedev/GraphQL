import React, { useState, useEffect } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from '../queries'

import {
    Table,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    Box,
    VStack,
    
    
  } from "@chakra-ui/react"

const Homepage = () => {
  //const user = useQuery(ME)
  const { loading: me_loading, error: me_error, data: me } = useQuery(ME);
  const [getFavoriteBooks, result] = useLazyQuery(ALL_BOOKS)
  const [favoriteBooks, setFavoriteBooks] = useState([])

  useEffect(() => {
    if (result.data) {
      setFavoriteBooks(result.data.allBooks)
    }
  }, [setFavoriteBooks, result])

  // useEffect(() => {
  //   //getUser();
  //   if (user.data) {
  //     getFavoriteBooks({ variables: { filterByGenre: user.data?.me?.favouriteGenre } })
  //   }
  // }, [getFavoriteBooks, user])

  useEffect(() => {
    //getUser();
    if (!me_loading) {
      getFavoriteBooks({ variables: { filterByGenre: me?.me?.favouriteGenre } })
    }
  }, [getFavoriteBooks, me])


  if (me_loading) return <p>Loading...</p>;


  return (
    <VStack spacing="2">
    <Box p={4} shadow="sm" borderWidth="1px" width="xl" borderRadius="md" mx="auto" my="4" >
      <Table>
      <TableCaption>
        books in your favorite genre <b>{me?.me?.favouriteGenre}</b>
      </TableCaption>
        <Tbody>
          <Tr>
            <Th>title</Th>
            <Th>author</Th>
            <Th>published</Th>
          </Tr>
          {favoriteBooks.map((a) => (
            <Tr key={a.title}>
              <Td>{a.title}</Td>
              <Td>{a.author.name}</Td>
              <Td>{a.published}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
    </VStack>
  )
}

export default Homepage
