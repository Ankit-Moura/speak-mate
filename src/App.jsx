import { useEffect, useRef, useState } from "react";
import { start, endCall, vapi, getScore } from "./ai";
import ScoreCard from "./components/ScoreCard";

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
    <>
      <h2>Hey, welcome to Speak Mate!</h2>
      <p>Status: {status}</p>
      <button onClick={handleStartCall} disabled={status !== "Idle" && status !== "call-ended"}>
        Start Call
      </button>
      <button onClick={handleEndCall} disabled={status === "Idle" || status === "call-ended"}>
        End Call
      </button>
      {loading && <h3>Grading your exam, hold up...</h3>}
      {score && Object.keys(score).length !== 0 && <ScoreCard scores={score} />}
      <div>
        {messages.map((msgObj, i) => (
          <p key={i}>{msgObj.sender}: {msgObj.text}</p>
        ))}
      </div>
    </>
  );
}

export default App;
