import { ReadingData } from "@/types/reading";

export const readingData: ReadingData = {
  reading: [
    {
      title: "Example Article",
      url: "https://example.com/article",
      type: "article",
      author: "John Doe",
      date: "2025-03-18",
      notes: "Interesting take on modern web development",
    },
  ],
  watching: [
    {
      title: "Vibe Coding Is The Future",
      url: "https://www.youtube.com/watch?v=IACHfKmZMr8",
      type: "video",
      author: "Y Combinator",
      date: "2025-03-18",
      notes:
        "Andrej Karpathy recently coined the term “vibe coding” to describe how LLMs are getting so good that devs can simply “give in to the vibes, embrace exponentials, and forget that the code even exists.” We dive into this new way of programming and what it means for builders in the age of AI.",
    },

    {
      title: "How DeepSeek Rewrote the Transformer [MLA]",
      url: "https://www.youtube.com/watch?v=0VLAoVGf_74",
      type: "video",
      author: "Welch Labs",
      date: "2025-03-18",
      notes:
        "quite intresting AI deepdive explaining how and why DeepSeek's changes to the architechure result in such an incredible performance AND efficency improvement ",
    },
  ],
};
