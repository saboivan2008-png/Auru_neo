import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { AgentEvolver } from './agent/evolver.js';
import { SkillExecutor } from './agent/executor.js';
import skillsData from './agent/skills.json' assert { type: "json" };

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(express.static('.'));

const evolver = new AgentEvolver();
const executor = new SkillExecutor(skillsData);

// Real-time WebSocket spojenie pre živý stream agenta
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'SYSTEM', message: '🔌 WebSocket pripojený k AETHER Core Engine.' }));

  ws.on('message', async (message) => {
    const payload = JSON.parse(message);
    
    if (payload.action === 'COMMAND') {
      ws.send(JSON.stringify({ type: 'LOG', message: `🤖 Spracovávam príkaz: "${payload.data}"` }));
      
      // Vykonanie ukážkového skillu
      const result = await executor.executeSkill('github_auto_commit');
      ws.send(JSON.stringify({ type: 'RESULT', data: result }));
    }

    if (payload.action === 'EVOLVE') {
      ws.send(JSON.stringify({ type: 'LOG', message: '🔍 Prebieha skenovanie novších LLM modelov...' }));
      const upgrade = await evolver.executeUpgrade('upgrade');
      ws.send(JSON.stringify({ type: 'EVOLVE_COMPLETE', message: upgrade }));
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Enterprise AETHER Platform spustená na portu ${PORT}`);
});
