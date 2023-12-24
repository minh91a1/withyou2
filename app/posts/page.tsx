import React from "react";
import styles from "../page.module.css";
import { LinksComponent } from "../components/linksComponent";
import { getSSRSession } from "../sessionUtils";
import { PostList } from "../components/posts/list";

export default async function Posts() {
  const { session, hasToken, hasInvalidClaims } = await getSSRSession();

  return (
    <main className={styles.main}>
      <LinksComponent isLogIn={session ? true : false} />
      <div className="max-w-lg">
        <PostList />
      </div>
    </main>
  );
}
