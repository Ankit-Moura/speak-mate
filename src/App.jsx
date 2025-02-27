import { useEffect, useRef, useState } from "react";
import { start, endCall, vapi, getScore } from "./ai";
import ScoreCard from "./components/ScoreCard";
import Loader from "./components/Loader";
import Description from "./components/description";

function App() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [score, setScore] = useState({});
  const callIdRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(null); // Store interval ID for cleanup

  const fetchScore = async () => {
    try {
      const data = await getScore(callIdRef.current);
      const structuredData = data?.analysis?.structuredData;
      // console.log(data.analysis);

      if (!structuredData) {
        console.log("Still waiting for results...");
      } else {
        setScore(structuredData);
        setLoading(false);
        setStatus("call-ended");

        // Stop polling
        clearInterval(polling);
        setPolling(null);
      }
    } catch (error) {
      console.error("Error fetching score:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    vapi.on("call-start", () => {
      setScore({});
      setStatus("Call-starting");
    });

    vapi.on("call-end", () => {
      setLoading(true);

      // Start polling every 2s
      if (!polling) {
        const interval = setInterval(fetchScore, 2000);
        setPolling(interval);
      }
    });

    vapi.on("speech-start", () => setStatus("Assistant is speaking..."));
    vapi.on("speech-end", () => setStatus("Waiting for response..."));
    vapi.on("message", (messageObj) => {
      const len = messageObj.conversation.length;
      let latestMsgObj = len > 1 ? messageObj.conversation[len - 1] : null;
      if (latestMsgObj) {
        const sender = latestMsgObj.role === "assistant" ? "Assistant" : "User";
        const newMessage = latestMsgObj.content;

        setMessages((prev) => {
          if (prev.length > 0 && prev[prev.length - 1].sender === sender) {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = { sender, text: newMessage };
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

    return () => {
      endCall(); // Cleanup on unmount
      clearInterval(polling); // Stop polling if component unmounts
    };
  }, []);

  async function handleStartCall() {
    try {
      setStatus("call-starting");
      const callObj = await start();
      console.log(callObj.id);
      callIdRef.current = callObj.id;
    } catch (error) {
      console.error("Failed to start call:", error);
      setStatus("Error starting call!");
    }
  }

  function handleEndCall() {
    endCall();
    setStatus("call-ended");

    // Stop polling when manually ending the call
    if (polling) {
      clearInterval(polling);
      setPolling(null);
    }
  }

  return (
    <div className="app-container">
      <h2  className="title">Hey, welcome to Speak Mate!</h2>
      <div className="head">
      
      
      <button 
        onClick={handleStartCall} 
        disabled={status !== "Idle" && status !== "call-ended"} 
        className="start-btn"
      >
        Start Call
      </button>
      <p className="status">{status}</p>
      <button 
        onClick={handleEndCall} 
        disabled={status === "Idle" || status === "call-ended"} 
        className="end-btn"
      >
        End Call
      </button>
      </div>
      {loading && <Loader/>}
      {status==="call-ended" && score && Object.keys(score).length !== 0 &&<ScoreCard scores={score}/>}
      {status==="Idle"?<Description/>:<div className="message-box">
        {messages.map((msgObj, i) => (
          <p key={i} className={`message ${msgObj.sender === "User" ? "user" : "assistant"}`}>
            {msgObj.sender}: {msgObj.text}
          </p>
        ))}
      
        
      </div>}      
    </div>
  );

}

export default App;
