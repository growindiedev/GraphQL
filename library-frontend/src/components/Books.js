import React from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Input,
  Button,
  Box
} from "@chakra-ui/react"

const Books = (props) => {
  


  return (
      <Box p={4} shadow="sm" borderWidth="1px" width="xl" borderRadius="md" mx="auto" my="4">

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
          {props.books.map(a =>
            <Tr key={a.title}>
              <Td>{a.title}</Td>
              <Td>{a.author.name}</Td>
              <Td>{a.published}</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  )
}

export default Books