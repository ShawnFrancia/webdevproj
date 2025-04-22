// list of popular anime because due to alot of anime within the api some anime characters are missing certain detials
export const POPULAR_ANIME_ID = [
    1, 5, 20, 21, 30, 199, 1535, 1575, 9253, 11061, 16498, 31964, 
    32281, 37991, 38000, 40028, 40748, 47917, 51019, 52991
];
  
export async function getRandomAnimeId() {
    const index = Math.floor(Math.random() * POPULAR_ANIME_ID.length);
    return POPULAR_ANIME_ID[index].toString();
}
