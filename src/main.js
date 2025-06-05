import './js/leave-review-modal.js';
import './js/slider.js';
import './js/close-menu.js';
import './js/swiper.js';
import './js/modal.js';
import './js/api.js';

document.addEventListener('DOMContentLoaded', () => {
  const productsList = document.getElementById('products-list');

  fetch('http://localhost:3000/api/items')
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        const products = result.data;
        productsList.innerHTML = products.map(product => `
          <li class="our-products-item swiper-slide">
            <img
              srcset="/img/our-products/${product.image}@1x.jpg 1x, /img/our-products/${product.image}@2x.jpg 2x"
              src="/img/our-products/${product.image}@1x.jpg"
              alt="${product.name}"
              width="230"
              height="201"
            />
            <div class="our-products-chocolate-describe">
              <h3 class="our-products-chocolate-name">${product.name}</h3>
              <p class="our-products-chocolate-type">${product.type}</p>
              <button class="button our-products-chocolate-button">${product.price} uah</button>
            </div>
          </li>
        `).join('');
      } else {
        productsList.innerHTML = '<p>Error fatching data</p>';
      }
    })
    .catch(err => {
      console.error(err);
      productsList.innerHTML = '<p>Server error</p>';
    });
});
