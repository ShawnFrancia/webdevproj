"use client"

import { useState, useEffect } from "react"
import { getFirstLetterHint } from "./hint" 
import { getRandomAnimeId } from "./randomAnimeCh"  


async function fetchCharacterData(animeId) {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`);
  if (!response.ok) throw new Error("Failed to get character data from the API");
  const { data } = await response.json();

  const main = data.filter((char) => char.role === "Main" && char.character.images?.jpg?.image_url);
  const animech = main.length ? main : data.filter((char) => char.character.images?.jpg?.image_url);

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
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [guess, setGuess] = useState("")
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)
  const [showFirstLetterHint, setShowFirstLetterHint] = useState(false)
  const [showAnimeHint, setShowAnimeHint] = useState(false)
  const [error, setError] = useState(null)

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
      setLoading(true)
      setResult(null)
      setGuess("")
      setShowFirstLetterHint(false)
      setShowAnimeHint(false)
      setError(null)

      const animeId = await getRandomAnimeId() 
      const data = await fetchCharacterData(animeId)
      setCharacter(data)
    } catch (err) {
      setError("Failed to load a character. Try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

 
  useEffect(() => {
    fetchRandomCharacter()
  }, [])

  
  const handleGuess = () => {
    if (!character) return
    const isCorrect = namesMatch(guess, character.fullName)
    setResult(isCorrect ? "correct" : "incorrect")
    if (isCorrect) setScore((prev) => prev + 1)
  }

  return (
    <div>
      <h2>Guess the Character</h2>
      <p>Score: {score}</p>

      {error && <p>{error}</p>}

      {loading ? (
        <p>Loading character...</p>
      ) : character ? (
        <>
          {character.image && <img src={character.image} alt="Character" />}
          <input
            type="text"
            value={guess}
            onChange={(event) => setGuess(event.target.value)}
            disabled={result === "correct" || result === "revealed"}
          />
          <button onClick={handleGuess} disabled={!guess || result === "correct" || result === "revealed"}>
            Submit
          </button>
          <button onClick={fetchRandomCharacter}>New Character</button>

          {result === "incorrect" && (
            <>
              <p>Incorrect. Guess again or reveal name.</p>
              <button onClick={() => {setResult("revealed"); setScore(0);}}>Show Name</button>
            </>
          )}

          {result === "correct" && <p>Correct The character is {character.fullName} from {character.anime}</p>}
          {result === "revealed" && <p>Character is {character.fullName} and is from the Anime called {character.anime}.</p>}

          <div>
            <button
              onClick={() => setShowFirstLetterHint(true)}
            >
              First Letter Hint
            </button>
            <button
              onClick={() => setShowAnimeHint(true)}
            >
              Anime Title Hint
            </button>

            {showFirstLetterHint && <p>First Letters: {getFirstLetterHint(character.fullName)}</p>}
            {showAnimeHint && <p>From Anime: {character.anime}</p>}
          </div>
        </>
      ) : (
        <p>Character not loaded</p>
      )}
    </div>
  )
}
