import { useState } from 'react'
import axios from "axios";
import {Button, Text} from "@chakra-ui/react"

function ApiTest() {
  const [message, setMessage] = useState('');

  const test = () => {
    axios.get('http://localhost:3000/api/test').then((response) => {
      setMessage(response.data.message);
    });
  };
  return (
    <div>
      <Button colorScheme="teal" onClick={test}>Api Test</Button>
      <Text>{message}</Text>
    </div>
  )
}

export default ApiTest;
