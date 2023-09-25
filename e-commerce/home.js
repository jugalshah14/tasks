const paginationContainer = document.getElementById("pagination");
const itemsPerPage = 8;
let currentPage = 1;
let filteredProducts = [];

function performSearch() {
  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput.value.toLowerCase().trim();

  filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );

  currentPage = 1;
  displayProductsOnPage(filteredProducts, productContainer, currentPage);
  updatePaginationUI(filteredProducts, paginationContainer);
}

function displayProductsOnPage(products, container, page) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const productsToDisplay = products.slice(start, end);

  container.innerHTML = "";
  createProductCards(productsToDisplay, container, "Product added to cart");
}

const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");

function updatePaginationUI(filteredProducts, paginationContainer) {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      currentPage = i;
      displayProductsOnPage(filteredProducts, productContainer, currentPage);
      updatePaginationUI(filteredProducts, paginationContainer);
    });

    if (i === currentPage) {
      pageButton.classList.add("active");
    }

    paginationContainer.appendChild(pageButton);
  }

  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;
}

prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayProductsOnPage(filteredProducts, productContainer, currentPage);
    updatePaginationUI(filteredProducts, paginationContainer);
  }
});

nextPageButton.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayProductsOnPage(filteredProducts, productContainer, currentPage);
    updatePaginationUI(filteredProducts, paginationContainer);
  }
});

const products = [];

const productContainer = document.getElementById("product-container");
const sortDropdown = document.getElementById("sort-dropdown");

function sortProducts() {
  const selectedOption = sortDropdown.value;

  if (selectedOption === "low-to-high") {
    filteredProducts.sort((a, b) => {
      const discountedPriceA = Math.round(a.price * (1 - a.discount / 100));
      const discountedPriceB = Math.round(b.price * (1 - b.discount / 100));
      return discountedPriceA - discountedPriceB;
    });
  } else if (selectedOption === "high-to-low") {
    filteredProducts.sort((a, b) => {
      const discountedPriceA = Math.round(a.price * (1 - a.discount / 100));
      const discountedPriceB = Math.round(b.price * (1 - b.discount / 100));
      return discountedPriceB - discountedPriceA;
    });
  }

  currentPage = 1;

  displayProductsOnPage(filteredProducts, productContainer, currentPage);
  updatePaginationUI(filteredProducts, paginationContainer);
}

sortDropdown.addEventListener("change", sortProducts);

sortProducts();

function createProductCards(products, container, customMessage) {
  let row = document.createElement("div");
  row.className = "row";
  let cardCount = 0;

  products.forEach((product) => {
    if (cardCount % 4 === 0) {
      container.appendChild(row);
      row = document.createElement("div");
      row.className = "row";
    }

    const cardDiv = document.createElement("div");
    cardDiv.className = "col-3";

    const originalPrice = product.price;
    const discountedPrice = Math.round(
      product.price * (1 - product.discount / 100)
    );

    cardDiv.innerHTML = `
                    <div class="card">
                        <img style="height: 400px;" src="${product.image}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">
                                <del>Price: ₹ ${originalPrice}</del><br>
                                Discounted Price: ₹ ${discountedPrice}
                                <p>Quantity: ${product.availableQuantity}</p>
                            </p>
                            <a href="#" class="btn btn-primary addToCartBtn">Add To Cart</a>
                        </div>
                    </div>
                `;

    const addToCartBtn = cardDiv.querySelector(".addToCartBtn");
    addToCartBtn.addEventListener("click", () => {
      addToCart(product, addToCartBtn, customMessage, discountedPrice);
    });

    row.appendChild(cardDiv);
    cardCount++;
  });

  container.appendChild(row);
}

function addToCart(product, button, customMessage, discountedPrice) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const isProductInCart = cart.some((item) => item.id === product.id);

  if (isProductInCart) {
    alert("This product is already in your cart.");
  } else {
    const cartItem = {
      ...product,
      discountedPrice: discountedPrice,
    };

    cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(customMessage || "Product added to cart");

    button.disabled = true;
  }
}

function getFormDataFromLocalStorage() {
  const items = JSON.parse(localStorage.getItem("items")) || [];
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    image: item.img,
    price: item.price,
    discount: item.discount,
    availableQuantity: item.availableQuantity,
  }));
}

const formDataFromLocalStorage = getFormDataFromLocalStorage();

products.push(...formDataFromLocalStorage);
filteredProducts = [...products];

createProductCards(filteredProducts, productContainer, "Product added to cart");
displayProductsOnPage(filteredProducts, productContainer, currentPage);
updatePaginationUI(filteredProducts, paginationContainer);
