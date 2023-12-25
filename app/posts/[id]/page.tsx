"use client";

import React, { useEffect, useState } from "react";
import styles from "../../page.module.css";
import { PostContent } from "@/app/components/posts/content";
import { PostType } from "@/app/common/type/posts";
import { api_endpoint } from "@/app/common/constants";

/* api */
async function getPostDetail(id: string) {
  const response = await fetch(`${api_endpoint}/post/${id}`);
  const post = await response.json();
  return post[0] as PostType;
}

type PostDetailProps = {
  params: any;
};

export default function EditPost({ params }: PostDetailProps) {
  const [post, setPost] = useState<PostType>();
  const init = async () => {
    const post = await getPostDetail(params.id);
    setPost(post);
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={styles.main}>
      <div>
        <PostContent post={post} />
      </div>
    </main>
  );
}
