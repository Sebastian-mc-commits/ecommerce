import styles from "./NotFound.module.css";

export default function NotFound({ message }) {
  return (
    <div className={styles.notFoundContainer}>
      <p className={styles.notFoundMessage}>{message}</p>
    </div>
  );
}
