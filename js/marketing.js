// ==================================================================================================
// *********//////////====Facebook Pixel and Event Tracking Function=====/////////////***************

// View Content Event Tracking Function ========== 
function FacebookViewContentEvent(productName, productPrice, productIds) {
    if (typeof fbq !== 'function') return;
    fbq('track', 'ViewContent', {
        content_ids: [String(productIds)],
        content_name: productName,
        content_type: 'product',
        value: parseFloat(productPrice || 0),
        currency: 'BDT'
    });
}
function FacebookAddToCartEvent(content_ids, content_name, value) {
    if (typeof fbq !== 'function') return;
    fbq('track', 'AddToCart', {
        content_ids: [String(content_ids)],
        content_name: content_name,
        content_type: 'product',
        value: value,
        currency: 'BDT'
    });
}

function GAInitiateCheckoutEvent(products, total) {
    if (!products?.length) return;
    items = products.map(p => ({
        item_id: p.id,
        item_name: p.name,
        price: parseFloat(p.price),
        quantity: p.quantity
    }))

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
            currency: "BDT",
            value: Number(total),
            items: items
        }
    });
}

function GAInitiatePurchaseEvent(products, total) {
    if (!products?.length) return;
    const items = products.map(p => ({
        item_id: p.id,
        item_name: p.name,
        price: parseFloat(p.price),
        quantity: p.quantity
    }));

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: "purchase",
        ecommerce: {
            currency: "BDT",
            value: Number(total),
            items: items
        },
    });
}

// *********//////////=========================/////////////***************
// =========================================================================
