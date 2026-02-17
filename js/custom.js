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
            el.textContent = toBanglaNumber(Math.floor(data.discount_price));
        })
        const UNIT_PRICE = data.discount_price;
        const LANDING_PAGE_PRODUCT = data
        // FacebookViewContentEvent(data.name, data.discount_price, data.id)
    } catch (e) {
        console.log("Product fetch errro:", e);
    }
})();

const productUnitPrice = document.querySelector(".product-new-price").textContent
console.log("productUnitPrice: ", productUnitPrice)
// ------------------------------------------END------------------------------------------------

// *** Convert the number bangla into english or english into bangla ***
function toBanglaNumber(number) {
    const eng = "0123456789";
    const bang = "০১২৩৪৫৬৭৮৯";
    return number.toString().split("").map(d => bang[eng.indexOf(d)] || d).join("");
};
function toEnglishNumber(number) {
    const bang = "০১২৩৪৫৬৭৮৯";
    const eng = "0123456789";
    return number.toString().split("").map(d => eng[bang.indexOf(d)] || d).join("");
};
// -----------------------------------------END-------------------------------------------------


// *** District List Fetch ***
const districtSelect = document.getElementById("deliverydistrict");
fetch('https://bdapi.vercel.app/api/v.1/district').then(response => response.json()).then(data => {
    if (data.status === 200 && data.success) {
        data.data.forEach(district => {
            const option = document.createElement('option')
            option.value = district.name.toLowerCase()
            option.setAttribute('district_id', district.id);
            option.textContent = district.bn_name
            districtSelect.appendChild(option)
        });
    }
})
    .catch(error => console.log('Error fetching district:', error))
// ----------------------------------------END--------------------------------------------------


