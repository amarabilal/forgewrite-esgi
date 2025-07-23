import axios from 'axios'

const DEEPSEEK_API_KEY = 'sk-fc2a1b8b98394096abe6beec6e0f1db1'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

export const improveText = async (text: string): Promise<string> => {
  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant d\'écriture expert. Améliore le texte fourni en gardant le même style et la même voix de l\'auteur. Améliore la grammaire, la fluidité, la clarté et l\'engagement sans changer le sens ou la structure générale. IMPORTANT: Retourne UNIQUEMENT le texte amélioré, sans aucune explication, commentaire ou formatage supplémentaire.'
          },
          {
            role: 'user',
            content: `Améliore ce texte:\n\n${text}`
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )

    // Extract and clean the response
    let improvedText = response.data.choices[0].message.content.trim()
    
    // Remove any potential formatting or explanations that might slip through
    // Remove markdown formatting
    improvedText = improvedText.replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    improvedText = improvedText.replace(/\*(.*?)\*/g, '$1') // Remove italic
    improvedText = improvedText.replace(/```[\s\S]*?```/g, '') // Remove code blocks
    
    // Remove common explanation patterns
    improvedText = improvedText.replace(/^(Version améliorée|Texte amélioré|Amélioration).*?:\s*/i, '')
    improvedText = improvedText.replace(/\*\*Explications.*$/s, '') // Remove explanations section
    improvedText = improvedText.replace(/\*\*Variante.*$/s, '') // Remove variants section
    
    // Clean up quotes if they were added unnecessarily
    if (improvedText.startsWith('«') && improvedText.endsWith('»')) {
      // Only remove quotes if the original didn't have them
      if (!text.trim().startsWith('«') && !text.trim().startsWith('"')) {
        improvedText = improvedText.slice(1, -1).trim()
      }
    }
    
    return improvedText.trim()
    
  } catch (error) {
    console.error('Erreur lors de l\'amélioration du texte :', error)
    throw new Error('Impossible d\'améliorer le texte avec l\'IA')
  }
}