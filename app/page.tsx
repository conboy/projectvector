import UploadFile from "./components/UploadFile";
import User from "./components/User"
import FileList from "./components/FileList";

export default function Home() {
  return (
    <main>
      <h1>Hello world!</h1>
      <User />
      <UploadFile />
      <FileList />
    </main>
  )
}
