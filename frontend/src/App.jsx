import React, { useState, useEffect } from 'react'
import ActionCable from "actioncable"
import Router from './router'
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  const [cable, setCable] = useState(null);

  useEffect(() => {
    const newCable = ActionCable.createConsumer(`${import.meta.env.VITE_API_URL}/cable`);
    setCable(newCable);

    return () => {
      newCable.disconnect();
    };
  }, []);
  return (
    <ChakraProvider>
      <div className='App'>
        <Router cable={cable} />
      </div>
    </ChakraProvider>
  )
}

export default App
