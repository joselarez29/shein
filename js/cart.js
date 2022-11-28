const mainEl = document.querySelector('main');


(function populateCartProducts() {

  const cart = new Map(JSON.parse(window.localStorage.getItem('cart')));

  if (cart.size === 0) {
    return mainEl.innerHTML = `
    <h2 class='notification'>Your cart is empty!</h2>
    `
  }

  cart.forEach((product) => {
    const productCard = createProductCard(product);
    mainEl.innerHTML += productCard;
  })

  // Add Tax, Sub-Total & Total amount
  const tax = 12;
  const productsTotal = [...cart.values()].reduce((total, productInfo) => total + (productInfo.item.salePrice.usdAmount * productInfo.quantity), 0);
  const total = productsTotal + (tax * productsTotal / 100);


  mainEl.innerHTML += `
    <div class="total-data">
      <div class="tax"><b>Taxes:</b> ${tax.toFixed(2)}%</div>
      <div class="total"><b>Total:</b> ${total.toFixed(2)}$</div>
      <button class="checkout-btn" onclick="checkout();">Checkout</button>
    </div>
  `;
})();

function createProductCard({ item, quantity }) {
  const { goods_img: imageUrl, goods_name: name, salePrice: { usdAmount: price } } = item;
  const subTotal = quantity * price;

  const productCard = `
  <section class="product">
    <aside class="img-container">
      <img
        src="${imageUrl}"
        alt="Product"
      />
    </aside>
    <article class="product-details">
      <div class="name">
        <h3>${name}</h3>
      </div>
      <div class="price"><b>Price:</b> ${Number(price).toFixed(2)}$</div>
      <div class="quantity"><b>Quantity:</b> ${quantity}</div>
      <div class="sub-total"><b>Sub-Total:</b> ${subTotal.toFixed(2)}$</div>
    </article>
  </section>
  `

  return productCard;
}



function checkout(bill) {

  // Add Modal of Successful payment
  addModal().then(res => {
    window.localStorage.removeItem('cart')
    // Refresh the page
    window.location.reload()
  });

  return bill;

}

function addModal() {

  return new Promise((resolve, reject) => {
    const successAnimation = `
    <div class="modal" id="payment-success-modal">
      <div class="payment-container">
        <a class="close-btn" onclick="closeModal()">&#10006;</a>
        <div class="swal-icon swal-icon--success">
          <span
            class="swal-icon--success__line swal-icon--success__line--long"
          ></span>
          <span
            class="swal-icon--success__line swal-icon--success__line--tip"
          ></span>
          <div class="swal-icon--success__ring"></div>
          <div class="swal-icon--success__hide-corners"></div>
        </div>
        <h2 class="text">Payment has been succesful</h2>
      </div>
    </div>
    `
    document.body.innerHTML += successAnimation;
    setTimeout(() => {
      document.getElementById('payment-success-modal')?.remove();
      resolve(true);
    }, 2000);
  })

}

function closeModal() {
  document.getElementById('payment-success-modal').remove();
}