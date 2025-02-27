export default function ScoreCard({scores}){
    if (!scores) {
        return <p>No scores available.</p>; 
    }

    return (
        <div>
            <h2>Score Summary</h2>
            <p>Pronunciation: {scores.pronunciation}</p>
            <p>Vocabulary: {scores.Vocabulary}</p>
            <p>Grammar: {scores.Grammar}</p>
            <p>Fluency: {scores.Fluency}</p>
        </div>
    );
}
