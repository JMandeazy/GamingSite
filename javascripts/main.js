var cart = [];


function testSave(id) {
          let y = document.getElementById(`${id}`).textContent
          let name = document.getElementById(`name${id}`).textContent
          let price = document.getElementById(`price${id}`).textContent
          console.log(name);
          console.log(price)

          let productToAdd = { Name: name, Price: price, };
          cart.push(productToAdd);
          localStorage.setItem('products', JSON.stringify(cart));
}


function addToArray(id) {
          let productName = document.getElementById(`${id}name`).textContent;
          let productPrice = parseFloat(document.getElementById(`${id}price`).textContent);
          let selector = document.getElementById(`${id}color`);
          let color = selector[selector.selectedIndex].value;
          let amount = parseInt(document.getElementById(`${id}amount`).value);
          let productToAdd = { Name: productName, Price: productPrice, Color: color, Amount: amount };
          checkIfExists(productToAdd);
}

function checkIfExists(product) {
          var i = cart.length;
          while (i--) {
                    if (cart[i].Name === product.Name && cart[i].Color == product.Color) {
                              console.log("exists, adding amount")
                              cart[i].Amount += product.Amount
                              return;
                    }
          }
          cart.push(product);
}

function saveToStorage() {
          localStorage.setItem('products', JSON.stringify(cart));
}

function getFromStorage() {
          return JSON.parse(localStorage.getItem('products'));
}

function showCart() {

          let objects = getFromStorage();
          console.log(objects);

          let list = document.createElement("ul");
          let total = 0;

          for (const product of objects) {
                    let node = document.createElement('li');
                    let price = product.Price * product.Amount;
                    total += price;
                    let text = document.createTextNode(`Product: ${product.Name}  Color: ${product.Color}  Price: ${product.Amount} x ${product.Price}kr = ${price}kr `);
                    let button = document.createElement("button");
                    button.data = `${product.name}`;
                    button.innerHTML = 'remove';
                    button.setAttribute("onclick", `removeItem("${product.Name}");`);
                    node.appendChild(text);
                    node.appendChild(button);
                    list.appendChild(node);
          }
          document.getElementById("cart").appendChild(list);

          let taxesTotal = total * 1.25;
          let shippingfee = 50;
          let totalCost = taxesTotal + 50;

          localStorage.setItem('price', JSON.stringify(totalCost));

          let priceList = document.createElement("ul");

          let priceNoVat = document.createElement("li");
          let priceNoVatText = document.createTextNode(`Price before tax: ${total}kr`);

          let priceVat = document.createElement("li");
          let priceVatText = document.createTextNode(`Price after tax: ${taxesTotal}kr`);

          let shipping = document.createElement("li");
          let shippingText = document.createTextNode(`Shipping fee: ${shippingfee}kr`);


          let finalCost = document.createElement("li");
          let finalCostText = document.createTextNode(`Total: ${totalCost}kr`);

          priceNoVat.appendChild(priceNoVatText);
          priceVat.appendChild(priceVatText);
          shipping.appendChild(shippingText);
          finalCost.appendChild(finalCostText);

          priceList.appendChild(priceNoVat);
          priceList.appendChild(priceVat);
          priceList.appendChild(shipping);
          priceList.appendChild(finalCost);
          document.getElementById("cart").appendChild(priceList)
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
                    let node = document.createElement('li');
                    let text = document.createTextNode(`Product: ${product.Name}  Color: ${product.Color}  Amount: ${product.Amount}`);

                    node.appendChild(text);
                    list.appendChild(node);
          }

          document.getElementById("confirm").appendChild(list);
          let totalPrice = document.createElement("ul");
          let priceNode = document.createElement('li');
          let priceText = document.createTextNode(`TotalPrice with tax and Shipping: ${price}kr`);
          priceNode.appendChild(priceText);
          totalPrice.appendChild(priceNode);
          document.getElementById("confirm").appendChild(totalPrice);
          let button = document.createElement("button");
          button.data = `yo`;
          button.innerHTML = 'Confirm';
          button.setAttribute("onclick", `confirmOrder(); location.href='index.html'`);
          document.getElementById("confirm").appendChild(button);

}

function confirmOrder() {
          localStorage.clear()
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