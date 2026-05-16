// src/types/content.ts

export type Micro = {
  _type: "micro";
  text: string;
  publishedAt: string;
};

export type Photo = {
  _type: "photo";
  imageUrl: string;
  caption?: string;
  publishedAt: string;
};

export type Article = {
  _type: "article";
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
};

export type StreamItemType = Micro | Photo | Article;