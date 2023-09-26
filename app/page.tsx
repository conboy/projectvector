'use client'

import UploadFile from "./components/UploadFile";
import User from "./components/User"
import FileList from "./components/FileList";
import { useEffect, useState } from "react";
import getFiles from "@/util/getFiles";
import ChatWindow from "./components/ChatWindow";
import { useSession } from "next-auth/react";
import Navbar from "./components/Navbar";
import ChatInput from "./components/ChatInput";

export default function Home() {
  const [file, setFile] = useState<File>()
  const [selectedFile, setSelectedFile] = useState<File>()
  const [files, setFiles] = useState([])
  const [error, setError] = useState(null); 
  const [chats, setChats] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [question, setQuestion] = useState('')
  
  const { data: session } = useSession()
  
  // Load files on page load
  useEffect(() => {
    getFiles()
      .then(data => setFiles(data.data))
      .catch(err => setError(err.message));
  }, [])

  

  return (
    <main>
      <Navbar />
      <div className="flex flex-row">
          {/* <User session={session}/>
          <UploadFile file={file} setFile={setFile} files={files} setFiles={setFiles} error={error} setError={setError} /> */}
          <div>
            <FileList files={files} setFiles={setFiles} selectedFile={selectedFile} setSelectedFile={setSelectedFile} error={error} setError={setError} />
          </div>
          <div className="grow">
            <ChatWindow chats={chats} setChats={setChats} selectedFile={selectedFile} error={error} setError={setError} isLoading={isLoading} setIsLoading={setIsLoading}/>
          </div>
          {/* <ChatInput 
            chats={chats} 
            setChats={setChats} 
            selectedFile={selectedFile} 
            error={error} 
            setError={setError} 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
            question={question} 
            setQuestion={setQuestion} 
          /> */}
      </div>
    </main>
  )
}
