const ADJECTIVES = [
  "Witty",
  "Cheesy",
  "Speedy",
  "Fuzzy",
  "Cranky",
  "Angry",
  "Evil",
  "Loving",
  "Flying",
];
const ANIMALS = [
  "Unicorn",
  "Koala",
  "Llama",
  "Tiger",
  "Penguin",
  "Monkey",
  "Owl",
  "Duck",
];

export const getRoomId = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const rand = Math.floor(Math.random() * 1000);

  const roomName = `${adj} ${animal} ${rand}`;
  const roomId = crypto.randomUUID();

  return {
    roomName,
    roomId,
  };
};
