export default async function sendMessage(e: React.FormEvent<HTMLFormElement>, selectedFile: File, question: string) {
    e.preventDefault();
    const res = await fetch('api/queries', {
        method: 'POST',
        body: JSON.stringify({
            fileId: selectedFile.id,
            message: question,
        })
    })
    console.log(res)
}