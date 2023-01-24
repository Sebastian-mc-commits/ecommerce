const handleContent = document.querySelector("#handleContent");

const handleScroll = localStorage.getItem("handleScroll");

if ( handleScroll){
    window.scrollTo({
        top: parseInt(handleScroll),
        left: 0,
        behavior: "smooth"
    });
    localStorage.removeItem("handleScroll");
}

handleContent.addEventListener("click", e => {
    const target = e.target;
    console.log(target);
    if (!target.dataset.cart) return;
    
    const y = e.clientY;
    // const y2 = e.pageY;
    localStorage.setItem("handleScroll", String(y));

    return location.href = `/cart/addToCart/${target.dataset.cart}`;

});