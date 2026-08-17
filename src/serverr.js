import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());
app.use(express.static('.'));

// Tvoj API kľúč z Google AI Studio (nahraď text v úvodovkách svojim kľúčom)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "SEM_VLOZ_SVOJ_GEMINI_KEY";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Endpoint pre komunikáciu s agentom AURU_NEO
app.post('/api/agent/command', async (req, res) => {
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ error: "Chýba príkaz." });
  }

  try {
    // Volanie najnovšieho modelu Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Si AURU_NEO, autonómny AI agent s 1300 skillmi a 30 integráciami. Odpovedaj na tento príkaz: ${command}`,
    });

    res.json({
      status: "SUCCESS",
      agentResponse: response.text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Chyba pri volaní Gemini API:", error);
    res.status(500).json({ 
      error: "Zlyhalo spojenie s AI rozom.", 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 AURU_NEO Agent Server beží na porte ${PORT}`);
});
