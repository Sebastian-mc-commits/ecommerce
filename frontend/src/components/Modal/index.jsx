import styles from "./Modal.module.css";

export default function Modal({
  modalHeaderTitle,
  children,
  showModal,
  handleClose,
  zIndex,
  handleDataRetrievalComplete,
  handleModalClose
}) {
  const handleDataRetrievalModalComplete = () => {
    Promise.all([handleDataRetrievalComplete(), handleClose()]);
  };
  return (
    <>
      {showModal && (
        <div
          className={styles.overlay}
          style={{
            zIndex
          }}
        ></div>
      )}
      <section
        className={styles.modal}
        style={{
          transform: `translate(-50%, -50%) scale(${showModal ? 1 : 0})`,
          zIndex: zIndex + 1
        }}
      >
        <div className={styles.modalHeader}>
          <h3>{modalHeaderTitle}</h3>
          <button className={styles.closeButton} onClick={() => {
            Promise.all([
              handleModalClose(),
              handleClose()
            ])
          }}>
            X
          </button>
        </div>
        <div>{children}</div>
        <div className={styles.modalFooter}>
          <button
            className={styles.modalButtonDone}
            onClick={handleDataRetrievalModalComplete}
          >
            Done
          </button>
        </div>
      </section>
    </>
  );
}
