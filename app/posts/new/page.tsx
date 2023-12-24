import React from "react";
import styles from "../../page.module.css";
import { PostContent } from "@/app/components/posts/content";

export default function NewPost() {
  return (
    <main className={styles.main}>
      <div>
        <PostContent addNew />
      </div>
    </main>
  );
}
