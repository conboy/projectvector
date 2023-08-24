'use client'
import getFiles from '@/util/getFiles';
import React, { useEffect, useState } from 'react'


export default function FileList({ files, error, setSelectedFile, setFiles, setError }) {
    
    useEffect(() => {
        getFiles()
            .then(data => setFiles(data.data))
            .catch(err => setError(err.message));
    }, [])

    const deleteFile = async (fileId : string) => {
        try {
            const res = await fetch('api/files', { 
                method: 'DELETE',
                body: JSON.stringify({ id: fileId })
            })
            if (!res.ok) throw new Error("Failed to delete file")
            // Update the files state
            setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
        } catch (error) {
            console.error(error);
        }
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
                    <button onClick={() => setSelectedFile(file)}>Select</button>
                </li>
            ))}
        </ul>
    </div>
  )
}
