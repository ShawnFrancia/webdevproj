"use client";

import { useState, useEffect } from "react";
import { getFirstLetterHint } from "./hint";
import { getRandomAnimeId } from "./randomAnimeCh";
import Link from "next/link";
import Image from "next/image"; 

async function fetchCharacterData(animeId) {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
  if (!response.ok) throw new Error("Failed to get character data from the API");
  const { data } = await response.json();

  const acharacters = data.filter((char) => char.role === "Main" && char.character.images?.jpg?.image_url);
  const animech = acharacters.length ? acharacters : data.filter((char) => char.character.images?.jpg?.image_url);

  if (!animech.length) throw new Error("No characters with image");

  const random = animech[Math.floor(Math.random() * animech.length)];
  const animeResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
  const animeData = await animeResponse.json();

  if (!animeData.data || !animeData.data.title) {
    throw new Error("Failed to get anime title from the API");
  }

  return {
    id: random.character.mal_id,
    fullName: random.character.name.replace(/,/g, ""),
    image: random.character.images.jpg.image_url,
    anime: animeData.data.title,
  };
}

export default function AnimeGuesser() {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null);
  const [showFirstLetterHint, setShowFirstLetterHint] = useState(false);
  const [showAnimeHint, setShowAnimeHint] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);

  const spiltFullName = (fullName) =>
    fullName.toLowerCase().replace(/,/g, "").trim().split(/\s+/);

  const namesMatch = (firstName, lastName) => {
    const characterFirstName = spiltFullName(firstName);
    const characterLastName = spiltFullName(lastName);
    if (characterFirstName.length !== characterLastName.length) {
      return characterFirstName.join(" ") === characterLastName.join(" ");
    }
    return (
      characterFirstName.every((chname) => characterLastName.includes(chname)) &&
      characterLastName.every((chname) => characterFirstName.includes(chname))
    );
  };

  const fetchRandomCharacter = async () => {
    try {
      setLoading(true);
      setResult(null);
      setGuess("");
      setShowFirstLetterHint(false);
      setShowAnimeHint(false);
      setError(null);

      const animeId = await getRandomAnimeId();
      const data = await fetchCharacterData(animeId);
      setCharacter(data);
    } catch (err) {
      setError("Failed to load a character. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomCharacter();
  }, []);

  const handleGuess = () => {
    if (!character) return;
    const isCorrect = namesMatch(guess, character.fullName);
    setResult(isCorrect ? "correct" : "incorrect");
    if (isCorrect) setScore((prev) => prev + 1);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-black via-black to-purple-900 text-white">

      <header className="w-full flex justify-between items-center px-8 py-2">
      <Link href="/" className="text-2xl font-bold text-white">AnimeGS</Link>
        <p className="text-lg font-semibold text-white">Score: {score}</p>
      </header>

      <main className="flex flex-col items-center justify-start flex-grow w-full text-center mt-4">
        <h2 className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-400">
          Guess the Character
        </h2>

        <button
          onClick={fetchRandomCharacter}
          className="text-sm text-purple-400 hover:text-red-400 hover:underline mb-4 transition duration-300"
        >
          New Character
        </button>

        {error && <p className="text-red-500 font-semibold">{error}</p>}

        {loading ? (
          <p className="text-lg font-semibold animate-pulse">😳 chotto matte kudasai im just getting a character for you</p>
        ) : character ? (
          <>
            {character.image && (
              <div className="relative mb-4">
                <Image
                  src={character.image}
                  alt="Character"
                  width={250} 
                  height={350}
                  className="object-cover rounded-lg shadow-lg border-4 border-purple-500"
                  style={{ width: '250px', height: '350px' }} 
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent rounded-lg"></div>
              </div>
            )}

            {result === "correct" && (
              <p className="text-green-400 text-xl font-bold mb-4 animate-bounce">
                 Correct! The character is {character.fullName} from {character.anime}.
              </p>
            )}
            {result === "revealed" && (
              <p className="text-yellow-400 text-xl font-bold mb-4">
                 It is acthally {character.fullName} from {character.anime} バカバカバカバカ.
              </p>
            )}
            {result === "incorrect" && (
              <p className="text-red-400 text-xl font-bold mb-4">
                 バカ野郎! Try again or give up, but deku never gave up to become the number one hero so you shouldnt aswell min'na-san.
              </p>
            )}

            <div className="mb-4 flex items-center">
              <input
                type="text"
                value={guess}
                onChange={(event) => setGuess(event.target.value)}
                disabled={result === "correct" || result === "revealed"}
                className="p-3 w-300px rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 mr-3"
                placeholder="Enter your guess..."
              />
              <button
                onClick={handleGuess}
                disabled={!guess || result === "correct" || result === "revealed"}
                className="text-purple-400 hover:text-red-400 transition duration-300 disabled:opacity-50"
              >
                Submit
              </button>
            </div>

            {result === "incorrect" && (
              <button
                onClick={() => {
                  setResult("revealed");
                  setScore(0);
                }}
                className="text-red-500 hover:text-red-600 transition duration-300 mb-4"
              >
                Reveal Name
              </button>
            )}

            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setShowFirstLetterHint(true)}
                className="text-purple-400 hover:text-red-400 hover:underline transition duration-300 text-lg px-6 py-2"
              >
                First Letter Hint
              </button>
              <button
                onClick={() => setShowAnimeHint(true)}
                className="text-purple-400 hover:text-red-400 hover:underline transition duration-300 text-lg px-6 py-2"
              >
                Anime Title Hint
              </button>
            </div>

            <div className="mt-4">
              {showFirstLetterHint && (
                <p
                  className="text-black font-semibold p-3 rounded-md text-center underline decoration-white"
                  style={{ textShadow: "0 1px 3px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.5)" }}
                >
                  First Letters: {getFirstLetterHint(character.fullName)}
                </p>
              )}
              {showAnimeHint && (
                <p
                  className="text-black font-semibold p-3 rounded-md mt-2 text-center underline decoration-white"
                  style={{ textShadow: "0 1px 3px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.5)" }}
                >
                  From Anime: {character.anime}
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-lg font-semibold">Character not loaded</p>
        )}
      </main>

      <footer className="w-full p-4 text-center text-white">
        <p>Anime Guessing Game Project</p>
      </footer>
    </div>
  );
}