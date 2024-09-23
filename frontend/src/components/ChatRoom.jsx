import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Heading,
  List,
  ListItem,
  Box,
  Container,
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

function ChatRoom({ cable }) {
  //cableをpropsとして受けとる
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [senderName, setSenderName] = useState("");

  console.log(cable);

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/rooms/${id}/messages`
        );
        setMessages(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
    // ActionCableのsubscriptionを作成
    const subscription = cable?.subscriptions?.create(
      { channel: "RoomChannel", room_id: id },
      {
        connected() {
          // Called when the subscription is ready for use on the server
          console.log("connected");
        },
        disconnected() {
          // Called when the subscription has been terminated by the server
          console.log("disconnected");
        },
        received(message) {
          console.log("message => %o", message);
          setMessages((prevMessages) => [...prevMessages, message]);
        },
      }
    );
    console.log("subscription => %o", subscription);
    // コンポーネントがアンマウントされたときにsubscriptionを解除
    return () => {
      subscription?.unsubscribe();
    };
  }, [id, cable]);

  useEffect(() => {
    const boxElement = scrollRef.current;
    boxElement.scrollTop = boxElement.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/rooms/${id}/messages`, {
        content: newMessageContent,
        sender_name: senderName,
      });
      setNewMessageContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const messageBgColor = useColorModeValue("white", "gray.600");

  return (
    // <Container maxW="container.md">
    //   <Box p={4} borderWidth="1px" borderRadius="lg">
    //     <Heading as="h1" size="lg" mb={4}>
    //       チャットルーム {id}
    //     </Heading>
    //     <List>
    //       {messages.map((message) => (
    //         <ListItem key={message.id} mb={2}>
    //           <strong>{message.sender_name}:</strong> {message.content}
    //         </ListItem>
    //       ))}
    //     </List>

    //     <VStack spacing={4} mt={8}>
    //       <FormControl>
    //         <FormLabel htmlFor="sender-name">名前:</FormLabel>
    //         <Input
    //           id="sender-name"
    //           type="text"
    //           value={senderName}
    //           onChange={(e) => setSenderName(e.target.value)}
    //           placeholder="名前を入力"
    //           required
    //         />
    //       </FormControl>
    //       <FormControl>
    //         <FormLabel htmlFor="new-message">メッセージ:</FormLabel>
    //         <HStack>
    //           <Input
    //             id="new-message"
    //             type="text"
    //             value={newMessageContent}
    //             onChange={(e) => setNewMessageContent(e.target.value)}
    //             placeholder="メッセージを入力"
    //             required
    //           />
    //           <Button colorScheme="teal" onClick={sendMessage}>
    //             送信
    //           </Button>
    //         </HStack>
    //       </FormControl>
    //     </VStack>
    //   </Box>
    // </Container>
    <Container maxW="container.md" py={8}>
      <Box
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        bg={bgColor}
        borderColor={borderColor}
        boxShadow="md"
      >
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          チャットルーム {id}
        </Heading>
        <Box
          height="400px"
          overflowY="auto"
          borderWidth="1px"
          borderRadius="md"
          p={4}
          mb={6}
          borderColor={borderColor}
          ref={scrollRef}
        >
          <List spacing={3}>
            {messages.map((message) => (
              <ListItem
                key={message.id}
                bg={messageBgColor}
                p={3}
                borderRadius="md"
                boxShadow="sm"
              >
                <Text fontWeight="bold" color="teal.500">
                  {message.sender_name}
                </Text>
                <Text>{message.content}</Text>
              </ListItem>
            ))}
          </List>
        </Box>

        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel htmlFor="sender-name">名前:</FormLabel>
            <Input
              id="sender-name"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="名前を入力"
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="new-message">メッセージ:</FormLabel>
            <HStack>
              <Input
                id="new-message"
                value={newMessageContent}
                onChange={(e) => setNewMessageContent(e.target.value)}
                placeholder="メッセージを入力"
                required
              />
              <Button
                colorScheme="teal"
                onClick={sendMessage}
                isDisabled={!newMessageContent.trim() || !senderName.trim()}
              >
                送信
              </Button>
            </HStack>
          </FormControl>
        </VStack>
      </Box>
    </Container>
  );
}

export default ChatRoom;
