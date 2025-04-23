"use client";

import { useState, useEffect } from "react";
import { ACTUAL_ANIME_ID } from "./animeShowIDS"; 
import Link from "next/link";

/*
{
  "data": {
    "mal_id": 1,
    "title": "Cowboy Bebop",
    "synopsis": "In the year 2071...",
    "score": 8.77,
    "images": {
      "jpg": {
        "image_url": "https://cdn.myanimelist.net/images/anime/4/19644.jpg"
      }
    },
    "type": "TV",
    "episodes": 26,
    "status": "Finished Airing",
    "rating": "R - 17+ (violence & profanity)"
  }
}
*/

export default function RandomAnimeShow() {
    const [animeList, setAnimeList] = useState([]);

    const fetchAnimeShow = async () => {
        const selectedIds = ACTUAL_ANIME_ID.sort(() => 0.5 - Math.random()).slice(0, 3);

        const animePromises = selectedIds.map(async (id) => {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
            const data = await response.json();
            return data.data || null; 
        });

        const animeResults = await Promise.all(animePromises);

        const validAnimeResults = animeResults.filter((anime) => anime !== null);

        setAnimeList(validAnimeResults);
    };

    useEffect(() => {
        fetchAnimeShow();
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-b from-black via-black to-purple-900 text-white">
            <header className="w-full flex justify-between items-center px-8 py-4">
                <h1 className="text-2xl font-bold">Randomize Anime</h1>
                <Link
                    href="/AnimeGSG"
                    className="text-lg font-semibold text-purple-400 hover:text-red-400 transition duration-300"
                >
                    Guess Anime
                </Link>
            </header>

            <button
                onClick={fetchAnimeShow}
                className="text-lg text-purple-400 hover:text-red-400 hover:underline transition duration-300 mb-6"
            >
                Randomize Anime
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8">
                {animeList.length > 0 ? (
                    animeList.map((anime, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center"
                        >
                            <img
                                src={anime.images.jpg.image_url}
                                alt={anime.title}
                                className="w-200px h-300px object-cover rounded-md mb-4"
                            />
                            <h2 className="text-xl font-bold mb-2">{anime.title}</h2>
                            <p className="text-sm mb-2">Score: {anime.score}</p>
                            <p className="text-sm mb-2">Episodes: {anime.episodes}</p>
                            <p className="text-sm mb-2">
                                Genres: {anime.genres.map((genre) => genre.name).join(", ")}
                            </p>
                            <p className="text-sm text-gray-400 text-center">
                                {anime.synopsis.length > 100
                                    ? `${anime.synopsis.substring(0, 1000)}...`
                                    : anime.synopsis}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-lg text-center">No anime available. Try again later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}