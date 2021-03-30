import {useRadio, Box} from '@chakra-ui/react'


export default function RadioCard(props) {
    const { getInputProps, getCheckboxProps } = useRadio(props)
  
    const input = getInputProps()
    const checkbox = getCheckboxProps()
  
    return (
      <Box as="label" >
        <input {...input}/>
        <Box
          {...checkbox}
          cursor="pointer"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          _checked={{
            bg: "orange.400",
            color: "white",
            borderColor: "orange.600",
          }}
          _focus={{
            boxShadow: "outline",
          }}
          px={2.5}
          py={1.5}
          m="1"
          fontSize="xs"
        >
          {props.children}
        </Box>
      </Box>
    )
  }