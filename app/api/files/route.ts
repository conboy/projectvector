import { PrismaClient, Prisma, Document } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from 'next/server'
import { join } from "path";
import { writeFile, unlink } from "fs/promises";
import { PrismaVectorStore } from "langchain/vectorstores/prisma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import prisma from "@/prisma/prisma";



// const prisma = new PrismaClient();



export async function POST(request: NextRequest) {
    // Validate session
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ "data": "Unauthorized" }, { status: 401 })
    
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
    
    return NextResponse.json({ success: true }, { status: 200 })
}

