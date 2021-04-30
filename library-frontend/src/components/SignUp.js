import React from 'react'
import {useFormik} from 'formik'
import { BiUserCircle, BiBookHeart } from 'react-icons/bi'
import {FcLock} from 'react-icons/fc'
import {useHistory} from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { SIGNUP } from '../queries'

import {
	Input,
	Stack,
	InputGroup,
	InputLeftElement,
	Button,
	FormControl,
	Text,
} from '@chakra-ui/react';

const RegisterForm = ({handleRegister, setErrorMessage}) => {

  const [signup, signupResult] = useMutation(SIGNUP, {
    onError: (error) => setErrorMessage(error.graphQLErrors[0].message),
    
  })

  const history = useHistory()


  const formik = useFormik({
    initialValues: {
      username: '',
      favouriteGenre: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({username, password, favouriteGenre, confirmPassword}, {resetForm}) => {
      if (password !== confirmPassword) {
        setErrorMessage({ error: 'Passwords do not watch' }, 5)
      }
      try {
        await signup({variables: {username, password, favouriteGenre}})
        resetForm()
        history.push("/login")
      } catch (err) {
        console.error(err)
      }
    },
  });



  return (
    <form onSubmit={formik.handleSubmit}>
    <Stack spacing={3} bg="gray.200"
    w='350px'
    p={5}
    boxShadow='m'
    rounded='lg'>
      
      <FormControl isRequired >
        <InputGroup>
          <InputLeftElement children={<BiUserCircle/>} />
          <Input 
            type='text' name='username' 
            placeholder='username' 
            area-label='username' 
            onChange={formik.handleChange} 
            value={formik.values.username}
            bg='white'
            />
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
			<InputGroup>
				<InputLeftElement children={<BiBookHeart />} />
				<Input
				type='text'
				name='favouriteGenre'
				placeholder='Favourite Genre'
				aria-label='Favourite Genre'
                onChange={formik.handleChange} 
                value={formik.values.favouriteGenre}
				bg='white'
				/>
			</InputGroup>
		</FormControl>
      <FormControl isRequired >
        <InputGroup>
          <InputLeftElement children={<FcLock/>} />
          <Input
            type='password'
            placeholder='Password'
            aria-label='Password'
            name='password'
            onChange={formik.handleChange}
            value={formik.values.password}
            bg='white'
          />
        </InputGroup>
      </FormControl>
    <FormControl isRequired>
			<InputGroup>
				<InputLeftElement children={<FcLock />} />
				<Input
				type='password'
				name='confirmPassword'
				placeholder='Confirm Password'
				aria-label='confirmPassword'
                onChange={formik.handleChange} 
                value={formik.values.confirmPassword}
				bg='white'
				/>
			</InputGroup>
		</FormControl>
    
      <Button
        type='submit'
        boxShadow='sm'
        _hover={{ boxShadow: 'md' }}
        _active={{ boxShadow: 'lg' }}
        width="100"
        >
        Sign up
      </Button>
      <Text fontSize="sm" textAlign="center" color="gray.400">Created by Jarryingnut 👨‍💻</Text>

      
      
    </Stack>
  </form>
  )
  
}

export default RegisterForm
