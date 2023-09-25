document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart");
  const totalPriceElement = document.getElementById("total-price");
  const totalDiscountedPriceElement = document.getElementById(
    "total-discounted-price"
  );
  const totalItemsElement = document.getElementById("item-count");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartDisplay() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      const emptyCartMessage = document.createElement("div");
      emptyCartMessage.textContent = "Your cart is empty";
      emptyCartMessage.className = "empty-cart-message";
      cartContainer.appendChild(emptyCartMessage);
      totalPriceElement.style.display = "none";
      totalDiscountedPriceElement.style.display = "none";
      totalItemsElement.textContent = "0";
    } else {
      let totalPrice = 0;
      let totalDiscountedPrice = 0;
      let totalItems = 0; // Initialize totalItems to 0

      cart.forEach((product, index) => {
        const cartItemDiv = document.createElement("div");
        cartItemDiv.className = "cart-item";
        const originalPrice = parseFloat(product.price);
        const discountedPrice = parseFloat(product.discountedPrice);

        cartItemDiv.innerHTML = `
          <img src="${product.image}" alt="${product.title}">
          <div>
              <h5>${product.title}</h5>
              <p><del>Original Price: ₹ ${originalPrice.toFixed(2)}</del></p>
              <p>Discounted Price: ₹ ${discountedPrice.toFixed(2)}</p>
              <div class="quantity">
                  <button class="decreaseBtn" data-index="${index}">-</button>
                  <input type="number" class="quantity-input" value="${getProductQuantity(
                    index
                  )}" min="1" max="${product.availableQuantity}">
                  <button class="increaseBtn" data-index="${index}">+</button>
              </div>
              <button class="removeBtn mt-3" data-index="${index}">Remove Item</button>
          </div>
        `;

        cartContainer.appendChild(cartItemDiv);

        const itemTotalPrice = originalPrice * getProductQuantity(index);
        totalPrice += itemTotalPrice;
        totalDiscountedPrice += discountedPrice * getProductQuantity(index);
        totalItems += getProductQuantity(index);
      });

      totalPriceElement.textContent = `Original Price: ₹ ${totalPrice.toFixed(
        2
      )}`;
      totalDiscountedPriceElement.textContent = `Discounted Price: ₹ ${totalDiscountedPrice.toFixed(
        2
      )}`;
      totalPriceElement.style.display = "block";
      totalDiscountedPriceElement.style.display = "block";
      totalItemsElement.textContent = totalItems;

      const decreaseBtns = cartContainer.querySelectorAll(".decreaseBtn");
      const increaseBtns = cartContainer.querySelectorAll(".increaseBtn");
      const quantityInputs = cartContainer.querySelectorAll(".quantity-input");
      const removeBtns = cartContainer.querySelectorAll(".removeBtn");

      decreaseBtns.forEach((decreaseBtn, index) => {
        decreaseBtn.addEventListener("click", () => {
          decreaseQuantity(index);
          updateCartDisplay();
        });
      });

      increaseBtns.forEach((increaseBtn, index) => {
        increaseBtn.addEventListener("click", () => {
          increaseQuantity(index);
        });
      });

      quantityInputs.forEach((quantityInput, index) => {
        quantityInput.addEventListener("change", () => {
          setQuantity(index, parseInt(quantityInput.value));
          updateCartDisplay();
        });
      });

      removeBtns.forEach((removeBtn, index) => {
        removeBtn.addEventListener("click", () => {
          removeItemFromCart(index);
          updateCartDisplay();
        });
      });
    }
  }

  updateCartDisplay();

  function removeItemFromCart(index) {
    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }

  function getProductQuantity(index) {
    return cart[index].quantity || 1;
  }

  function decreaseQuantity(index) {
    if (index >= 0 && index < cart.length) {
      const currentQuantity = getProductQuantity(index);
      if (currentQuantity > 1) {
        cart[index].quantity = currentQuantity - 1;
        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        removeItemFromCart(index);
      }
    }
  }

  function increaseQuantity(index) {
    if (index >= 0 && index < cart.length) {
      const currentQuantity = getProductQuantity(index);
      const availableQuantity = cart[index].availableQuantity;

      if (currentQuantity < availableQuantity) {
        cart[index].quantity = currentQuantity + 1;
        localStorage.setItem("cart", JSON.stringify(cart));

        const quantityInput = document.querySelector(`[data-index="${index}"]`);
        if (quantityInput) {
          quantityInput.value = cart[index].quantity;
        }

        updateCartDisplay();
      } else {
        alert("Cannot increase quantity beyond available stock.");
      }
    }
  }

  function setQuantity(index, quantity) {
    if (index >= 0 && index < cart.length) {
      const availableQuantity = cart[index].availableQuantity;

      if (quantity >= 1 && quantity <= availableQuantity) {
        cart[index].quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        alert(
          "Invalid quantity. Please choose a quantity between 1 and " +
            availableQuantity +
            "."
        );
      }
    }
  }
});
