import getChatHistory from '@/util/getChatHistory';
import React, { useEffect, useState } from 'react'

export default function ChatWindow({ chats, setChats, selectedFile, error, setError, isLoading }) {
    
    
    
    // Load chat messages when user selects a file
    useEffect(() => {
        if (selectedFile) {
        getChatHistory(selectedFile)
            .then(data => setChats(data.data))
            .catch(err => setError(err.message));
        }
    }, [selectedFile]);

    

    return (
        <>
            {chats && chats.length > 0 ? (
                <div className="h-screen ">
                     
                    {chats.map((chat, index) => (
                        <div key={index} className={chat.role === "USER" ? "chat chat-end" : "chat chat-start"}>
                            <div className="chat-bubble">{chat.content}</div>
                        </div>
                    ))}
                    {isLoading ? 
                        <div className="chat chat-start">
                            <div className="chat-bubble">
                                <span className="loading loading-dots loading-md"></span>
                            </div>
                        </div> 
                    : null }
                </div>
            ) : null}

            

        </>
  )
}
