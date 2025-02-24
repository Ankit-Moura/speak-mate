import { useEffect } from "react"
import {start, endCall} from "./ai"

function App() {
  useEffect(()=>{
    start().then(console.log("hey"));
  }, [])
  return (
    <>
    <h2>Hey welcome to Speak Mate!</h2>
    </>
)}

export default App
