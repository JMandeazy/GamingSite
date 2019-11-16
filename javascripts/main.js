var cart = [];


function testSave(id) {
  //let y = document.getElementById(`${id}`).textContent;
  let name = document.getElementById(`name${id}`).textContent;
  let price = document.getElementById(`price${id}`).textContent.split('$ ')[1] / 1;
  let onSale = document.getElementById(`onSale${id}`).textContent;
  let image = document.getElementById(`image${id}`).src;
  console.log(price);
  console.log(name);


  let productToAdd = { Name: name, Price: price, Amount: 1, OnSale: onSale, Image: image };

  checkIfExists(productToAdd);
  saveToStorage(productToAdd);
}

function checkIfExists(product) {
  var i = cart.length;
  while (i--) {
    if (cart[i].Name === product.Name) {
      cart[i].Amount += product.Amount
      return;
    }
  }
  cart.push(product);
}

function saveToStorage() {
  localStorage.setItem('products', JSON.stringify(cart));
}
function saveHistoryToStorage() {
  localStorage.setItem('history', JSON.stringify(cart));
}

function getFromStorage() {
  return JSON.parse(localStorage.getItem('products'));
}
function getHistoryFromStorage() {
  return JSON.parse(localStorage.getItem('history'));
}

function showCart() {

  let objects = getFromStorage();
  console.log(objects);

  let list = document.createElement("th");
  let total = 0;


  for (const product of objects) {

    let node = document.createElement('tr');
    let sale = 0;
    if (product.OnSale === "True") {
      sale = Math.floor(product.Amount / 3) * product.Price;
    }
    let price = product.Price * product.Amount - sale;
    total += price;

    let image = document.createElement("img");
    image.setAttribute("src", product.Image);


    let text = document.createTextNode(`${product.Name} ${product.Amount}: $${price} ${sale ? `(3 for 2 rebate $${sale})` : ''}`);
    let button = document.createElement("button");
    button.style.cssFloat = "right";
    button.data = `${product.name}`;
    button.innerHTML = 'X';
    button.addEventListener("click", () => removeItem(product.name))
    node.append(text);
    node.append(button);
    node.append(image);
    list.append(node);

    let cart = document.getElementById("cart");
    cart.innerHTML = "";
    cart.append(list);
  }

  let taxesTotal = total * 1.25;
  let shippingfee = 50;
  let totalCost = taxesTotal + 50;


  localStorage.setItem('price', JSON.stringify(totalCost));

  let priceList = document.createElement("th");

  let priceNoVat = document.createElement("tr");
  let priceNoVatText = document.createTextNode(`Price before tax: $${Math.ceil(total)}`);

  let priceVat = document.createElement("tr");
  let priceVatText = document.createTextNode(`Price after tax: $${Math.ceil(taxesTotal)}`);

  let shipping = document.createElement("tr");
  let shippingText = document.createTextNode(`Shipping fee: $${Math.ceil(shippingfee)}`);

  let finalCost = document.createElement("tr");
  let finalCostText = document.createTextNode(`Total: $${Math.ceil(totalCost)}`);

  priceNoVat.appendChild(priceNoVatText);
  priceVat.appendChild(priceVatText);
  shipping.appendChild(shippingText);
  finalCost.appendChild(finalCostText);

  priceList.appendChild(priceNoVat);
  priceList.appendChild(priceVat);
  priceList.appendChild(shipping);
  priceList.appendChild(finalCost);
  let x = document.getElementById("price");
  x.innerHTML = "";
  x.appendChild(priceList);

  let checkout = document.createElement("a");
  let button = document.createElement("button");
  checkout.append(button);
  checkout.href = "/Products/Checkout"
  button.innerHTML = "Checkout";
  priceList.append(checkout);

}

function removeItem(name) {
  console.log(name);
  let products = getFromStorage();

  var removeIndex = products.map(function (item) { return item.Name; }).indexOf(name);
  products.splice(removeIndex, 1);

  delete localStorage.products;
  localStorage.setItem('products', JSON.stringify(products));
  location.reload();
}

function deleteHistory() {
  delete localStorage.history;
  location.reload();
}

function confirm() {
  let price = JSON.parse(localStorage.getItem('price'))
  let products = getFromStorage();

  let list = document.createElement("th");
  let total = 0;
  for (const product of products) {

    let sale = 0;
    if (product.OnSale === "True") {
      sale = Math.floor(product.Amount / 3) * product.Price;
    }
    let price = product.Price * product.Amount - sale;

    let node = document.createElement('tr');
    let text = document.createTextNode(`Product: ${product.Name} Amount: ${product.Amount} Price: ${product.Price} ${sale ? `(3 for 2 rebate $${sale})` : ''} `);

    node.appendChild(text);
    list.appendChild(node);
  }

  document.getElementById("confirm").appendChild(list);
  let totalPrice = document.createElement("ul");
  let priceNode = document.createElement('li');
  let priceText = document.createTextNode(`TotalPrice with tax and Shipping: ${price}$`);
  priceNode.appendChild(priceText);
  totalPrice.appendChild(priceNode);
  document.getElementById("confirm").appendChild(totalPrice);
  let button = document.createElement("button");
  button.innerHTML = 'Confirm';
  button.setAttribute("onclick", `confirmOrder(); location.href="/products/history"`);
  document.getElementById("confirm").appendChild(button);
}

function confirmOrder() {
  let products = getFromStorage();

  var orderHistory = JSON.parse(localStorage.getItem('history')) || [];
  for (const product of products) {

    let productToAdd = {
      Type: history,
      Date: new Date().toLocaleDateString(),
      Name: product.Name,
      Price: product.Price,
      Amount: product.Amount,
      OnSale: product.OnSale
    };
    orderHistory.push(productToAdd);
    localStorage.setItem('history', JSON.stringify(orderHistory));
  }
  delete localStorage.products;
}

//Saves the products to a new localstorare to use as order history
function savedOrderhistory() {
  let price = JSON.parse(localStorage.getItem('price'))
  let products = JSON.parse(localStorage.getItem('history'))

  let list = document.createElement("th");
  let total = 0;
  for (const product of products) {

    let sale = 0;
    if (product.OnSale === "True") {
      sale = Math.floor(product.Amount / 3) * product.Price;
    }
    let price = product.Price * product.Amount - sale;

    let node = document.createElement('tr');
    let text = document.createTextNode(` Date: ${product.Date} Product: ${product.Name} Amount: ${product.Amount} Price: ${product.Price} ${sale ? `(3 for 2 rebate $${sale})` : ''} `);

    node.appendChild(text);
    list.appendChild(node);
  }

  document.getElementById("confirm").appendChild(list);
  let totalPrice = document.createElement("ul");
  let priceNode = document.createElement('li');
  let priceText = document.createTextNode(`TotalPrice with tax and Shipping: ${price}$`);
  priceNode.appendChild(priceText);
  totalPrice.appendChild(priceNode);
  document.getElementById("confirm").appendChild(totalPrice);;


}

function validate(evt) {
  var theEvent = evt || window.event;

  if (theEvent.type === 'paste') {
    key = event.clipboardData.getData('text/plain');
  } else {
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode(key);
  }
  var regex = /[1-9]|\./;
  if (!regex.test(key)) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
}