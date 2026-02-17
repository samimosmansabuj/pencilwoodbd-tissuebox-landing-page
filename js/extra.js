// ================= GLOBAL VARIABLES =================
let productUnitPrice = 0; // Number for calculation
let offerActive = false; // Offer OFF by default

// ================= UTILITY =================
function toBanglaNumber(number) {
    const eng = "0123456789";
    const bang = "০১২৩৪৫৬৭৮৯";
    return number.toString().split("").map(d => bang[eng.indexOf(d)] || d).join("");
}

function toEnglishNumber(number) {
    const bang = "০১২৩৪৫৬৭৮৯";
    const eng = "0123456789";
    return number.toString().split("").map(d => eng[bang.indexOf(d)] || d).join("");
}

// ================= PRODUCT FETCH =================
async function loadProduct() {
    try {
        const response = await fetch(`${ENV.API_BASE_URL}/api/product-fetch/${ENV.PRODUCT_LANDING_PAGE_ID}`);
        const response_data = await response.json();
        const data = response_data.data[0];

        // Hero image
        document.getElementById("hero-product-img").src = data.images[0].image;

        // Hero price display in Bangla
        document.querySelectorAll(".product-new-price").forEach(el => {
            el.textContent = toBanglaNumber(Math.floor(data.discount_price));
        });

        // ✅ Number for calculation
        productUnitPrice = Number(data.discount_price);

        // Calculate initial summary
        calculateOrder();

    } catch (e) {
        console.log("Product fetch error:", e);
    }
}

// ================= DISTRICT LOAD =================
function loadDistricts() {
    const districtSelect = document.getElementById("deliverydistrict");

    fetch('https://bdapi.vercel.app/api/v.1/district')
        .then(response => response.json())
        .then(data => {
            if (data.status === 200 && data.success) {
                data.data.forEach(district => {
                    const option = document.createElement('option');
                    option.value = district.name.toLowerCase();
                    option.setAttribute('district_id', district.id);
                    option.textContent = district.bn_name;
                    districtSelect.appendChild(option);
                });
            }
        })
        .catch(error => console.log('Error fetching district:', error));
}

// ================= DELIVERY CHARGE =================
function calculateDeliveryCharge(districtValue) {
    switch (districtValue) {
        case "dhaka":
            return 60;
        case "chattogram":
            return 120;
        default:
            return 150;
    }
}

// ================= CALCULATION =================
function calculateOrder() {
    const qtyInput = document.getElementById("modalQuantity");
    const districtSelect = document.getElementById("deliverydistrict");

    const summarySubBar = document.getElementById("summarySubBar");
    const subEl = document.getElementById("summarySub");
    const discountEl = document.getElementById("summaryDiscount");
    const deliveryEl = document.getElementById("summaryDelivery");
    const totalEl = document.getElementById("summaryTotal");

    let qty = parseInt(qtyInput.value) || 1;
    let subtotal = productUnitPrice * qty;

    let discount = 0;
    let delivery = 0;

    if (districtSelect.value) {
        delivery = calculateDeliveryCharge(districtSelect.value);
    }

    // Offer logic
    if (offerActive) {
        let discountRate = 0;
        if (qty === 2) discountRate = 0.10;
        else if (qty === 3) discountRate = 0.20;
        else if (qty >= 4) discountRate = 0.30;

        discount = Math.round(subtotal * discountRate);

        if (qty >= 4) delivery = 0; // free delivery
    }

    let total = subtotal - discount + delivery;

    // Update UI in Bangla
    summarySubBar.innerText = toBanglaNumber(subtotal);
    subEl.innerText = toBanglaNumber(subtotal);
    discountEl.innerText = toBanglaNumber(discount);
    deliveryEl.innerText = toBanglaNumber(delivery);
    totalEl.innerText = toBanglaNumber(total);

    // Offer section show/hide
    const offerSection = document.getElementById("offerSection");
    if (offerSection) {
        offerSection.style.display = offerActive ? "block" : "none";
    }
}

// ================= QUANTITY CONTROL =================
function setupQuantityButtons() {
    const qtyInput = document.getElementById("modalQuantity");
    const qtyPlus = document.getElementById("qtyPlus");
    const qtyMinus = document.getElementById("qtyMinus");

    qtyPlus.addEventListener("click", () => {
        qtyInput.value = parseInt(qtyInput.value) + 1;
        calculateOrder();
    });

    qtyMinus.addEventListener("click", () => {
        let current = parseInt(qtyInput.value) || 1;
        if (current > 1) {
            qtyInput.value = current - 1;
            calculateOrder();
        }
    });
}

// ================= DISTRICT CHANGE =================
function setupDistrictChange() {
    const districtSelect = document.getElementById("deliverydistrict");
    districtSelect.addEventListener("change", calculateOrder);
}

