import React, { useRef, useState } from "react";
import styles from "./Filters.module.css";
import { Loader, Modal } from "..";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetcher } from "@/utils/functions/fetcher";
import buildServerUrl from "@/utils/const/serverUrls";

export default function Filters({
  onHandleFiltersSubmit,
  handleSetDefaultFilters
}) {
  let { data: categories, error: categoriesError } = useSWR(
    buildServerUrl({
      url: ["home", "getAvailableCategories"]
    }),
    fetcher,
    {
      refreshInterval: 60 * 60 * 1000
    }
  );

  if (categories) {
    categories = categories.categories;
  }

  let { data: maxPrice } = useSWR(
    buildServerUrl({
      url: ["home", "getMaxPrice"]
    }),
    fetcher,
    {
      refreshInterval: 60 * 60 * 1000
    }
  );

  if (maxPrice) {
    maxPrice = maxPrice.maxPrice;
  }

  const router = useRouter();
  const { sort, minPrice = 0, maxPrice: maxPriceState = 0 } = router.query;
  const [priceRange, setPriceRange] = useState({
    minPrice,
    maxPrice: maxPriceState
  });

  const [hideFilters, setHideFilters] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const checkedCategories = useRef([]);
  const modalItemsRef = useRef();

  const handleChangePriceValue = ({ target }, type) => {
    setPriceRange((prev) => {
      return {
        ...prev,
        [type]: target.value
      };
    });
  };

  const handleDataRetrievalComplete = () => {
    if (checkedCategories.current.length) {
      checkedCategories.current = checkedCategories.current.map((el) => {
        return {
          ...el,
          saved: true
        };
      });
    }

    setSelectedCategories(checkedCategories.current);
  };

  const onHandleChangeCategoryItem = (event, value) => {
    const includeValue = checkedCategories.current.findIndex(
      (el) => el.value === value
    );

    if (event.target.checked && includeValue === -1) {
      checkedCategories.current.push({
        value,
        saved: false
      });
    } else if (includeValue !== -1) {
      checkedCategories.current.splice(includeValue, 1);
    }
  };

  const onHandleUnSetCategoryItem = (value) => {
    const child = Array.from(
      modalItemsRef.current.querySelectorAll("input[type='checkbox']")
    ).find((target) => target.id === value);
    if (!child) return;

    child.checked = false;

    const parseArray = checkedCategories.current.filter(
      (el) => el.value !== value
    );
    console.log("parseArray");
    console.log(parseArray);
    checkedCategories.current = parseArray;
    setSelectedCategories(parseArray);
  };

  const handleModalClose = () => {
    if (!checkedCategories.current.length) return;

    const children = Array.from(
      modalItemsRef.current.querySelectorAll("input[type='checkbox']")
    );

    for (let { value } of checkedCategories.current) {
      const index = checkedCategories.current.findIndex(
        (el) => el.value === value && !el.saved
      );
      if (index === -1) continue;

      const child = children.find((target) => target.id === value);
      child.checked = !child.checked;
    }
    checkedCategories.current = checkedCategories.current.filter(
      (category) => category.saved
    );
    setSelectedCategories(checkedCategories.current);
  };
  return (
    <>
      <Modal
        handleClose={() => {
          setShowModal(false);
        }}
        handleDataRetrievalComplete={handleDataRetrievalComplete}
        modalHeaderTitle="Categories"
        showModal={showModal}
        zIndex={10}
        handleModalClose={handleModalClose}
      >
        <div ref={modalItemsRef} className={styles.modalContent}>
          {typeof categories !== "undefined" &&
            !categoriesError &&
            categories.length !== 0 &&
            categories.map((categoryType) => {
              const inputValue = categoryType.replace(/\s+/g, "+");
              return (
                <label key={categoryType} htmlFor={categoryType}>
                  <p>{categoryType}</p>
                  <input
                    type="checkbox"
                    id={categoryType}
                    onChange={(event) =>
                      onHandleChangeCategoryItem(event, categoryType)
                    }
                    value={inputValue}
                  />
                </label>
              );
            })}
        </div>
      </Modal>
      <span
        className={`${styles.buttonHideFiltersForm} ${
          hideFilters && styles.buttonHideFiltersFormRotate
        }`}
        onClick={() => setHideFilters(!hideFilters)}
      >
        ⬅️
      </span>
      <form
        className={`${styles.formDesign} ${hideFilters && styles.hideForm}`}
        onSubmit={(event) => onHandleFiltersSubmit(event, selectedCategories)}
      >
        <label htmlFor="sortBy" className={styles.orderBy}>
          <span>Sort By </span>
          <select name="sort" id="sortBy" defaultValue={sort}>
            <option value="">Select an option</option>
            <option value="title 1">Ascendent</option>
            <option value="title -1">Descendent</option>
            <option value="price -1">Highest Price</option>
            <option value="price 1">Lowest Price</option>
          </select>

          {Object.values(router.query).length > 0 && (
            <button
              className={styles.closeButton}
              onClick={handleSetDefaultFilters}
            >
              X
            </button>
          )}
        </label>

        <div className={styles.selectedCategories}>
          {selectedCategories.length > 0 &&
            selectedCategories.map(({ value }) => {
              return (
                <p key={value} onClick={() => onHandleUnSetCategoryItem(value)}>
                  {value}
                </p>
              );
            })}
        </div>

        <label htmlFor="minPriceRange">
          <span>Min Price</span>
          <input
            type="range"
            id="minPriceRange"
            name="minPrice"
            max={maxPrice || 100}
            defaultValue={0}
            onChange={(event) => handleChangePriceValue(event, "minPrice")}
          />
          <span className={styles.rangeValue}>{priceRange.minPrice}</span>
        </label>

        <label htmlFor="maxPriceRange">
          <span>Max Price</span>
          <input
            type="range"
            id="maxPriceRange"
            max={maxPrice || 100}
            name="maxPrice"
            defaultValue={0}
            onChange={(event) => handleChangePriceValue(event, "maxPrice")}
          />
          <span className={styles.rangeValue}>{priceRange.maxPrice}</span>
        </label>

        {typeof categories !== "undefined" &&
        !categoriesError &&
        categories.length ? (
          <button
            onClick={(event) => {
              event.preventDefault();

              setShowModal(true);
            }}
            className={styles.categoriesButton}
          >
            Categories
          </button>
        ) : (
          <Loader />
        )}
        <input
          type="submit"
          className={styles.submitButton}
          value="Apply Filters"
        />
      </form>
    </>
  );
}
