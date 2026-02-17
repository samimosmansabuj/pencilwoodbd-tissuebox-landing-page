// *** Fetch the landing page product from api ***
(async function () {
    try {
        const response = await fetch(`${ENV.API_BASE_URL}/api/product-fetch/${ENV.PRODUCT_LANDING_PAGE_ID}`);
        const response_data = await response.json();
        const data = response_data.data[0];

        document.getElementById("hero-product-img").src = data.images[0].image;
        // document.querySelectorAll(".product-old-price").forEach(el => {
        //     el.textContent = toBanglaNumber(Math.floor(data.price));
        // });
        document.querySelectorAll(".product-new-price").forEach(el => {
            el.textContent = Math.floor(data.discount_price);
        })
        document.getElementById("summarySubBar").textContent = data.discount_price
        // FacebookViewContentEvent(data.name, data.discount_price, data.id)
    } catch (e) {
        console.log("Product fetch errro:", e);
    }
})();
// ------------------------------------------END------------------------------------------------