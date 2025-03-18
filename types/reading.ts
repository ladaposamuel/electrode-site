export type ContentItem = {
  title: string;
  url: string;
  type: 'article' | 'tweet' | 'video' | 'resource' | 'tool';
  author?: string;
  date: string;
  notes?: string;
};

export type ReadingData = {
  reading: ContentItem[];
  watching: ContentItem[];
};
