"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { PostType } from "../common/type/posts";

interface PostState {
  page: number;
  posts: PostType[];
  changePage: (page: number) => void;
  setPosts: (posts: PostType[]) => void;
}

export const usePostStore = create<PostState>()(
  devtools(
    persist(
      (set) => ({
        page: 0,
        posts: [],
        changePage: (page) => set((state) => ({ ...state, page })),
        setPosts: (posts) => set((state) => ({ ...state, posts })),
      }),
      {
        name: "bear-storage",
      }
    )
  )
);
