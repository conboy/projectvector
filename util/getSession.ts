import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// See if the user has a session, deny otherwise

export default async function getSession() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return NextResponse.json({ "data": "Invalid session" }, { status: 401 })
    return session
}