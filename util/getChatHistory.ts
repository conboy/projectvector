export default async function getChatHistory(selectedFile) {    
    const res = await fetch(`api/queries/${selectedFile.id}`, { method: 'GET' })
    if (!res.ok) throw new Error("Failed to get chat history")
    const messages = await res.json()
    return messages
}