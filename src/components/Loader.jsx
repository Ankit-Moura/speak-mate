import "./loader.css"
import { useState, useEffect } from "react";
const Loader = () => {
    const [time, setTime] = useState(30);
    const [interval, setInter] = useState(null);
    useEffect(() => {
        const interval = setInterval(() => {
            setInter(interval);
            setTime((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    if(time<0){
        clearInterval(interval);
    }
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Results 😨...{time>0? time:null}</p>
      </div>
    );
  };
  
  export default Loader;
  