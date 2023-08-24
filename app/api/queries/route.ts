import getSession from "@/util/getSession";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/util/prisma";
import { createEmbeddings } from "@/util/createEmbedding";
import { LLMChain, OpenAI, PromptTemplate } from "langchain";

// Handle user asking a question
export async function POST(request: NextRequest) {
    // Validate session
    const session = await getSession()
    
    // Parse request
    const data = await request.json()
    console.log("Data retrieved:", data)
    
    // Embed question
    const embeddingResponse = await createEmbeddings({
        token: process.env.OPENAI_API_KEY,
        model: 'text-embedding-ada-002',
        input: `${data.message}`,
    })

    const [{ embedding }] = embeddingResponse
    console.log(typeof embedding)
    
    try {
        // Add user's question to database
        const uploadedMessage = await prisma.message.create({
            data: {
                content: data.message,
                userId: session.user.id,
                fileId: data.fileId,
                role: "USER",
            }
        })
        
        console.log("Added message to db:", uploadedMessage)


        // Get all documents of selected file and find two most semantically similar documents
        const fileDocuments = await prisma.$queryRaw`
            SELECT content FROM "Document"
            WHERE "fileId" = ${data.fileId} AND "userId" = ${session.user.id}
            ORDER BY vector <=> ${embedding}::vector LIMIT 2
        `
        const documentContent = fileDocuments.map((object, index) => `CONTEXT ${index + 1}:\n${object.content}`).join('\n\n');
        console.log(documentContent)
        
        const model = new OpenAI({ temperature: 0 }); 
        const prompt = PromptTemplate.fromTemplate(
            'Based on the context surrounded in triple backticks ``` ```, Answer the question descriptively surrounded in triple quotes """ """ and quote the contexts: \n\n```{documentContent}```\n\n"""{question}"""'
        );
        const chain = new LLMChain({ llm: model, prompt });
        const answer = await chain.call({ documentContent: documentContent, question: data.message });
        console.log(answer.text)

        // Add AI's answer to database
        const savedAnswer = await prisma.message.create({
            data: {
                content: answer.text,
                userId: session.user.id,
                fileId: data.fileId,
                role: "AI",
            }
        })

        return NextResponse.json({ data: savedAnswer }, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({error: error}, { status: 500 })
    }

    
}