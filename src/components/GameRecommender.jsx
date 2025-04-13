import React, { useState, useRef, useContext } from "react";
import styles from "./GameRecommender.module.css";
import { getSearchGamesEndpoint } from "../api/endpoints";
import { FavoritesContext } from "../store/Favorites/context";
import { addToFavorites } from "../store/Favorites/action";
import { Alert } from "react-bootstrap";

const GameRecommender = () => {
  const [mood, setMood] = useState("");
  const [time, setTime] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [alertMessage, setAlertMessage] = useState("");

  const { favoritesDispatch } = useContext(FavoritesContext);
  const recommendationsRef = useRef(null);

  const normalizeTitle = (title) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "")
      .trim();

  const fetchGameData = async (title) => {
    try {
      const response = await fetch(getSearchGamesEndpoint(title));
      const data = await response.json();
      if (!data.results || data.results.length === 0) return null;

      const normalizedTitle = normalizeTitle(title);

      const match = data.results.find(
        (game) => normalizeTitle(game.name) === normalizedTitle
      );

      const partialMatch = data.results.find((game) =>
        normalizeTitle(game.name).includes(normalizedTitle)
      );

      const fallback = data.results[0];

      const result = match || partialMatch || fallback;

      return {
        id: result.id,
        name: result.name,
        image: result.background_image,
        rating: result.rating,
      };
    } catch (error) {
      console.error("Error fetching game data:", error);
      return null;
    }
  };

  const extractTitle = (desc) => {
    const quotedMatch = desc.match(/"(.+?)"/);
    if (quotedMatch) return quotedMatch[1];

    const fallbackMatch = desc.match(/^\s*([\w\s!:+&.'-]{3,40})\s+-/);
    if (fallbackMatch) return fallbackMatch[1].trim();

    return desc.split(" ").slice(0, 5).join(" ").trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendations([]);
    setVisibleCount(3);

    try {
      const response = await fetch("/.netlify/functions/gameRecommender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, time, genre }),
      });

      const data = await response.json();
      const parsed = data.result
        .split(/\d+\.\s+/)
        .filter((r) => r.trim() !== "");

      const enriched = await Promise.all(
        parsed.map(async (desc) => {
          const title = extractTitle(desc);
          const game = await fetchGameData(title);

          if (!game || normalizeTitle(game.name) !== normalizeTitle(title)) {
            return null;
          }

          return {
            title: desc.trim(),
            id: game?.id || null,
            image: game?.image || "",
            name: game?.name || title,
            rating: game?.rating || null,
          };
        })
      );

      const validRecommendations = enriched.filter(Boolean);
      setRecommendations(validRecommendations);

      setVisibleCount(
        validRecommendations.length >= 3 ? 3 : validRecommendations.length
      );

      setTimeout(() => {
        if (recommendationsRef.current) {
          recommendationsRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error) {
      console.error("AI function error:", error);
      setRecommendations([
        { title: "An error occurred. Please try again.", id: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMood("");
    setTime("");
    setGenre("");
    setRecommendations([]);
    setVisibleCount(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleAddToFavorites = (game) => {
    favoritesDispatch(addToFavorites(game));
    setAlertMessage(`Product successfully added to Favorites!`);

    setTimeout(() => setAlertMessage(""), 2500);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>AI Game Recommendations</h2>

      <form onSubmit={handleSubmit}>
        <label className={styles.formLabel}>Mood *</label>
        <input
          className={styles.input}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="relaxed, competitive..."
        />

        <label className={styles.formLabel}>Available Time *</label>
        <input
          className={styles.input}
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="30 min, 2 hours..."
        />

        <label className={styles.formLabel}>Preferred Genre *</label>
        <input
          className={styles.input}
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="puzzle, racing..."
        />

        <button className={styles.button} disabled={loading}>
          {loading ? "Generating..." : "Generate Recommendations"}
        </button>
      </form>

      {alertMessage && (
        <Alert variant="danger" className="alert">
          {alertMessage}
        </Alert>
      )}

      {recommendations.length > 0 && (
        <div ref={recommendationsRef} className={styles.cards}>
          {recommendations
            .filter((rec) => rec.id)
            .slice(0, visibleCount)
            .map((rec, idx) => (
              <div key={idx} className={styles.card}>
                <h5 className={styles.cardTitle}>
                  <span role="img" aria-label="video game controller">
                    🎮
                  </span>{" "}
                  Game {idx + 1}
                </h5>

                <p className={styles.cardText}>{rec.title}</p>
                <div className={styles.cardButtons}>
                  <a
                    href={`/GamesDetails/${rec.id}`}
                    className={styles.detailsButton}
                  >
                    View Details
                  </a>
                  <button
                    className={styles.favButton}
                    onClick={() =>
                      handleAddToFavorites({
                        id: rec.id,
                        image: rec.image,
                        title: rec.name,
                        rating: rec.rating,
                      })
                    }
                  >
                    Add to Favorites
                  </button>
                </div>
              </div>
            ))}

          <div className={styles.actionsContainer}>
            <button
              type="button"
              className={styles.resetButton}
              onClick={handleReset}
            >
              Reset
            </button>
            {visibleCount < recommendations.filter((r) => r.id).length && (
              <button
                type="button"
                className={styles.showMoreButton}
                onClick={handleShowMore}
              >
                Show More
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameRecommender;
