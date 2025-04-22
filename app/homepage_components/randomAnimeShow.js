"use client";

import { useState, useEffect } from "react";
import { ACTUAL_ANIME_ID } from "./animeShowIDS"; // Corrected import

export default function RandomAnimeShow() {
    const [animeList, setAnimeList] = useState([]);

    const fetchAnimeShow = async () => {
        const selectedIds = ACTUAL_ANIME_ID.sort(() => 0.5 - Math.random()).slice(0, 3);

        const animePromises = selectedIds.map(async (id) => {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
            const data = await response.json();
            return data.data || null; // Return the anime data or null if it doesn't exist
        });

        const animeResults = await Promise.all(animePromises);

        // Filter out any null or undefined results
        const validAnimeResults = animeResults.filter((anime) => anime !== null);

        setAnimeList(validAnimeResults);
    };

    useEffect(() => {
        fetchAnimeShow();
    }, []);

    return (
        <div>
            <button
                onClick={fetchAnimeShow}
                style={{
                    padding: "10px 20px",
                    marginBottom: "20px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Randomize Anime
            </button>
            {animeList.length > 0 ? (
                animeList.map((anime, index) => (
                    <div key={index} style={{ marginBottom: "20px" }}>
                        <h2>{anime.title}</h2>
                        <p>Score: {anime.score}</p>
                        <p>{anime.synopsis}</p>
                        <p>Genres: {anime.genres.map((genre) => genre.name).join(", ")}</p>
                        <p>Type: {anime.type}</p>
                        <p>Episodes: {anime.episodes}</p>
                        <img src={anime.images.jpg.image_url} alt={anime.title} style={{ maxWidth: "200px" }} />
                    </div>
                ))
            ) : (
                <p>No anime available. Please try again later.</p>
            )}
        </div>
    );
}