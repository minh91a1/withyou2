"use client";

import React, { useEffect, useState } from "react";
import { PostType } from "@/app/common/type/posts";
import { useRouter } from "next/navigation";

import { usePostStore } from "@/app/stores/post";
import { Navigation } from "./navigation";
import { Button } from "@/components/ui/button";

import { PencilSquareIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import { api_endpoint } from "@/app/common/constants";
import Image from "next/image";

async function getPosts({ page, limit }: { page: number; limit: number }) {
  const offset = page * limit;
  const response = await fetch(
    `${api_endpoint}/post?offset=${offset}&limit=${limit}&searchKey=&tags=[]`
  ); // Parse the JSON

  if (response.status !== 200) {
    return [];
  }
  const posts = await response.json();
  return posts as PostType[];
}

export const PostList = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { page, posts, changePage, setPosts } = usePostStore();

  const totalPage = 100;

  const onChangePage = (dir: number) => {
    let newPage = page + dir;
    if (newPage < 0) {
      newPage = 0;
    }
    changePage(newPage);
  };

  const onSelectChanged = (value: string) => {
    changePage(parseInt(value));
  };

  const onClickPost = (post?: PostType) => {
    if (post) {
      router.push(`/posts/${post.id}`);
    } else {
      router.push(`/posts/new`);
    }
  };

  const init = async () => {
    const newPosts = await getPosts({ page, limit: 8 });
    setPosts(newPosts);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      init();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, page]);

  if (!isClient) {
    return <>Loading...</>;
  }

  return (
    <div style={{ width: 500 }} className="relative">
      <div className="mb-20">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="img-wrap m-4 p-3 h-20  rounded overflow-hidden shadow-md  cursor-pointer bg-slate-50 hover:bg-slate-200"
            onClick={() => onClickPost(post)}
          >
            <div className="img-container h-20 w-20 overflow-hidden outline-1 outline-gray-600">
              <Image
                className="object-cover h-20 w-20"
                src={
                  post.imagePath
                    ? `${api_endpoint}/${post.imagePath}`
                    : `${api_endpoint}/images/1672642014952_082cs1de4j96uq4g27d0kg.png`
                }
                alt="post-image"
              ></Image>
            </div>

            {/* <div className="object-cover w-full h-8 img-cover bg-slate-950"></div> */}

            <div className="relative ml-20 line-clamp-2">
              <span>{post.title}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2 justify-between fixed z-10 page-navigator-bar rounded-xl bg-white p-2 shadow-2xl">
        <Button>
          <FaceSmileIcon className="h-5 w-5" />
        </Button>
        <Navigation
          page={page}
          totalPage={100}
          onChangePage={onChangePage}
          onSelectChanged={onSelectChanged}
        />
        <Button onClick={() => onClickPost()}>
          <PencilSquareIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
