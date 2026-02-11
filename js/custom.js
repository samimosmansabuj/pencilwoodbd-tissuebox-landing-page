// ========================== CUSTOM JS FOR TISSUE BOX ==========================
document.addEventListener("DOMContentLoaded", () => {

    const UNIT_PRICE = 500;
    const qtyInput = document.getElementById("modalQuantity");
    const plusBtn = document.getElementById("qtyPlus");
    const minusBtn = document.getElementById("qtyMinus");
    const districtSelect = document.getElementById("modalDistrict");

    const subEl = document.getElementById("summarySub");
    const discountEl = document.getElementById("summaryDiscount");
    const deliveryEl = document.getElementById("summaryDelivery");
    const totalEl = document.getElementById("summaryTotal");
    const barTotal = document.getElementById("barTotal");

    const modal = document.getElementById('orderModal');
    const openBtns = document.querySelectorAll('.btn-order, .btn-order-sm, .btn-order-lg');
    const closeBtn = modal ? modal.querySelector('.btn-close, .close-btn') : null;

    const offerSection = document.getElementById("offerSection");
    const offer2 = document.querySelector('.offer-card:nth-child(1)');
    const offer3 = document.querySelector('.offer-card:nth-child(2)');
    const offer4 = document.querySelector('.highlight-offer');
    const offerSoft = document.querySelector('.soft-offer');

    // ---------------- Offer Control ----------------
    let offerActive = false; // offer on krte hoile only do true 
    if(offerSection) offerSection.style.display = offerActive ? "block" : "none";

    function enableOffer() {
        offerActive = true;
        if(offerSection) offerSection.style.display = "block";
        calculateOrder(); 
    }

    // ---------------- Quantity & Summary ----------------
    function calculateOrder() {
        let qty = parseInt(qtyInput.value) || 1;
        let subtotal = UNIT_PRICE * qty;

        let discount = 0;
        let delivery = parseInt(districtSelect.value) || 0;

        if(offerActive){ 
            let discountRate = 0;
            if (qty === 2) discountRate = 0.10;
            else if (qty === 3) discountRate = 0.20;
            else if (qty >= 4) discountRate = 0.30;

            discount = Math.round(subtotal * discountRate);
            if(qty >= 4) delivery = 0; // free delivery
        }

        let total = subtotal - discount + delivery;

        subEl.innerText = "৳" + subtotal;
        discountEl.innerText = "৳" + discount;
        deliveryEl.innerText = "৳" + delivery;
        totalEl.innerText = "৳" + total;
        barTotal.innerText = "৳" + total;

        // ---------------- Offer cards opacity ----------------
        if(offerActive){ 
            if(qty >= 4){
                offer2.style.opacity = 0.3;
                offer3.style.opacity = 0.3;
                offer4.style.opacity = 1;
                offerSoft.style.opacity = 1;
            } else if(qty === 3){
                offer2.style.opacity = 1;
                offer3.style.opacity = 1;
                offer4.style.opacity = 0.3;
                offerSoft.style.opacity = 0.3;
            } else if(qty === 2){
                offer2.style.opacity = 1;
                offer3.style.opacity = 0.3;
                offer4.style.opacity = 0.3;
                offerSoft.style.opacity = 0.3;
            } else {
                offer2.style.opacity = 0.3;
                offer3.style.opacity = 0.3;
                offer4.style.opacity = 0.3;
                offerSoft.style.opacity = 0.3;
            }
        } else { 
            
            offer2.style.opacity = 0.3;
            offer3.style.opacity = 0.3;
            offer4.style.opacity = 0.3;
            offerSoft.style.opacity = 0.3;
        }
    }

    // ---------------- Quantity buttons ----------------
    plusBtn.replaceWith(plusBtn.cloneNode(true));
    minusBtn.replaceWith(minusBtn.cloneNode(true));
    const newPlusBtn = document.getElementById("qtyPlus");
    const newMinusBtn = document.getElementById("qtyMinus");

    newPlusBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let current = parseInt(qtyInput.value) || 1;
        qtyInput.value = current + 1;
        calculateOrder();
    });

    newMinusBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let current = parseInt(qtyInput.value) || 1;
        if(current > 1){
            qtyInput.value = current - 1;
            calculateOrder();
        }
    });

    districtSelect.addEventListener("change", calculateOrder);
    calculateOrder();

    // ---------------- Modal Open/Close ----------------
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if(!modal) return;
            modal.classList.add('show');
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    if(closeBtn){
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    if(modal){
        modal.addEventListener('click', (e) => {
            if(e.target === modal){
                modal.classList.remove('show');
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // ---------------- Order Form Submission ----------------
    if(modal){
        modal.addEventListener('click', async (e) => {
            if(e.target && e.target.matches('.btn-order-lg')){
                e.preventDefault();

                const nameInput = modal.querySelector('#orderName');
                const numberInput = modal.querySelector('#orderPhoneNumber');
                const addressInput = modal.querySelector('#orderAddress');

                [nameInput, numberInput, addressInput].forEach(f => { f.style.border = ''; });

                if(!nameInput.value.trim()){
                    alert("দয়া করে আপনার নাম লিখুন।");
                    nameInput.style.border = '2px solid red';
                    nameInput.focus();
                    return;
                }
                if(!numberInput.value.trim()){
                    alert("দয়া করে মোবাইল নাম্বার লিখুন।");
                    numberInput.style.border = '2px solid red';
                    numberInput.focus();
                    return;
                }
                if(!addressInput.value.trim()){
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
                    if(countdown <= 0){
                        clearInterval(interval);
                        window.location.href = "/";
                    }
                }, 1000);
            }
        });
    }

    // ---------------- Expose function globally ----------------
    window.enableOffer = enableOffer; 
});
