import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
} from "@chakra-ui/react";

function ChatRooms() {
  const [chatRooms, setChatRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/rooms`
        );
        setChatRooms(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChatRooms();
  }, []);

  const createRoom = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/rooms`,
        {
          name: newRoomName,
        }
      );
      setChatRooms([...chatRooms, response.data]);
      setNewRoomName("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxW="container.md">
      <Box p={4} borderWidth="1px" borderRadius="lg">
        <Heading as="h1" size="lg" mb={4}>
          ReactChat - チャットルーム一覧
        </Heading>
        <List>
          {chatRooms.map((room) => (
            <ListItem key={room.id} mb={2}>
              <Link to={`/rooms/${room.id}`}>{room.name}</Link>
            </ListItem>
          ))}
        </List>

        <VStack spacing={4} mt={8}>
          <Heading as="h3" size="md">
            チャットルーム作成
          </Heading>
          <FormControl>
            <FormLabel htmlFor="room-name">ルーム名:</FormLabel>
            <Input
              id="room-name"
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
          </FormControl>
          <Button colorScheme="teal" onClick={createRoom}>
            作成
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default ChatRooms;
