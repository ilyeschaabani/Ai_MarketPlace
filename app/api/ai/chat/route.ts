import { NextResponse } from "next/server"

// AI Model 5: Virtual Car Assistant (Adam hachana)
export async function POST(request: Request) {
  try {
    const { message, context } = await request.json()

    // TODO: Implement actual RAG chatbot
    // This is a placeholder for the NLP/RAG model
    const responses: Record<string, string> = {
      prix: "Le prix moyen pour ce type de véhicule est d'environ 25 000 TND.",
      assurance: "L'assurance dépend de plusieurs facteurs comme l'âge du véhicule et votre profil.",
      default: "Je suis là pour vous aider. Posez-moi vos questions sur les voitures!",
    }

    const lowerMessage = message.toLowerCase()
    let response = responses.default

    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value
        break
      }
    }

    return NextResponse.json({ response })
  } catch (error) {
    return NextResponse.json({ error: "Chat failed" }, { status: 500 })
  }
}
