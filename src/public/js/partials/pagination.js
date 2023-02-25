let HTML = "";
let i = paginationOptions.page < 3 ? 1 : paginationOptions.page - 2;
let condition = paginationOptions.page < 3 ? 5 : paginationOptions.page + 2;

for (i; i <= condition; i++) {
  HTML += i === paginationOptions.page ? `<p class="pageSelected">${i}</p>` : `<p>${i}</p>`;
  if (i === paginationOptions.totalPages) break;
}

HTML = `
${paginationOptions.hasPrevPage ? "<button data-prev>&#8592;</button>" : ""}
${HTML}
${paginationOptions.hasNextPage ? "<button data-next>&#8594;</button>" : "<span>...</span>"}
`;

pagination.insertAdjacentHTML("afterbegin", HTML);

pagination.addEventListener("click", e => {
  const target = e.target;
  let selectedPage;

  if (target.nodeName === "P") {
    selectedPage = target.textContent;
  } else if (target.nodeName === "BUTTON") {
    selectedPage = target.hasAttribute("data-prev") ? paginationOptions.prevPage : paginationOptions.nextPage;
  }
  else return;

  return location.href = `/home?page=${selectedPage}`;
});