import React, { useState } from 'react'
import sendMessage from '@/util/sendMessage'

export default function ChatWindow({ session, selectedFile }) {
    const [question, setQuestion] = useState('')

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
                </form>
            }

        </>
  )
}
