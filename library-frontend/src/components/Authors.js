  
import React from 'react'
import {useFormik} from 'formik'
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
    VStack, Box, Heading, HStack
  } from "@chakra-ui/react"

const Authors = (props) => {

    const formik = useFormik({
        initialValues: {
          name: '',
          born: ''
        },
        onSubmit: ({name, born}, {resetForm}) => {
            props.editAuthor({ variables: {name, born: parseInt(born)}})
            resetForm()
        },
      });
  

  return (
    <VStack p="5" mx="auto" width="xl" color="gray.600" spacing="5">
      <Heading size="lg"  fontWeight="semibold">Authors</Heading>
      <Box p={4} shadow="sm" borderWidth="1px" width="xl" borderRadius="md" mx="auto">
      <Table size="md">
      <TableCaption>Authors and the total no. books written by them</TableCaption>
        <Tbody>
          <Tr>
            <Th>
              Author
            </Th>
            <Th>
              Born
            </Th>
            <Th>
              Books
            </Th>
          </Tr>
          {props.authors.map(a =>
            <Tr key={a.name}>
              <Td>{a.name}</Td>
              <Td>{a.born}</Td>
              <Td>{a.bookCount}</Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      </Box>


    
      <form onSubmit={formik.handleSubmit}>
      <Heading fontWeight="semibold" size="md" p="4" color="blue.400" >Set birth year</Heading>
        <HStack width="lg">
          <Input  
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
          name="name"
          placeholder="Name"
          size="sm"
          borderWidth="2px"
          />
          

          <Input 
          type="text"
          onChange={formik.handleChange}
          value={formik.values.born}
          name="born"
          placeholder="Born"
          size="sm"
          borderWidth="2px"
          />
          <Button type="submit" size="sm" variant="solid" p="2" colorScheme="purple" borderRadius="sm" w="sm">update</Button>
          </HStack>
      </form>


      </VStack>
      
  )
}

export default Authors