


// Get URL Params to display corresponding products
const queryParams = new URLSearchParams(window.location.search);
const currentPage = Number(queryParams.get('page')) === 0 ? 1 : Number(queryParams.get('page'));


const containerEl = document.body.querySelector('section.container');


// Start Fetching
setLoadingSpinner();
getProducts(currentPage).then(products => {
  // Finished Fetching
  removeLoadingSpinner();
  // selecting required paginationEl
  const paginationEl = document.querySelector(".pagination ul");
  //calling function with passing parameters and adding inside paginationEl which is ul tag
  paginationEl.innerHTML = createPagination(totalPages, currentPage);
  products.forEach(function (product) {
    containerEl.appendChild(createCard(product));
  });

}).catch(err => {
  console.error(error);
})



function setLoadingSpinner() {
  document.getElementById('loading-spinner').style.display = 'block';
}

function removeLoadingSpinner() {
  document.getElementById('loading-spinner').style.display = 'none';
}

async function getProducts(page = 1) {
  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://eur.shein.com/c-index/getProducts?_lang=en&_ver=1.1.8&limit=24&page=${page}&routeId=00200200&type=selection`)}`);
    const data = await response.json();
    const products = JSON.parse(data.contents);
    return products;
  } catch (error) {
    console.error(error);
  }
}

function createCard(item) {
  const { goods_img: imageUrl, goods_name: productName, salePrice: { usdAmountWithSymbol: price } } = item;

  const articleEl = document.createElement('article');

  const cardHeadEl = document.createElement('div');
  cardHeadEl.classList.add('card-head');
  articleEl.appendChild(cardHeadEl);


  const imgEl = document.createElement('img');
  imgEl.src = imageUrl;
  imgEl.setAttribute('alt', 'Product');
  imgEl.setAttribute('loading', 'lazy');
  cardHeadEl.appendChild(imgEl);


  const cardBodyEl = document.createElement('div');
  cardBodyEl.classList.add('card-body');
  articleEl.appendChild(cardBodyEl);


  const detailsEl = document.createElement('p');
  detailsEl.classList.add('details');
  cardBodyEl.appendChild(detailsEl);

  const productDescriptionEl = document.createElement('span');
  productDescriptionEl.classList.add('product-description');
  productDescriptionEl.textContent = productName;
  detailsEl.appendChild(productDescriptionEl);

  const productCostEl = document.createElement('span');
  productCostEl.classList.add('product-cost');
  productCostEl.textContent = price;
  detailsEl.appendChild(productCostEl);

  const addToCartBtn = document.createElement('a');
  addToCartBtn.classList.add('add-to-cart');
  addToCartBtn.textContent = 'Add To Cart';
  addToCartBtn.addEventListener('click', e => addToCart(item));
  cardBodyEl.appendChild(addToCartBtn);

  const card = articleEl;
  /*
  CARD LAYOUT
  <article class="card">
    <div class="card-head">
      <img
        src=${imageUrl}
        alt="Product"
        loading="lazy"
      />
    </div>
    <div class="card-body">
      <p class="details">
        <span class="product-description">
          ${productName}
        </span>
        <span class="product-cost">${price}</span>
      </p>
      <a class="add-to-cart">Add To Cart</a>
    </div>
  </article>
  */

  return card;
}

function addToCart(item) {
  const cart = new Map(JSON.parse(window.localStorage.getItem('cart')));

  if (cart.has(item.goods_name)) {
    cart.set(item.goods_name, {
      item,
      quantity: cart.get(item.goods_name).quantity + 1
    })
  } else {
    cart.set(item.goods_name, {
      item,
      quantity: 1
    })
  }

  const cartIcon = document.querySelector('.link .cart-number');
  const cartSize = [...cart.values()].reduce((total, productInfo) => total + productInfo.quantity, 0);
  cartIcon.textContent = cartSize;

  window.localStorage.setItem('cart', JSON.stringify([...cart]));

}
