function getFromLocalStorage() {
  let productsLS = getProductsFromStorage();
  //loop through the products and print into the cart
  productsLS.forEach(function (product) {
    //create the <ntr>
    totalPrice += Number(product.price);
    const row = document.createElement("tr");
    console.log(product.price);
    //print the contents
    row.innerHTML = `
            <tr>
                <td>
                  <img src="${product.image}" width=100>
                </td>
                <td>${product.title}</td>
                <td class="product-price" data-price="${product.price}">${product.price}</td>
                <td>
                <a href="#" class="remove" data-id="${product.id}">X</a>
                </td>
             </tr>
            `;
    shoppingCartContent.appendChild(row);
  });
  console.log(totalPrice);
  totalHTML.innerHTML = totalPrice;
}