import React, { useEffect } from 'react'
import {
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Box,
  useRadioGroup,
  VStack,
  HStack,
  
} from "@chakra-ui/react"
import RadioCard from './RadioCard'

const Books = (props) => {

  useEffect(() => {
    props.getBooks()
    console.log('lazy',props.lazyBooks)
  }, []);

  let genres = props.books.flatMap((book) => book.genres);

    genres = [...new Set(genres)];

  const books = props.lazyBooks
    ? props.lazyBooks : props.books

    const { getRootProps, getRadioProps } = useRadioGroup({
      name: "framework",
      defaultValue: "science",
      onChange: val => 
        props.getBooks({variables: { filterByGenre: val}})
      

    })
    const group = getRootProps()
 

 


  return (
      <VStack spacing="2">
      <Box p={4} shadow="sm" borderWidth="1px" width="xl" borderRadius="md" mx="auto" my="4" >

      <Table>
      <TableCaption>Books written by various Authors</TableCaption>
        <Tbody>
          <Tr>
            <Th>books</Th>
            <Th>
              author
            </Th>
            <Th>
              published
            </Th>
          </Tr>
          {books.map(a =>
            <Tr key={a.title}>
              <Td>{a.title}</Td>
              <Td>{a.author.name}</Td>
              <Td>{a.published}</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      
    </Box>

    <HStack {...group} flexWrap="wrap" width="lg">
    {genres.map((value) => {
      const radio = getRadioProps({ value })
      return (
        <RadioCard key={value} {...radio} >
          {value}
        </RadioCard>
      )
    })}
    </HStack>
    </VStack>
  )
}

export default Books