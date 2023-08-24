import getChatHistory from '@/util/getChatHistory';
import React, { useEffect, useState } from 'react'

export default function ChatWindow({ chats, setChats, selectedFile, error, setError }) {
    const [question, setQuestion] = useState('')
    
    // Load chat messages when user selects a file
    useEffect(() => {
        if (selectedFile) {
        getChatHistory(selectedFile)
            .then(data => setChats(data.data))
            .catch(err => setError(err.message));
        }
    }, [selectedFile]);

    async function sendChat(e: React.FormEvent<HTMLFormElement>, selectedFile: File, question: string) {
        e.preventDefault();
    
        // Add new chat to chat window history
        setChats((prevChats) => {
            // Get the last chat's ID
            const lastChatId = prevChats.length > 0 ? prevChats[prevChats.length - 1].id : 0;
    
            // Create a new chat object
            const newChat = {
                id: lastChatId + 1,
                content: question,
                role: 'USER'
            };
    
            // Return the updated chats array
            return [...prevChats, newChat];
        })
        
        const res = await fetch('api/queries', {
            method: 'POST',
            body: JSON.stringify({
                fileId: selectedFile.id,
                message: question,
            })
        })
    
        const response = await res.json()
        
        // Add AI's answer to chat window history
        setChats((prevChats) => {
            // Get the last chat's ID
            const lastChatId = prevChats.length > 0 ? prevChats[prevChats.length - 1].id : 0;
    
            // Create a new chat object
            const newChat = {
                id: lastChatId + 1,
                content: response.data.content,
                role: 'AI'
            };

            console.log("AI SAID ", newChat)
    
            // Return the updated chats array
            return [...prevChats, newChat];
        })
        console.log(chats)
    }

    return (
        <>
            <h2>ChatWindow</h2>
            {chats && chats.length > 0 ? (
                <div>
                    {chats.map((chat, index) => (
                        <p key={index}>{chat.content}</p> 
                    ))}
                </div>
            ) : null}

            {selectedFile && 
                <form onSubmit={e => sendChat(e, selectedFile, question)}>
                    <label>
                        {selectedFile.name}
                        <textarea
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                        />
                    </label>
                    <button type='submit'>Submit</button>

                    
                </form>
            }

        </>
  )
}
