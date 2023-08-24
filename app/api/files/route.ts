import { Prisma, Document } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server'
import { join } from "path";
import { writeFile, unlink } from "fs/promises";
import { PrismaVectorStore } from "langchain/vectorstores/prisma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import prisma from "@/util/prisma";
import getSession from "@/util/getSession";


export async function GET(request: NextRequest) {
    // Validate session
    const session = await getSession()

    // Get all files that have the userId of the session
    const response = await prisma.file.findMany({
        select: {
            id: true,
            name: true,
            created_at: true,
        },
        where: {
            userId: session.user.id
        }
    })
    return NextResponse.json({ data: response }, { status: 200 })
}

export async function POST(request: NextRequest) {
    // Validate session
    const session = await getSession()
    
    // Validate file
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    if (!file) return NextResponse.json({ success: false }, { status: 400 })
    if (!file.name.endsWith(".pdf")) return NextResponse.json({ success: false }, { status: 415 })

    // Turn file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file to memory
    const filePath = join('C:\\Users\\conja\\test-site\\my-app\\uploads', file.name)
    await writeFile(filePath, buffer)

    // Store file details in db
    const storedFile = await prisma.file.create({
        data: {
            name: file.name,
            user: {
                connect: {
                    id: session.user.id
                }
            }
        }
    })

    // Turn file into texts
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    const texts = docs.map(({ pageContent }) => pageContent.replace(/\n/g, ''));

    // Initialize vector store
    const embeddings = new OpenAIEmbeddings()
    const vectorStore = PrismaVectorStore.withModel<Document>(prisma).create(
        embeddings,
        {
            prisma: Prisma,
            tableName: "Document",
            vectorColumnName: "vector",
            columns: {
                id: PrismaVectorStore.IdColumn,
                content: PrismaVectorStore.ContentColumn,
            },
        }
    );
    
    // Add content and embeddings to the vector db
    await vectorStore.addModels(
        await prisma.$transaction(
            texts.map((content) => prisma.document.create({ 
                data: { 
                    content,
                    file: {
                        connect: {
                            id: storedFile.id
                        }
                    },
                    user: {
                        connect: {
                            id: session.user.id
                        }
                    } 
                } }))
        )
    );
    
    // Delete temp file from memory
    try {
        await unlink(filePath)   
    } catch (error) {
        console.log("Could not delete file.")
    }
    
    return NextResponse.json({ data: storedFile }, { status: 200 })
}

export async function DELETE(request: NextRequest) {
    // Validate session
    const session = await getSession()
    const file = await request.json()

    // Delete the File's Documents first because they rely on File
    const deleteDocuments = prisma.document.deleteMany({
        where: {
            fileId: file.id
        }
    })

    // Delete the file sent in request
    const deleteFile = prisma.file.delete({
        where: {
            id: file.id,
            userId: session.user.id
        }
    })

    // Run query as a transaction as both actions must be completed
    const transaction = await prisma.$transaction([deleteDocuments, deleteFile])

    return NextResponse.json({ success: true }, { status: 200 } )
}