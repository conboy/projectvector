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

    async function sendMessage(e: React.FormEvent<HTMLFormElement>, selectedFile: File, question: string) {
        e.preventDefault();

        // setMessages(prevMessages => [...prevMessages, question])
        
        const res = await fetch('api/queries', {
            method: 'POST',
            body: JSON.stringify({
                fileId: selectedFile.id,
                message: question,
            })
        })
        console.log(res)
    }

    return (
        <>
            <h2>ChatWindow</h2>
            {selectedFile && 
                <form onSubmit={e => sendMessage(e, selectedFile, question)}>
                    <label>
                        {selectedFile.name}
                        <textarea
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                        />
                    </label>
                    <button type='submit'>Submit</button>
                    
                    {chats && chats.length > 0 ? (
                        <div>
                            {chats.map((chat, index) => (
                                <p key={index}>{chat.content}</p> 
                            ))}
                        </div>
                    ) : null}
                </form>
            }

        </>
  )
}
