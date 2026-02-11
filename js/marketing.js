// ========================== MARKETING JS FOR TISSUE BOX ==========================

// ---------------- Facebook Pixel Functions ----------------
function FacebookViewContentEvent() {
    const productPriceEl = document.getElementById("summaryTotal");
    if (!productPriceEl || typeof fbq !== 'function') return;

    const totalValue = parseFloat(productPriceEl.textContent.replace(/[^0-9.]/g, "")) || 0;

    fbq('track', 'ViewContent', {
        content_ids: ["tissuebox-001"],
        content_name: "Pencilwood Tissue Box",
        content_type: 'product',
        value: totalValue,
        currency: 'BDT'
    });
}
FacebookViewContentEvent();

function FacebookAddToCartEvent() {
    const productPriceEl = document.getElementById("summaryTotal");
    if (!productPriceEl || typeof fbq !== 'function') return;

    const value = parseFloat(productPriceEl.textContent.replace(/[^0-9.]/g, "")) || 0;

    fbq('track', 'AddToCart', {
        content_ids: ["tissuebox-001"],
        content_name: "Pencilwood Tissue Box",
        content_type: 'product',
        value: value,
        currency: 'BDT'
    });
}

function FacebookInitiateCheckEvent() {
    const productPriceEl = document.getElementById("summaryTotal");
    if (!productPriceEl || typeof fbq !== 'function') return;

    const value = parseFloat(productPriceEl.textContent.replace(/[^0-9.]/g, "")) || 0;
    const qty = parseInt(document.getElementById("modalQuantity")?.value) || 1;
    const subtotal = parseFloat(document.getElementById("summarySub")?.textContent.replace(/[^0-9.]/g, "")) || 0;

    fbq('track', 'InitiateCheckout', {
        contents: [{
            id: "tissuebox-001",
            name: "Pencilwood Tissue Box",
            quantity: qty,
            price: subtotal
        }],
        content_type: 'product',
        value: value,
        currency: 'BDT'
    });
}

function FacebookPurchaseEvent() {
    const productPriceEl = document.getElementById("summaryTotal");
    if (!productPriceEl || typeof fbq !== 'function') return;

    const totalValue = parseFloat(productPriceEl.textContent.replace(/[^0-9.]/g, "")) || 0;
    const qty = parseInt(document.getElementById("modalQuantity")?.value) || 1;
    const subtotal = parseFloat(document.getElementById("summarySub")?.textContent.replace(/[^0-9.]/g, "")) || 0;

    fbq('track', 'Purchase', {
        value: totalValue,
        currency: 'BDT',
        contents: [{
            id: "tissuebox-001",
            name: "Pencilwood Tissue Box",
            quantity: qty,
            price: subtotal
        }],
        content_type: 'product',
        compared_product: 'recommended-banner-tissue',
        delivery_category: 'home_delivery'
    });
}

// ---------------- Event Hooks ----------------
document.querySelectorAll(".btn-order, .btn-order-sm, .btn-order-lg").forEach(btn => {
    btn.addEventListener("click", () => {
        FacebookAddToCartEvent();
    });
});

const orderFormBtn = document.querySelector("#orderModal .btn-order-lg");
if (orderFormBtn) {
    orderFormBtn.addEventListener("click", () => {
        FacebookInitiateCheckEvent();

        setTimeout(() => {
            FacebookPurchaseEvent();
        }, 2000);
    });
}
