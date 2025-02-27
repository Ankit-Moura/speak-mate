# Speak Mate

Speak Mate is an AI-powered conversational assistant that enables real-time voice interactions. It allows users to engage in meaningful conversations with an AI and receive performance scores based on the conversation.

## Features
- **Real-time Voice Conversations**: Speak with an AI assistant in real-time.
- **Speech Recognition & Response**: The assistant listens and responds naturally.
- **Automatic Scoring**: Evaluates and scores the conversation after the call ends.
- **Start & End Call Controls**: Easily initiate and stop interactions.

## Tech Stack
- **Frontend**: React, Vite, Hooks (useState, useEffect)
- **Backend API**: Vapi AI API (for speech and scoring)
- **Styling**: CSS

## Installation

1. Clone the repository:

2. Set up environment variables:
   Create a `.env` file and add your API keys:
   ```env
   VITE_public_key=your-public-key
   VITE_private_key=your-private-key
   VITE_agent_id=your-agent-id
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
- Click **Start Call** to begin a conversation.
- Speak with the AI and receive responses in real-time.
- Click **End Call** to stop the conversation.
- The AI will analyze the conversation and provide a score.

## Folder Structure
```
/speak-mate
│-- /src
│   │-- /components
│   │   ├── ScoreCard.jsx  # Displays conversation score
│   │-- App.jsx            # Main application logic
│   │-- ai.js              # Handles API interactions
│-- .env                   # Environment variables (not committed)
│-- package.json           # Dependencies & scripts
│-- README.md              # Project documentation
```

## Troubleshooting
- **Call not starting?** Ensure your API keys are correct.
- **Score not showing?** Check the console for API errors.
- **UI not updating?** Try refreshing or clearing the cache.

## Future Improvements
- Add authentication for personalized experiences.
- Implement multilingual support.
- Enhance AI response accuracy and scoring.

## Contributing
Pull requests are welcome! If you'd like to contribute, please fork the repo and create a feature branch.

---
**Made with ❤️ using React & Vapi.Ai**

