import getSession from "@/util/getSession";
import prisma from "@/util/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all messages of selected file
export async function GET(request: NextRequest, context: { params }) {
    // Validate session
    const session = await getSession()

    const fileId = context.params.fileId; 

    const response = await prisma.message.findMany({
        select: {
            id: true,
            content: true,
            role: true,
        },
        where: {
            userId: session.user.id,
            fileId: fileId,
        }
    })
    console.log(response)
    return NextResponse.json({data: response}, { status: 200 })
}