import React, { useState } from "react";
import axios from "axios";

function Chat() {
  const [character, setCharacter] = useState("woman");
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [userMessage, setUserMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [imagePromptContext, setImagePromptContext] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newMessage = { role: "user", content: userMessage };
    setMessages([...messages, newMessage]);
    try {
      const response = await axios.post("http://localhost:3001/chat", {
        character,
        timeOfDay,
        userMessage,
        context: messages,
        imagePromptContext,
      });
      const assistantMessage = {
        role: "assistant",
        content: response.data?.chatResponse,
      };
      const newImagePromptContext = {
        role: "assistant",
        content: response.data?.imagePrompt,
      };
      setImagePromptContext([...imagePromptContext, newImagePromptContext]);
      setMessages([...messages, newMessage, assistantMessage]);
      setChatResponse(response.data?.chatResponse);
      setImage(response.data.imageResponse);
      setFormSubmitted(true);
      setUserMessage("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCharacter("woman");
    setTimeOfDay("morning");
    setUserMessage("");
    setChatResponse("");
    setImage("");
    setFormSubmitted(false);
    setMessages([]);
    setImagePromptContext([]);
  };

  console.log(`messages: ${JSON.stringify(messages)}`);
  console.log(`imagePromptContext: ${JSON.stringify(imagePromptContext)}`);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <h3 className="text-center mb-4">AI Chatbot Wife</h3>

          {!formSubmitted && (
            <>
              <div className="mb-3">
                <label htmlFor="characterSelect" className="form-label">
                  Character
                </label>
                <select
                  id="characterSelect"
                  className="form-select"
                  value={character}
                  onChange={(e) => setCharacter(e.target.value)}
                >
                  <option value="woman">Woman</option>
                  <option value="cat woman">Cat Woman</option>
                  <option value="dog woman">Dog Woman</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="timeOfDaySelect" className="form-label">
                  Time of Day
                </label>
                <select
                  id="timeOfDaySelect"
                  className="form-select"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                >
                  <option value="morning">Morning</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </select>
              </div>
            </>
          )}

          {loading && (
            <div className="d-flex justify-content-center mt-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!loading && chatResponse && (
            <div className="mt-4">
              <div className="d-flex justify-content-start mb-2">
                <div className="card bg-light w-75">
                  <div className="card-body">
                    <p className="card-text">{chatResponse}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && image && (
            <div className="d-flex justify-content-end mb-2">
              <div className="card bg-info w-75">
                <div className="card-body text-white">
                  <img
                    src={`data:image/png;base64,${image}`}
                    alt="AI Response"
                    className="img-fluid rounded"
                  />
                </div>
              </div>
            </div>
          )}

          <div className={`mb-3 ${formSubmitted ? "mt-4" : ""}`}>
            <label htmlFor="userMessage" className="form-label">
              Your Message
            </label>
            <input
              type="text"
              id="userMessage"
              className="form-control"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            className="btn btn-primary w-100 mb-3"
            onClick={handleSubmit}
            disabled={loading || !userMessage}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Send Message"
            )}
          </button>

          {formSubmitted && (
            <button className="btn btn-secondary w-100" onClick={handleReset}>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