// ========================== CUSTOM JS FOR TISSUE BOX ==========================
document.addEventListener("DOMContentLoaded", () => {
    // Quantity Section 
    const qtyInput = document.getElementById("modalQuantity");
    const newPlusBtn = document.getElementById("qtyPlus");
    const newMinusBtn = document.getElementById("qtyMinus");

    // Summary Section 
    const productUnitPrice = document.querySelector(".product-new-price").textContent
    const summarySubBar = document.getElementById("summarySubBar");
    const subEl = document.getElementById("summarySub");
    const discountEl = document.getElementById("summaryDiscount");
    const deliveryEl = document.getElementById("summaryDelivery");
    const totalEl = document.getElementById("summaryTotal");

    // Modal Section 
    const orderModal = document.getElementById('orderModal');
    const modalOpenBtns = document.querySelectorAll('.btn-order, .btn-order-sm, .btn-order-lg');

    // Offer Section
    const offerSection = document.getElementById("offerSection");
    const offer2 = document.querySelector('.offer-card:nth-child(1)');
    const offer3 = document.querySelector('.offer-card:nth-child(2)');
    const offer4 = document.querySelector('.highlight-offer');
    const offerSoft = document.querySelector('.soft-offer');

    // ---------------- Offer Control ----------------
    let offerActive = false; // offer on krte hoile only do true 
    if (offerSection) offerSection.style.display = offerActive ? "block" : "none";

    function enableOffer() {
        offerActive = true;
        if (offerSection) offerSection.style.display = "block";
        calculateOrder();
    }

    // *** Quantity & Summary ***
    function calculateDeliveryCharge(districtValue) {
        switch (districtValue.value) {
            case "dhaka":
                return 60;
            case "chattogram":
                return 120;
            default:
                return 150;
        }
    }
    function calculateOrder() {
        let qty = parseInt(qtyInput.value) || 1;
        let subtotal = productUnitPrice * qty;

        let discount = 0;
        let delivery = 0;
        console.log("districtSelect.value: ", districtSelect.value)
        if (districtSelect.value) {
            delivery = calculateDeliveryCharge(districtSelect.value);
        }

        if (offerActive) {
            let discountRate = 0;
            if (qty === 2) discountRate = 0.10;
            else if (qty === 3) discountRate = 0.20;
            else if (qty >= 4) discountRate = 0.30;

            discount = Math.round(subtotal * discountRate);
            if (qty >= 4) delivery = 0; // free delivery
        }

        let total = subtotal - discount + delivery;

        summarySubBar.innerText = subtotal;
        subEl.innerText = subtotal;
        discountEl.innerText = discount;
        deliveryEl.innerText = delivery;
        totalEl.innerText = total;
        

        // ---------------- Offer cards opacity ----------------
        // if (offerActive) {
        //     if (qty >= 4) {
        //         offer2.style.opacity = 0.3;
        //         offer3.style.opacity = 0.3;
        //         offer4.style.opacity = 1;
        //         offerSoft.style.opacity = 1;
        //     } else if (qty === 3) {
        //         offer2.style.opacity = 1;
        //         offer3.style.opacity = 1;
        //         offer4.style.opacity = 0.3;
        //         offerSoft.style.opacity = 0.3;
        //     } else if (qty === 2) {
        //         offer2.style.opacity = 1;
        //         offer3.style.opacity = 0.3;
        //         offer4.style.opacity = 0.3;
        //         offerSoft.style.opacity = 0.3;
        //     } else {
        //         offer2.style.opacity = 0.3;
        //         offer3.style.opacity = 0.3;
        //         offer4.style.opacity = 0.3;
        //         offerSoft.style.opacity = 0.3;
        //     }
        // } else {

        //     offer2.style.opacity = 0.3;
        //     offer3.style.opacity = 0.3;
        //     offer4.style.opacity = 0.3;
        //     offerSoft.style.opacity = 0.3;
        // }
    }
    // ----------------------------------------END--------------------------------------------------

    // ---------------- Quantity buttons ----------------
    newPlusBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let current = parseInt(qtyInput.value) || 1;
        qtyInput.value = current + 1;
        calculateOrder();
    });

    newMinusBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let current = parseInt(qtyInput.value) || 1;
        if (current > 1) {
            qtyInput.value = current - 1;
            calculateOrder();
        }
    });

    districtSelect.addEventListener("change", calculateOrder);
    calculateOrder();



    const ApiFetch = async (url, { method = 'GET', body, headers = {} } = {}) =>
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', ...headers },
            body: body ? JSON.stringify(body) : undefined
        })
            .then(r => r.ok ? r.json() : Promise.reject(r))
            .catch(err => { console.log('API error:', err); return null; });

    // *** Modal Open/Close ***
    modalOpenBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const data = await ApiFetch(`${ENV.API_BASE_URL}/api/product-fetch/${ENV.PRODUCT_LANDING_PAGE_ID}`);
            products = data.data[0]
            if (!orderModal) return;
            orderModal.classList.add('show');
            orderModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    if (orderModal) {
        orderModal.addEventListener('click', (e) => {
            if (e.target === orderModal) {
                orderModal.classList.remove('show');
                orderModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    // ----------------------------------------END--------------------------------------------------

    // *** Order Form Submission ***
    if (orderModal) {
        orderModal.addEventListener('click', async (e) => {
            if (e.target && e.target.matches('.btn-order-lg')) {
                e.preventDefault();

                const nameInput = modal.querySelector('#orderName');
                const numberInput = modal.querySelector('#orderPhoneNumber');
                const addressInput = modal.querySelector('#orderAddress');

                [nameInput, numberInput, addressInput].forEach(f => { f.style.border = ''; });

                if (!nameInput.value.trim()) {
                    alert("দয়া করে আপনার নাম লিখুন।");
                    nameInput.style.border = '2px solid red';
                    nameInput.focus();
                    return;
                }
                if (!numberInput.value.trim()) {
                    alert("দয়া করে মোবাইল নাম্বার লিখুন।");
                    numberInput.style.border = '2px solid red';
                    numberInput.focus();
                    return;
                }
                if (!addressInput.value.trim()) {
                    alert("দয়া করে ঠিকানা লিখুন।");
                    addressInput.style.border = '2px solid red';
                    addressInput.focus();
                    return;
                }

                const btn = e.target;
                btn.disabled = true;
                btn.innerText = 'Processing...';

                await new Promise(resolve => setTimeout(resolve, 2000));

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
            }
        });
    }
    // ----------------------------------------END--------------------------------------------------


    // ---------------- Expose function globally ----------------
    window.enableOffer = enableOffer;
});
