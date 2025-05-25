import React, { useState } from "react";
import logo from "./logo.png";
import axios from "axios";

import "./App.css";

export default function App() {
  const [username, setUsername] = useState("");
  const [dream, setDream] = useState("");
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!username.trim() || !dream.trim()) {
      setError("Both username and dream are required.");
      return;
    }

    setLoading(true);
    try {
      const userRes = await axios.post("http://localhost:4000/api/user/", { username });
      const userId = userRes.data.userId;

      const dreamRes = await axios.post("http://localhost:4000/api/dream", {
        userId,
        userMessage: dream,
      });

      setInterpretation(dreamRes.data.interpretation);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App container">
      <img src={logo} alt="Logo" className="logo" />

      {!interpretation ? (
        <>
          <h3 className="title">Dream Interpreter</h3>
          <input
            className="input"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <textarea
            className="textarea"
            placeholder="Describe your dream"
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            disabled={loading}
            rows={4}
          />
          {error && <div className="error">{error}</div>}
          <button
            className="button primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Interpreting..." : "Interpret Dream"}
          </button>
        </>
      ) : (
        <>
          <h3 className="title">Interpretation</h3>
          <p className="interpretation">{interpretation}</p>
          <button
            className="button success"
            onClick={() => {
              setInterpretation(null);
              setDream("");
            }}
          >
            Interpret Another Dream
          </button>
        </>
      )}
    </div>
  );
}
