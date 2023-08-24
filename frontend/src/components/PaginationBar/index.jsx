import React from "react";
import styles from "./PaginationBar.module.css";

export default function PaginationBar({
  totalPages,
  page,
  hasPrevPage,
  hasNextPage,
  navigate,
  prevPage,
  nextPage
}) {
  let displayPages = page <= 3 ? 1 : page - 2;
  let pages = [];
  let iterator = 0;
  while (iterator < 5) {
    pages.push(displayPages + iterator);
    if (displayPages + iterator >= totalPages) break;
    iterator++;
  }

  return (
    <div className={styles.pagination}>
      {hasPrevPage && (
        <button
          className={styles.prevButton}
          onClick={() => navigate(prevPage)}
        >
          &#8592;
        </button>
      )}
      {pages.map((pageNested) => (
        <span
          key={pageNested}
          className={pageNested === page ? styles.pageSelected : ""}
          onClick={() => navigate(pageNested)}
        >
          {pageNested}
        </span>
      ))}

      {hasNextPage ? (
        <button
          className={styles.nextButton}
          onClick={() => navigate(nextPage)}
        >
          &#8594;
        </button>
      ) : (
        <span>...</span>
      )}
    </div>
  );
}
