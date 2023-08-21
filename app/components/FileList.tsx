'use client'
import React, { useEffect, useState } from 'react'

async function getFiles() {
    const res = await fetch('api/files', { method: 'GET' })
    if (!res.ok) throw new Error("Failed to get files")
    return res.json()
}



export default function FileList() {
    const [files, setFiles] = useState([])
    const [error, setError] = useState(null); 
    
    useEffect(() => {
        getFiles()
            .then(data => setFiles(data.data))
            .catch(err => setError(err.message));
    }, [])
    console.log(files)

    const deleteFile = async (fileId : string) => {
        const res = await fetch('api/files', { 
            method: 'DELETE',
            body: JSON.stringify({ id: fileId })
        })
        console.log(res)
        // if (!res.ok) throw new Error("Failed to delete file")
        return
    }

    return (
    <div>
        <h1>File List:</h1>
        <ul>
            {files.map(file => (
                <li key={file.id}>
                    <p>Name: {file.name}</p>
                    <p>Created At: {new Date(file.created_at).toLocaleString()}</p>
                    <button onClick={() => deleteFile(file.id)}>Delete</button>
                </li>
            ))}
        </ul>
    </div>
  )
}
