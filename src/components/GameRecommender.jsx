import React, { useState, useContext } from "react";
import styles from "./GameRecommender.module.css";
import { FavoritesContext } from "../store/Favorites/context";
import { addToFavorites } from "../store/Favorites/action";
import { Alert, Spinner } from "react-bootstrap";

const GameRecommender = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [aiMessage, setAiMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const { favoritesDispatch } = useContext(FavoritesContext);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSend = async () => {
    if (!userMessage.trim()) return;
    setLoading(true);
    setRecommendations([]);
    setAiMessage("");

    try {
      const response = await fetch("/.netlify/functions/gameRecommender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!Array.isArray(data.result)) {
        throw new Error("Invalid AI response format");
      }

      setAiMessage(data.aiMessage || "");
      setRecommendations(data.result);
    } catch (err) {
      console.error("Error:", err);
      setRecommendations([
        { id: null, title: "Oops! Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearResponse = () => {
    setAiMessage("");
    setRecommendations([]);
    setUserMessage("");
  };

  const handleAddToFavorites = (game) => {
    favoritesDispatch(addToFavorites(game));
    setAlertMessage(`Game added to Favorites!`);
    setTimeout(() => setAlertMessage(""), 2500);
  };

  return (
    <>
      <button onClick={toggleChat} className={styles.chatToggle}>
        {isOpen ? "Close Chat" : "Chat with AI 🎮"}
      </button>

      {isOpen && (
        <div className={styles.chatboxWrapper}>
          <div className={styles.chatbox}>
            {(aiMessage || recommendations.length > 0 || loading) && (
              <div className={styles.messages}>
                {loading ? (
                  <div className={styles.message}>
                    <Spinner animation="border" size="sm" /> Generating...
                  </div>
                ) : (
                  <>
                    {aiMessage && (
                      <div className={styles.message}>
                        <p className={styles.aiMessage}>{aiMessage}</p>
                      </div>
                    )}

                    {recommendations.map((rec, idx) => (
                      <div key={idx} className={styles.message}>
                        <div className={styles.recommendationColumn}>
                          <span className={styles.gameTitle}>{rec.title}</span>
                          {rec.image && (
                            <img
                              src={rec.image}
                              alt={rec.title}
                              className={styles.thumbnailCentered}
                            />
                          )}
                          {rec.id && (
                            <button
                              onClick={() =>
                                handleAddToFavorites({
                                  id: rec.id,
                                  title: rec.title,
                                  image: rec.image,
                                  rating: rec.rating,
                                })
                              }
                              className={styles.favButton}
                            >
                              ❤️ Add to Favorites
                            </button>
                          )}
                        </div>
                        {rec.description && (
                          <p className={styles.description}>
                            {rec.description}
                          </p>
                        )}
                      </div>
                    ))}

                    {(aiMessage || recommendations.length > 0) && (
                      <button
                        onClick={handleClearResponse}
                        className={styles.clearButton}
                      >
                        Clear Response
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            <div className={styles.inputWrapper}>
              <input
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Ask me..."
                className={styles.chatInput}
              />
              <button onClick={handleSend} className={styles.sendButton}>
                Send
              </button>
            </div>

            {alertMessage && (
              <Alert variant="success" className={styles.alert}>
                {alertMessage}
              </Alert>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GameRecommender;
