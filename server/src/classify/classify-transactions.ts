import { HarmBlockThreshold, HarmCategory } from "@google-cloud/vertexai"
import { Account, Transaction } from "../schema/graphql.js"
import { config } from "../config.js"
import { GoogleGenAI } from "@google/genai"

interface VertexTransactionClassification {
    sourceAccountID: string;
    targetAccountID: string;
    confidence: number; // A confidence score from the LLM (0.0 to 1.0)
    reasoning: string; // The LLM's reasoning for the classification
}

const ai = new GoogleGenAI({
    vertexai: true,
    project: config.gcp.projectID,
    location: config.gcp.genai.location,
})

export async function classifyTransaction(tx: Transaction, accounts: Account[]) {

    const prompt = `
    You are an expert financial assistant AI.
    Your task is to analyze a bank transaction and classify it into the most logical source and target accounts from a provided list.
    
    Note that the transaction has a current source & target accounts, most often set as defaults when they were scraped
    from the financial data source. You should try to avoid using them for classification purposes, but they may serve
    some useful context as to the directionality and purpose of the transaction (e.g. from or to the checking account.)

    **Transaction Details:**
    - Date: "${tx.date}"
    - Description: "${tx.description}"
    - Reference ID: "${tx.referenceID}"
    - Currency: "${tx.currency}"
    - Current source account: "${tx.sourceAccount.id}: ${tx.sourceAccount.displayName}"
    - Current target account: "${tx.targetAccount.id}: ${tx.targetAccount.displayName}"
    - Amount: ${tx.sourceAccount.id === "primaryCheckingAccount" ? -tx.amount : tx.amount} ${tx.currency}

    **Available Accounts: (provided as rows of "ID: display-name")**
    - ${accounts.map(a => `${a.id}: ${a.displayName}`).join("\n- ")}

    **Instructions:**
    1. Determine the most logical source account for this transaction. These can be checking accounts, institutions, or other third-parties that transfer money to the user for any reason.
    2. Determine the most logical target account, which usually represents an expense of some kind (e.g., "Groceries", "Transportation") or income source of some sort.
    3. Provide a confidence score (0.0 to 1.0) for your classification.
    4. Provide a brief reasoning for your choice.
    5. Respond ONLY with a valid JSON object following this exact structure:
       {"sourceAccountID": "string", "targetAccountID": "string", "confidence": float, "reasoning": "string"}
  `

    const response = await ai.models.generateContent({
        model: config.gcp.genai.classificationModel,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ],
            temperature: 0.2,
        },
    })

    console.info("Received response from Vertex AI:\n", JSON.stringify(response, null, 2))

    const parts = response.candidates?.[0]?.content?.parts
    if (!parts) {
        throw new Error("No response parts from Vertex AI.")
    }

    const responseText = parts[0].text
    if (!responseText) {
        throw new Error("No response text from Vertex AI.")
    }

    console.log("Received raw response from LLM:", responseText)
    try {
        const json = JSON.parse(responseText)
        return {
            sourceAccountID: json.sourceAccountID,
            targetAccountID: json.targetAccountID,
            confidence: json.confidence,
            reasoning: json.reasoning,
        } as VertexTransactionClassification
    } catch (jsonError) {
        throw new Error("Failed to parse JSON response from LLM: " + jsonError)
    }
}
