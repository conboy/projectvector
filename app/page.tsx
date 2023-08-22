'use client'

import UploadFile from "./components/UploadFile";
import User from "./components/User"
import FileList from "./components/FileList";
import { useEffect, useState } from "react";
import getFiles from "@/util/getFiles";

export default function Home() {
  const [files, setFiles] = useState([])
  const [error, setError] = useState(null); 
  
  useEffect(() => {
    getFiles()
      .then(data => setFiles(data.data))
      .catch(err => setError(err.message));
  }, [])


  return (
    <main>
      <h1>Hello world!</h1>
      <User />
      <UploadFile files={files} setFiles={setFiles} error={error} setError={setError} />
      <FileList files={files} setFiles={setFiles} error={error} setError={setError} />
    </main>
  )
}
