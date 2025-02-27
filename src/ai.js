import Vapi from "@vapi-ai/web";


export const vapi = new Vapi(import.meta.env.VITE_public_key);

const assistantId = import.meta.env.VITE_agent_id

export async function start(){
    const assistantOverrides = {
        variableValues: {
          name: "Alice",
          age: 22,
        },
      };
    return vapi.start(assistantId, assistantOverrides);
};

export function endCall(){
    vapi.stop();
}



export async function getScore(callId) {
  const url = `https://api.vapi.ai/call/${callId}`;
  if (callId===null){
    console.log("id is null");
    return;
  };
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_private_key}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching score:', err);
    return null; // Return a default value in case of failure
  }
}
