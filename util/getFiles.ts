export default async function getFiles() {
    const res = await fetch('api/files', { method: 'GET' })
    if (!res.ok) throw new Error("Failed to get files")
    return res.json()
}