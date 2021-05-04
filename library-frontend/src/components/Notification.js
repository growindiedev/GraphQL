
import {useState, useEffect} from 'react'
import {
  Alert,
  AlertIcon,
} from "@chakra-ui/react"

function Notification(props) {

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setTimeout(() => {
        setVisible(false);
        }, props.delay);
    }, [props.delay]);

    const message = props.notificationMessage
    if (!message || (!message?.notification && !message?.error)) return null

    

    return visible ? 
        <Alert status={message?.error ? 'error' : 'info'} {...props} variant="subtle"  borderRadius="sm" width="100%" alignItems="center" px="40"   py="1.5">
        <AlertIcon />
        {message?.notification ? message?.notification : message?.error}      
        </Alert>
     : <div/>
    
}

export default Notification