// src/lib/api.ts

import { client } from "./sanity";
import { streamQuery, articleQuery, slugsQuery } from "./queries";

export interface ArticleDetail {
  title:        string;
  excerpt?:     string;
  content?:     any[];
  publishedAt?: string;
  tags?:        string[];
  readingTime:  number;
}

// 🔥 generische fetch funktion
export async function sanityFetch<T>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, any>;
}): Promise<T> {
  return client.fetch(query, params);
}

export async function getStream() {
  return sanityFetch({
    query: streamQuery,
  });
}

export async function getArticle(slug: string) {
  return sanityFetch<ArticleDetail>({
    query: articleQuery,
    params: { slug },
  });
}

export async function getAllSlugs() {
  return sanityFetch<string[]>({
    query: slugsQuery,
  });
}