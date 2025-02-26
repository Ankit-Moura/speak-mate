import { useEffect, useState } from "react";
import { start, endCall, vapi } from "./ai";

function App() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Idle");

  useEffect(() => {
    // Setup event listeners only once on mount
    vapi.on("call-start", () => setStatus("Call started..."));
    vapi.on("call-end", () => setStatus("Idle"));
    vapi.on("speech-start", () => setStatus("Assistant is speaking..."));
    vapi.on("speech-end", () => setStatus("Waiting for response..."));
    vapi.on("message", (messageObj) => {
      const len = messageObj.conversation.length;
      let latestMsgObj = len>1? messageObj.conversation[len - 1]:null;
      console.log(latestMsgObj);
      if (latestMsgObj) {
        const latestMessage = {
          sender: latestMsgObj.role === "assistant" ? "Assistant" : "User",
          text: latestMsgObj.content,
        };
    
        setMessages((prev) => [...prev, latestMessage]); // Append structured messages
      }   
    });   

    vapi.on("error", (err) => {
      console.error("Error:", err);
      setStatus("Idle");
    });

    return () => endCall(); // Cleanup on unmount
  }, []); // Runs only once

  // Function to start the call
  async function handleStartCall() {
    try {
      setStatus("Starting call...");
      await start().then(console.log("call started")); // Start Vapi call
    } catch (error) {
      console.error("Failed to start call:", error);
      setStatus("Error starting call!");
    }
  }
  function handleEndCall(){
    endCall();
    setStatus("Idle");
  }

  return (
    <>
      <h2>Hey, welcome to Speak Mate!</h2>
      <p>Status: {status}</p>
      <button onClick={handleStartCall} disabled={status==="Idle"?false:true}>Start Call</button>
      <button onClick={handleEndCall} disabled={status!=="Idle"?false:true}>End Call</button>
      <div>
        {messages.map((msgObj, i) => (
          <p key={i}>{msgObj.sender}: {msgObj.text}</p>
        ))}
      </div>
    </>
  );
}

export default App;
