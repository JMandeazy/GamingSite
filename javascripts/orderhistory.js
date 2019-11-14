function getProductsFromStorage() {
  let products;

  //if something exists on storage we get the value, otherwise create an empty array
  if (localStorage.getItem("products") === null) {
    products = [];
  } else {
    products = JSON.parse(localStorage.getItem("products"));
  }
  return products;
}

window.onload = function () {
  fillOrder();
}

function fillOrder() {
  let orderItems = getProductsFromStorage();
  let table = document.getElementById("checkout-table");
  let orderTotal = 0;

  for (let item of orderItems) {
    let element = document.createElement('tr');
    element.innerHTML = `
    <td class="text-left">
      ${item.product.title}
    </td>
    <td class="text-left">
    ${item.product.price}
    </td>

    `;
    table.appendChild(element);
    orderTotal += parseInt(item.subTotal);
  }
  document.getElementById('orderTotal').innerHTML = `${orderTotal + 10}`; //order + freight
  document.getElementById('orderVAT').innerHTML = `${orderTotal * 0.25}`;
  localStorage.clear();
}