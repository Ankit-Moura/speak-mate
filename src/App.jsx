import { useEffect, useState } from "react";
import { start, endCall, vapi , getScore} from "./ai";

function App() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [score, setScore] = useState({});
  useEffect(() => {
    // Setup event listeners only once on mount
    vapi.on("call-start", () => {
      setScore(()=>{});
      setStatus("Call-starting")
    });
    vapi.on("call-end", () => {
      const id = "a6f61fbd-13b3-402f-aa69-e0d4a6d7bab8"
      let data = getScore(id);
      data = data.analysis.structuredData;
      console.log(data);
      setScore(()=>data);
      setStatus("call-ended")});
    vapi.on("speech-start", () => setStatus("Assistant is speaking..."));
    vapi.on("speech-end", () => setStatus("Waiting for response..."));
    vapi.on("message", (messageObj) => {
      const len = messageObj.conversation.length;
      let latestMsgObj = len>1? messageObj.conversation[len - 1]:null;
      console.log(latestMsgObj);
      if (latestMsgObj) {
        const sender = latestMsgObj.role === "assistant" ? "Assistant" : "User";
        const newMessage = latestMsgObj.content;

        setMessages((prev) => {
          if (prev.length > 0 && prev[prev.length - 1].sender === sender) {
            //  Merge with last message if sender is the same
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = {
              sender,
              text: newMessage, // Merge texts
            };
            return updatedMessages;
          } else {
            
            return [...prev, { sender, text: newMessage }];
          }
        });
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
      setStatus("call-starting");
      const callObj = await start().then(console.log("call started")); // Start Vapi call
      console.log(callObj)
    } catch (error) {
      console.error("Failed to start call:", error);
      setStatus("Error starting call!");
    }
  }
  function handleEndCall(){
    endCall();
    setStatus("call-ended");
  }
  
  let disabled = status==="Idle" || status === "call-ended"
  return (
    <>
      <h2>Hey, welcome to Speak Mate!</h2>
      <p>Status: {status}</p>
      <button onClick={handleStartCall} disabled={disabled?false:true}>Start Call</button>
      <button onClick={handleEndCall} disabled={disabled?true:false}>End Call</button>
      {score && Object.keys(score).length === 0 && <p>hwh</p>}
      <div>
        {messages.map((msgObj, i) => (
          <p key={i}>{msgObj.sender}: {msgObj.text}</p>
        ))}
      </div>
    </>
  );
}

export default App;
