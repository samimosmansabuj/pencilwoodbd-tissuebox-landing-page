// const UNIT_PRICE = 500;

// const qtyInput = document.getElementById("modalQuantity");
// const plusBtn = document.getElementById("qtyPlus");
// const minusBtn = document.getElementById("qtyMinus");
// // const districtSelect = document.getElementById("modalDistrict");

// const subEl = document.getElementById("summarySub");
// const discountEl = document.getElementById("summaryDiscount");
// const deliveryEl = document.getElementById("summaryDelivery");
// const totalEl = document.getElementById("summaryTotal");
// const barTotal = document.getElementById("barTotal");

// function calculateOrder() {
//   let qty = parseInt(qtyInput.value);

//   // Subtotal
//   let subtotal = UNIT_PRICE * qty;

//   // Discount logic
//   let discountRate = 0;
//   if (qty === 2) discountRate = 0.10;
//   else if (qty === 3) discountRate = 0.20;
//   else if (qty >= 4) discountRate = 0.30;

//   let discount = Math.round(subtotal * discountRate);

//   // Delivery
//   let delivery = qty >= 4 ? 0 : parseInt(districtSelect.value);

//   // Total
//   let total = subtotal - discount + delivery;

//   // Update UI
//   subEl.innerText = "৳" + subtotal;
//   discountEl.innerText = "৳" + discount;
//   deliveryEl.innerText = "৳" + delivery;
//   totalEl.innerText = "৳" + total;
//   barTotal.innerText = "৳" + total;
// }

// // Quantity buttons
// plusBtn.addEventListener("click", () => {
//   qtyInput.value = parseInt(qtyInput.value) + 1;
//   calculateOrder();
// });

// minusBtn.addEventListener("click", () => {
//   if (parseInt(qtyInput.value) > 1) {
//     qtyInput.value = parseInt(qtyInput.value) - 1;
//     calculateOrder();
//   }
// });

// districtSelect.addEventListener("change", calculateOrder);

// // Initial calculation
// calculateOrder();

