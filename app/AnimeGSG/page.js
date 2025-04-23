import AnimeGuesser from "./animeGuesser";

export default function AnimeGuessPage() {
  return (
    <main className="min-h-screen w-full bg-black">
      <AnimeGuesser />
    </main>
  );
}
// can make the guesser harder by including the all different character and not just main character.
  //const acharacters = data.filter((char) => char.character.images?.jpg?.image_url);