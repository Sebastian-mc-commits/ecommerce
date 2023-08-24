// import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Filters, NotFound, PageLayout, PaginationBar } from "@/components";
import Link from "next/link";
import { useRouter } from "next/router";
import buildServerUrl from "@/utils/const/serverUrls";
import { useEffect } from "react";
import { toast } from "react-toastify";
// const inter = Inter({ subsets: ["latin"] });
export default function Home({
  products,
  pagination,
  paginationProvided,
  productFound,
  cookie
}) {
  const router = useRouter();
  useEffect(() => {
    const { message = "" } = router.query;
    if (message) {
      toast.warn(message);
      router.push(
        {
          pathname: router.pathname
        },
        undefined,
        {
          shallow: true
        }
      );
    }
  }, [router]);
  const handlerAddToCart = (_id) => {
    console.log("target");
    console.log(_id);
  };

  const onHandleFiltersSubmit = (event, types) => {
    event.preventDefault();
    const data = new FormData(event.target);

    router.push(
      buildServerUrl({
        useServerUrl: false,
        url: [router.pathname],
        params: {
          ...Object.fromEntries(data),
          ...(types.length > 0
            ? { types: types.map(({ value }) => value).join(",") }
            : {})
        }
      })
    );
  };

  const handleNavigation = (pageSelected) => {
    router.push(`${router.pathname}?page=${pageSelected}`);
  };

  const handleSetDefaultFilters = (e) => {
    e.preventDefault();
    router.push(router.pathname);
  };

  return (
    <>
      <PageLayout useDefaultStyles={false}>
        <Filters
          onHandleFiltersSubmit={onHandleFiltersSubmit}
          handleSetDefaultFilters={handleSetDefaultFilters}
        />
        <h1>Hello fellas :D</h1>
        <h2>Cookie? {cookie ? "Cookie got :D" : "Cookie Not Got :("}</h2>

        <div className={`${styles.productContainer} container grid`}>
          {productFound ? (
            products.map((p) => {
              const { _id, title, price, thumbnail, stock, description } = p;

              const truncatedDescription =
                description.slice(0, 40) +
                (description.length > 40 ? "..." : "");

              return (
                <div className={styles.productContent} key={_id}>
                  <div className={styles.imgContainer}>
                    <Link href={`/${_id}`}>
                      <img src={thumbnail} alt={title} />
                    </Link>
                  </div>
                  <p className="gray">{truncatedDescription}</p>
                  <h1 className="title">{title}</h1>
                  <p>
                    Price: <span className={styles.price}>${price}</span>
                  </p>
                  <p>Stock: {stock}</p>

                  <div className={styles.productButtons}>
                    <button
                      className={styles.buttonCart}
                      onClick={() => handlerAddToCart(_id)}
                    >
                      Add to Cart
                    </button>
                    <Link href="/purchase">
                      <button className={styles.buttonBuy}>Purchase</button>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <NotFound
              message={`We're sorry, but we could not find any products that match 
              your search criteria. Please try modifying your search by adjusting 
              the filters or entering different search terms. You may also want to 
              consider broadening your search by removing some filters or using more 
              general keywords. If you need further assistance, please contact our 
              support team.`}
            />
          )}
        </div>

        {paginationProvided && (
          <PaginationBar {...pagination} navigate={handleNavigation} />
        )}
      </PageLayout>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { page = 1, ...filters } = query;
  let params = "";
  if (Object.values(filters)) {
    params = (await import("querystring")).stringify({
      ...filters
    });
  }

  const {
    products,
    pagination = {},
    cookie = false
  } = await fetch(
    buildServerUrl({
      url: ["home", "getProductsAndPagination"],
      params: {
        ...(page ? { page } : {})
      },
      paramsAsString: params
    })
  ).then((result) => result.json());

  return {
    props: {
      products,
      productFound: typeof products !== "undefined" && products.length > 0,
      paginationProvided:
        typeof pagination !== "undefined" &&
        Object?.values(pagination).length > 0,
      pagination,
      cookie
    }
  };
}

// const urls = [
//   `${serverUrl}/home/getProductsAndPagination?${
//     params ? params : `page=${page}`
//   }`,
//   `${serverUrl}/home/getAvailableCategories`,
//   `${serverUrl}/home/getMaxPrice`
// ];

// const [productsData, { categories }, { maxPrice }] = await Promise.all(
//   urls.map((url) => {
//     return fetch(url).then((response) => response.json());
//   })
// );
