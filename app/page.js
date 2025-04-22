import Link from 'next/link';
import RandomAnimeShow from './homepage_components/randomAnimeShow'; // Ensure the correct path to RandomAnimeShow

export default function Page() {
  return (
    <main>
      <RandomAnimeShow />
      <p>
        <Link href="/AnimeGSG">Anime Guessing Game</Link>
      </p>
    </main>
  );
}