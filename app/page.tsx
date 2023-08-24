'use client'

import UploadFile from "./components/UploadFile";
import User from "./components/User"
import FileList from "./components/FileList";
import { useEffect, useState } from "react";
import getFiles from "@/util/getFiles";
import ChatWindow from "./components/ChatWindow";
import { useSession } from "next-auth/react";

export default function Home() {
  const [file, setFile] = useState<File>()
  const [selectedFile, setSelectedFile] = useState<File>()
  const [files, setFiles] = useState([])
  const [error, setError] = useState(null); 

  
  const { data: session } = useSession()
  
  // Load files on page load
  useEffect(() => {
    getFiles()
      .then(data => setFiles(data.data))
      .catch(err => setError(err.message));
  }, [])

  return (
    <main>
      <h1>Project Vector</h1>
      <User session={session}/>
      <UploadFile file={file} setFile={setFile} files={files} setFiles={setFiles} error={error} setError={setError} />
      <FileList files={files} setFiles={setFiles} setSelectedFile={setSelectedFile} error={error} setError={setError} />
      <ChatWindow session={session} selectedFile={selectedFile}/>
    </main>
  )
}
