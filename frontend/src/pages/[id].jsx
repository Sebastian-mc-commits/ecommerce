import { NotFound, PageLayout } from "@/components";
import buildServerUrl from "@/utils/const/serverUrls";
import styles from "@/styles/RenderProduct.module.css";

export default function Product({ product }) {
  const {
    thumbnail,
    code,
    price,
    status,
    stock,
    description,
    categoryType,
    comments,
    title
  } = product;

  const handleProductPriceInput = ({ target }) => {
    if (+target.value >= +stock) {
      target.value = stock;
    } else if (+target.value <= 0) {
      target.value = 1;
    }
  };

  return (
    <PageLayout>
      <div className="container">
        <div className={styles.renderProductContainer}>
          <div className={styles.imgProductContainer}>
            <img src={thumbnail} alt={title} />
          </div>
          <div className={styles.renderProductContainerValues}>
            <div>
              <h1>{title}</h1>
              <p>
                Price <span className={styles.productPrice}>${price}</span>
              </p>
              <p>
                Code <span>{code}</span>
              </p>
              <p>
                Status<span>{status}</span>
              </p>
              <p>
                Stock<span>{stock}</span>
              </p>
              <label htmlFor="">
                <input
                  type="number"
                  defaultValue={1}
                  onChange={handleProductPriceInput}
                  className={styles.productQuantityRequired}
                />
              </label>
            </div>
            <button className={styles.buttonBuy}>Buy Product</button>
          </div>
        </div>

        <div className={styles.descriptionProductContainer}>
          <h3>{categoryType}</h3>
          <p>
            <strong>Description</strong>
            {description}
          </p>
        </div>

        <form className={styles.rateProductContainer}>
          <h3>Rate {title}</h3>

          <div>
            {Array.from({ length: 5 }, (_, index) => (
              <label htmlFor={index + 1} key={index}>
                <span>{index + 1}</span>
                <input type="radio" value={index + 1} name="productRate" />
              </label>
            ))}
          </div>

          <textarea
            className={styles.productCommentInput}
            name="comment"
            placeholder="Your opinion make us growth"
            rows="10"
          />

          <button>Send</button>
        </form>

        <div className={styles.renderProductCommentContainer}>
          <h2>Comments of {title}</h2>

          <ul>
            {comments.length ? (
              comments.map(({ rate, message, userCreator, _id }) => {
                const { name, image, last_name } = userCreator;

                return (
                  <li
                    key={_id}
                    className={`${styles.renderProductComment} card`}
                  >
                    <div className={styles.renderProductCommentUser}>
                      <img src={image} alt={name} />
                      <p>
                        <strong>{name}</strong> {last_name}
                      </p>
                    </div>

                    <div className={styles.renderProductCommentRate}>
                      <h4>Rate: {rate}</h4>
                      <p>{message}</p>
                    </div>
                  </li>
                );
              })
            ) : (
              <NotFound
                message={`Thank you for considering our product. 
            We value your opinion and would love to hear your thoughts 
            on it. If you decide to make a purchase, please consider 
            leaving a review or rating to help other customers make an 
            informed decision. We strive to provide the best possible 
            experience for our customers and appreciate your feedback.`}
              />
            )}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}

export async function getServerSideProps({ params }) {
  const product = await fetch(
    buildServerUrl("home", "getProductById", params.id)
  ).then((response) => response.json());

  return {
    props: {
      product
    }
  };
}
