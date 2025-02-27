import "./scoreCard.css"

export default function ScoreCard({ scores }) {
    if (!scores) {
      return <p className="no-scores">No scores available.</p>;
    }
  
    return (
      <div className="score-card">
        <h2 className="score-title">Score Summary</h2>
        <div className="score-list">
          <p><span>Pronunciation:</span> {scores.pronunciation}</p>
          <p><span>Vocabulary:</span> {scores.Vocabulary}</p>
          <p><span>Grammar:</span> {scores.Grammar}</p>
          <p><span>Fluency:</span> {scores.Fluency}</p>
        </div>
      </div>
    );
  }
  
