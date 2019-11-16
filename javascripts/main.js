var cart = [];


function testSave(id) {
  //let y = document.getElementById(`${id}`).textContent;
  let name = document.getElementById(`name${id}`).textContent;
  let price = document.getElementById(`price${id}`).textContent.split('$ ')[1] / 1;
  let onSale = document.getElementById(`onSale${id}`).textContent;
  let image = document.getElementById(`image${id}`).src;
  

  console.log(price);
  console.log(name);


  let productToAdd = { Name : name, Price : price, Amount : 1, Onsale : onSale, Image: image, Type : orderHistory, Date : new Date().toLocaleDateString()};
  checkIfExists(productToAdd);
  saveProductsToStorage(productToAdd);
  
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

function saveProductsToStorage() {
  localStorage.setItem('products', JSON.stringify(cart));
}

function saveOrderHistory(products) {
    if(JSON.parse(localStorage.getItem('orderHistory')) == null){
    localStorage.setItem('orderHistory', JSON.stringify([{date : new Date().toLocaleDateString() , products : products}]));
    return;
    }
    let orderHistory = getOrderHistory();
    console.log(orderHistory);
    orderHistory.push({date : new Date().toLocaleDateString(), products : products});
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory))
    }

function getFromStorage() {
  return JSON.parse(localStorage.getItem('products'));
}

function getOrderHistory(){
  return JSON.parse(localStorage.getItem('orderHistory'));
}

function showCart() {

  let objects = getFromStorage();
  console.log(objects);

  let list = document.createElement("th");
  let total = 0;


  if(objects !== null){
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
}



function removeItem(name) {
  console.log(name);
  let products = getFromStorage();

  var removeIndex = products.map(function (item) { return item.Name; }).indexOf(name);
  products.splice(removeIndex, 1);

  localStorage.clear('products');
  localStorage.setItem('products', JSON.stringify(products));
  location.reload();
}

function confirm() {
  let price = JSON.parse(localStorage.getItem('price'))
  let products = getFromStorage();
  let list = document.createElement("ul");
  for (const product of products) {
    let node = document.createElement('tr');
    let photo = document.createElement('tr');
    photo.innerHTML = `
    <tr>
        <td>
          <img src="${product.Image}" width=100>&nbsp;
        </td>
        <td>${product.Name}</td>
        <td class="product-price" data-price="${product.Amount}">&nbsp; Amount : ${product.Amount}</td>
    </tr>
        `;
    node.appendChild(photo);
    //node.appendChild(text);
    list.appendChild(node);
  }

  document.getElementById("confirm").appendChild(list);
  let totalPrice = document.createElement("ul");
  let priceNode = document.createElement('li');
  let priceText = document.createTextNode(`Total price with tax and Shipping: ${price}$`);
  priceNode.appendChild(priceText);
  totalPrice.appendChild(priceNode);
  document.getElementById("confirm").appendChild(totalPrice);
  let button = document.createElement("button");
  button.data = `yo`;
  button.innerHTML = 'Click here to buy';
  button.setAttribute("onclick", `location.href='orderhistory'`);
  document.getElementById("confirm").appendChild(button);
}

function orderHistory() {
let price = JSON.parse(localStorage.getItem('price'))
let products = getFromStorage();
saveOrderHistory(products);
let list = document.createElement("ul");


for (const order of getOrderHistory()) {
  console.log(order);
    let node = document.createElement('tr');
    let photo = document.createElement('tr');
 
        photo.innerHTML =  `
          <tr>
          ${order.products.map(product => {
            return `<td> 
            <img src="${product.Image}" width=100>&nbsp;
          </td>
          <td>${product.Name}</td>
          <td class="product-price" data-price="${product.Amount}">&nbsp; Amount : ${product.Amount}&nbsp;</td>
          <td>Date:&nbsp; ${new Date().toLocaleDateString()}</td>`}).join('')}
          
          </tr>
              `;
    node.appendChild(photo);
    list.appendChild(node);
  
  }
  document.getElementById("orderHistory").appendChild(list);
  let totalPrice = document.createElement("ul");
  let priceNode = document.createElement('li');
  let priceText = document.createTextNode(`Thank you for your orders!`);
  priceNode.appendChild(priceText);
  totalPrice.appendChild(priceNode);
  document.getElementById("orderHistory").appendChild(totalPrice);
  localStorage.removeItem('products');
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