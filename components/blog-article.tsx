import { PageLayout } from "./page-layout";
import type { ReactNode } from "react";
import styles from "./blog-article.module.css";

export default function BlogArticle({ title, children }: { title: string; children: ReactNode }) {
  return <PageLayout className={styles.page}>
    <article className={styles.article}><h1>{title}</h1>{children}</article>
  </PageLayout>;
}
