import React, {useEffect}  from 'react'
import {useFormik} from 'formik'
import { BiUserCircle } from 'react-icons/bi'
import {FcLock} from 'react-icons/fc'
import { useHistory } from 'react-router-dom'
import {
	Input,
	Stack,
	InputGroup,
	InputLeftElement,
	Button,
	FormControl,
	Center,
	Text,
	
} from '@chakra-ui/react';

const Login = ({ login, getUser }) => {


	const history = useHistory()

	// useEffect(() => {
    //     getUser()
    //   }, [])

  const formik = useFormik({
    initialValues: {
      username: '',
      password: ''
    },
    onSubmit: async ({username, password}, {resetForm}) => {
      try {
        await login({variables: {username, password}})
        resetForm()
		//getUser();
		history.push("/")
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
				<Button
					type='submit'
					boxShadow='sm'
					_hover={{ boxShadow: 'md' }}
					_active={{ boxShadow: 'lg' }}
          			width="100"
					>
					Login
				</Button>
				<Text fontSize="sm" textAlign="center" color="gray.400">Created by Jarryingnut 👨‍💻</Text>
				
				
			</Stack>
		</form>
  )
}

export default Login
