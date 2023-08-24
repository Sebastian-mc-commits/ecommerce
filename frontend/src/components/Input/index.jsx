import React from "react";
import styles from "./Input.module.css";

export default function Input({
  htmlFor,
  labelTitle,
  error,
  hasError,
  optionalErrorMessageStyles = "",
  ...props
}) {
  return (
    <label className={styles.inputLabel} htmlFor={htmlFor}>
      <span>{labelTitle}</span>
      <input {...props} />

      {hasError && (
        <p className={[styles.errorMessage, optionalErrorMessageStyles].join(" ")}>
          <strong>Error:</strong> {error}
        </p>
      )}
    </label>
  );
}
