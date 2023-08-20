import { useSession, signIn, signOut } from 'next-auth/react'

export default function User() {
    const { data: session } = useSession()

    if (session && session.user) {
        return (

            <div className="user-card">
                <p>Welcome {session.user.name}</p>
                {session.user.image ? <img src={session.user.image} alt={`${session.user.name}'s profile picture`}/> : <></>}
                
                <button onClick={() => signOut()}>Sign out</button>
            </div>

        )
    } 
    else {
        return (
            <button onClick={() => signIn()}>Sign in</button>
        )
    }
    
}
