import React from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  AlertIcon,
} from "@chakra-ui/react"

function Notification(props) {

    
    if (!props.message || (!props.message?.notification && !props.message?.error)) return null

    return (
        <Alert status={props.message?.error ? 'error' : 'info'} {...props} variant="solid" padding="1.5" borderRadius="md">
        <AlertIcon />
        {props.message?.notification ? props.message?.notification : props.message?.error}      
        </Alert>
    )
    
}

export default Notification

Notification.propTypes = {
    className: PropTypes.string,
  }