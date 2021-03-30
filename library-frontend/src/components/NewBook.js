import React, { useState } from 'react'
import { Box, Input, Button , FormControl, FormLabel, VStack, Text} from '@chakra-ui/react'


const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])


  const submit = async (event) => {
    event.preventDefault()
    
    console.log('add book...')
    props.addBook({variables: {author, title, published: parseInt(published), genres}})

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre.toLowerCase()))
    setGenre('')
  }

  return (
    <Box p="5">
      <form onSubmit={submit}>
        <VStack spacing="3" >
        <FormControl isRequired>
        <FormLabel>Title</FormLabel>
          <Input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </FormControl>
        <FormControl isRequired>
        <FormLabel>Author</FormLabel>
          <Input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </FormControl>
        <FormControl isRequired>
        <FormLabel>Published</FormLabel>
          <Input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </FormControl>
        <FormControl isRequired>
        <FormLabel>Genres</FormLabel>
          <Input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <Button
          boxShadow='sm'
          _hover={{ boxShadow: 'md' }}
          _active={{ boxShadow: 'lg' }}
          width="100"
          size="sm"
          onClick={addGenre} 
          colorScheme="yellow"
          borderRadius="sm"
          my="3">add genre</Button>
        </FormControl>
        <Text fontWeight="medium" size="md" color="green.600">
          Genres: {genres.join(' ')}
        </Text>
        <Button
          type='submit'
          boxShadow='sm'
          _hover={{ boxShadow: 'md' }}
          _active={{ boxShadow: 'lg' }}
          width="100"
          colorScheme="yellow"
          borderRadius="sm"
          size="sm"
        >create book</Button>
        </VStack>
      </form>
    </Box>
  )
}

export default NewBook