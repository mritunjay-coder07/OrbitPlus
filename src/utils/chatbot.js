/**
 * Builds a string representation of the current dashboard data for AI context.
 */
export const buildDashboardContext = (data) => {
  const iss = data.iss 
    ? `Latitude: ${data.iss.lat.toFixed(4)}, Longitude: ${data.iss.lng.toFixed(4)}, Speed: ${typeof data.speed === 'number' ? Math.round(data.speed) : 'Calculating'} km/h`
    : 'Data not available';
    
  const astronauts = data.astronauts?.map(a => `${a.name} (${a.craft})`).join(', ') || 'None';
  
  const news = data.news?.slice(0, 5).map((n, i) => `${i+1}. ${n.title} (Source: ${n.source})`).join('\n') || 'None';

  return `
Current ISS Status:
${iss}
Nearest Location: ${data.location}
Tracked Positions: ${data.trackedCount}

People in Space (${data.peopleCount} total):
${astronauts}

Latest News Headlines:
${news}
`.trim();
};

/**
 * Calls Hugging Face Inference API with context and user question.
 */
export const callHuggingFace = async (context, question) => {
  const token = import.meta.env.VITE_HF_TOKEN;
  if (!token) throw new Error('No HF Token');

  const prompt = `[INST]
You are a dashboard assistant. Answer ONLY using the dashboard context below.
Do not use outside knowledge.
Do not guess.
If the answer is not present in the context, reply:
“I can only answer questions based on the current ISS and news dashboard data.”

Dashboard Context:
${context}

User Question:
${question}
[/INST]`;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!response.ok) throw new Error('HF API Error');
  
  const result = await response.json();
  let text = result[0]?.generated_text || "";
  
  // Strip the prompt from response if necessary
  if (text.includes('[/INST]')) {
    text = text.split('[/INST]')[1].trim();
  }
  
  return text;
};

/**
 * Fallback keyword matching for when AI is unavailable.
 */
export const ruleBasedFallback = (context, query) => {
  const q = query.toLowerCase();
  
  if (q.includes('where') || q.includes('location')) {
    return `The ISS is currently over ${context.split('Nearest Location: ')[1].split('\n')[0]}.`;
  }
  if (q.includes('fast') || q.includes('speed')) {
    return `The ISS is moving at ${context.split('Speed: ')[1].split(' km/h')[0]} km/h.`;
  }
  if (q.includes('how many') || q.includes('people')) {
    return `There are ${context.split('People in Space (')[1].split(' total')[0]} people in space right now.`;
  }
  if (q.includes('news')) {
    return "The latest news includes " + context.split('Latest News Headlines:\n')[1].split('\n')[0];
  }

  return "I can only answer questions based on the current ISS and news dashboard data.";
};
