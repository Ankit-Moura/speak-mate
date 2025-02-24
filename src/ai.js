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