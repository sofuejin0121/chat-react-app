import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatRooms from "../components/ChatRooms";
import ChatRoom from "../components/ChatRoom";

const Router = ({cable}) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ChatRooms/>}/>
                <Route path="/rooms/:id" element={<ChatRoom  cable={cable}/>}/> 
            </Routes>
        </BrowserRouter>
    )
}

export default Router;