// ================= OFFER FUNCTIONS =================
function enableOffer() {
    offerActive = true;
    calculateOrder();
}
function disableOffer() {
    offerActive = false;
    calculateOrder();
}
window.enableOffer = enableOffer;
window.disableOffer = disableOffer;

// ================= MODAL OPEN/CLOSE & ORDER =================
function setupModal() {
    const modal = document.getElementById("orderModal");
    const modalOpenBtns = document.querySelectorAll('.btn-order, .btn-order-sm, .btn-order-lg');

    modalOpenBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!modal) return;
            modal.classList.add('show');
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    if (modal) {
        // Close modal click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        // ✅ Confirm Order button with backend save
        modal.addEventListener('click', async (e) => {
            if (e.target && e.target.matches('.btn-order-lg')) {
                e.preventDefault();

                const nameInput = modal.querySelector('#orderName');
                const numberInput = modal.querySelector('#orderPhoneNumber');
                const addressInput = modal.querySelector('#orderAddress');
                const districtSelect = modal.querySelector('#deliverydistrict');
                const qtyInput = modal.querySelector('#modalQuantity');

                [nameInput, numberInput, addressInput].forEach(f => f.style.border = '');

                if (!nameInput.value.trim()) { alert("দয়া করে আপনার নাম লিখুন।"); nameInput.style.border='2px solid red'; nameInput.focus(); return; }
                if (!numberInput.value.trim()) { alert("দয়া করে মোবাইল নাম্বার লিখুন।"); numberInput.style.border='2px solid red'; numberInput.focus(); return; }
                if (!addressInput.value.trim()) { alert("দয়া করে ঠিকানা লিখুন।"); addressInput.style.border='2px solid red'; addressInput.focus(); return; }
                if (!districtSelect.value) { alert("দয়া করে জেলা নির্বাচন করুন।"); districtSelect.style.border='2px solid red'; districtSelect.focus(); return; }

                const subtotal = productUnitPrice * Number(qtyInput.value);
                let discount = 0;
                if (offerActive) {
                    if (qtyInput.value == 2) discount = Math.round(subtotal*0.10);
                    else if (qtyInput.value ==3) discount = Math.round(subtotal*0.20);
                    else if (qtyInput.value >=4) discount = Math.round(subtotal*0.30);
                }
                const delivery = (Number(qtyInput.value) >= 4 && offerActive) ? 0 : calculateDeliveryCharge(districtSelect.value);
                const total = subtotal - discount + delivery;

                const payload = {
                    name: nameInput.value.trim(),
                    phone: numberInput.value.trim(),
                    address: addressInput.value.trim(),
                    district: districtSelect.value,
                    product_id: ENV.PRODUCT_LANDING_PAGE_ID,
                    quantity: Number(qtyInput.value),
                    unit_price: productUnitPrice,
                    subtotal,
                    discount,
                    delivery,
                    total
                };

                // POST to backend
                try {
                    const response = await fetch(`${ENV.API_BASE_URL}/api/landing/tissue-box/order/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const result = await response.json();

                    if (!response.ok) throw new Error(result.message || 'Order failed');

                    // Success UI
                    const modalContent = modal.querySelector('.modal-content');
                    modalContent.innerHTML = `
                        <div style="text-align:center; padding:30px 20px; background:#fff; border-radius:20px;">
                            <h2>ধন্যবাদ!</h2>
                            <p>আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।</p>
                            <p>হোমপেজে রিডিরেক্ট হবে <span id="countdown">10</span> সেকেন্ডে...</p>
                            <a href="https://wa.me/8801775155760" target="_blank" class="btn btn-primary" style="margin-top:20px; display:inline-block;">Contact with WhatsApp</a>
                        </div>
                    `;

                    document.body.style.overflow = 'hidden';

                    let countdown = 10;
                    const countdownEl = document.getElementById("countdown");
                    const interval = setInterval(() => {
                        countdown -= 1;
                        countdownEl.textContent = countdown;
                        if (countdown <= 0) {
                            clearInterval(interval);
                            window.location.href = "/";
                        }
                    }, 1000);

                } catch(err) {
                    alert("Order failed. Please try again.");
                    console.error("Order API error:", err);
                    const btn = e.target;
                    btn.disabled = false;
                    btn.innerText = "Confirm Order (COD)";
                }
            }
        });
    }
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    // Permanent font fix for Bangla ১
    const style = document.createElement('style');
    style.innerHTML = `
        body, .product-new-price, #summarySubBar, #summarySub, #summaryDiscount, #summaryDelivery, #summaryTotal {
            font-family: 'Noto Sans Bengali', sans-serif !important;
        }
    `;
    document.head.appendChild(style);

    loadProduct();
    loadDistricts();
    setupQuantityButtons();
    setupDistrictChange();
    setupModal();
    calculateOrder(); // initial
});
