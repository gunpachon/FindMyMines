import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const randomChoice = Math.floor(Math.random() * 5);

  return {
    currentUser: {
      name: ["Ideal", "Gun", "Wave", "Fin", "Ling ling"][randomChoice],
      profile: "moodeng",
    },
  };
};
