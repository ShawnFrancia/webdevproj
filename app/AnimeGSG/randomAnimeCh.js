// list of popular anime because due to alot of anime within the api some anime characters are missing certain detials
export const POPULAR_ANIME_ID = [
    1,    // Cowboy Bebop
    5,    // Samurai Champloo
    20,   // Naruto
    21,   // One Piece
    30,   // Neon Genesis Evangelion
    199,  // Trigun
    1535, // Death Note
    1575, // Code Geass: Lelouch of the Rebellion
    9253, // Steins;Gate
    11061, // Hunter x Hunter (2011)
    16498, // Attack on Titan
    31964, // My Hero Academia
    32281, // Your Name
    37991, // Demon Slayer: Kimetsu no Yaiba
    38000, // Dr. Stone
    40028, // Jujutsu Kaisen
    40748, // Attack on Titan: The Final Season
    40750, // Redo of Healer
    47917, // Chainsaw Man
    51019, // Spy x Family
    52991, // Frieren: Beyond Journey's End
    15451, // High School DxD
    23233, // The Testament of Sister New Devil
    8074,  // Highschool of the Dead
    7593,  // Kiss x Sis
    31845,
    12549,
    28171, // Shokugeki no Souma (Food Wars)
    30240, // Prison School
    59457, // Rent-a-Girlfriend
    59452, // The Country Bumpkin or RSMT
    52299, // Solo Leveling
    11757,
    48316,
    10793,
    44511,
    30544,
    31338,
    42897,
    14813,
    30015,
    30296,
    40530,
    53111,
    57066,
    37348,
    57181,
    45613,
    49613,
    40496,
    51180,
    51096,
    35507,
    37430,
    39799,
    41461
];
  
export async function getRandomAnimeId() {
    const index = Math.floor(Math.random() * POPULAR_ANIME_ID.length);
    return POPULAR_ANIME_ID[index].toString();
}