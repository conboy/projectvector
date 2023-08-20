'use client'

import UploadFile from "./components/UploadFile";
import User from "./components/User"

export default function Home() {
  return (
    <main>
      <h1>Hello world!</h1>
      <User />
      <UploadFile />
    </main>
  )
}
