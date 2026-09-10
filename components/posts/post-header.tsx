import { PostDate } from "./post-date";
import styles from "./post-header.module.css";

export function PostHeader({ title, writtenOn }: { title: string; writtenOn?: string }) {
  return <header className={styles.header}>
    <h1 className={styles.title}>{title}</h1>
    <PostDate date={writtenOn} />
  </header>;
}
