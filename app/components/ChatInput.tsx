import React from 'react'

export default function ChatInput({ chats, setChats, selectedFile, error, setError, isLoading, setIsLoading, question, setQuestion  }) {
    


    async function sendChat(e: React.FormEvent<HTMLFormElement>, selectedFile: File, question: string) {
        e.preventDefault();
        // Show user that answer is loading
        setIsLoading(true)
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
        // Show user that answer is done loading
        setIsLoading(false)
        
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
    {selectedFile &&   
        <div className="join">
            <input 
                value={question}
                onChange={e => setQuestion(e.target.value)}
                className="input input-bordered join-item" 
                placeholder="Send a message"
            />
            <button 
                className="btn join-item"
                onClick={e => sendChat(e, selectedFile, question)}
            >Send</button>
        </div>
    }
    </>
  )
}
