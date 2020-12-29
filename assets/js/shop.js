//This encodes and saves the cart
function saveCart(cart) {
    //Since session and local only supports strings we convert to json
    var jsonValue = JSON.stringify(cart);

    sessionStorage.setItem('cart', jsonValue);
}

//This function retrieves and decodes the cart
function fetchCart() {
    //Fetch the stored cart in JSON format
    var jsonValue = sessionStorage.getItem('cart');

    return JSON.parse(jsonValue);
}

//This is just a helper function to generate UUIDs used for the cart
function UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function cheatRecharge() {
    var rechargeValue = prompt('Hvor mye penger ønsker du på kontoen (i hele kroner)');

    if (!isNaN(rechargeValue)) {
        //Number, continue recharge
        sessionStorage.balance = Number(rechargeValue)*100;
        balanceDOM();
        alert('Saldo ble satt til ' + rechargeValue + 'kr');
    } else {
        alert('Du må oppgi et nummer!');
        cheatRecharge();
    }
}

//This function is called to refresh the balance and cart value counters in the DOM
function balanceDOM() {
    //Fetch the balance counter by ID
    var balanceCounter = document.getElementById('balanceCounter');
    var valueCounter = document.getElementById('cartValue');
    var checkoutBalanceCounter = document.getElementById('checkoutBalanceCounter');

    //Set the different values. Remember to divide by 100 to get the "normal" monetary value
    balanceCounter.innerHTML = (sessionStorage.balance / 100).toFixed(2);
    valueCounter.innerHTML = (cartValue()/100).toFixed(2);
    checkoutBalanceCounter.innerHTML = (sessionStorage.balance / 100).toFixed(2);
}

//This function is used to look up the pizza type in the menu and return the cart value
function cartValue() {
    var i;
    var totalValue = 0;

    //Fetch the cart
    var cart = fetchCart();
    for (i = 0; i < cart.length; i++) {
        totalValue += itemDetails(cart[i].product).price;
    }

    return totalValue;
}

//This function is responsible for the "banking". If subtractaction pass "true" as second param
function balanceChange(amount, subtract) {
    //Ensure the amount is a number
    const amnt = Number(amount);
    let currentBalance = Number(sessionStorage.balance);
    //Determine if this is a recharge or a
    if (subtract) {
        //This is a charge (negative)
        currentBalance -= amnt;
    } else {
        //This is a recharge (positive)
        currentBalance += amnt;
    }

    //Save the new balance
    sessionStorage.balance = currentBalance;

    //Finish by refreshing the balance in the DOM
    balanceDOM();
}

function buildCart() {
    const cart = fetchCart();
    const cartDiv = document.getElementById("cartContent");

    //For simplicity we start out by clearing the whole list.
    cartDiv.innerHTML = '';

    if (cart.length === 0) {
        //There is no cart items. Sad times.
        cart.innerHTML = "";

        //Since there is no items disable the checkout button
        document.getElementById('checkoutBtn').disabled = true;
    } else {
        //There are favorites. Build the list
        for (i = 0; i < cart.length; i++) {
            if (itemDetails(cart[i].product).addon) {
                //Product is an addon. Do not allow removing with the X
                var html = "<li class='list-group-item d-flex justify-content-between lh-condensed' id='" + cart[i].rowid + "'><div>" +
                    "<h6 class='my-0'><a href='#' class='text-danger text-decoration-none' data-id='" + cart[i].rowid + "' onclick='alert(`Dette produktet er et tillegsprodukt og kan kun fjernes fra utsjekk skjermen ved å fjerne haken ved det`)'>X</a> " + itemDetails(cart[i].product).name + "</h6>" +
                    "<small class='text-muted'>" + itemDetails(cart[i].product).cart_desc +"</small></div>" +
                    "<span class='text-muted'>" + (itemDetails(cart[i].product).price/100).toFixed(2) +"</span>" +
                    "</li>";
            } else {
                //Product is not an addon. Let it be removed
                var html = "<li class='list-group-item d-flex justify-content-between lh-condensed' id='" + cart[i].rowid + "'><div>" +
                    "<h6 class='my-0'><a href='#' class='text-danger text-decoration-none' data-id='" + cart[i].rowid + "' onclick='removeFromCart(this)'>X</a> " + itemDetails(cart[i].product).name + "</h6>" +
                    "<small class='text-muted'>" + itemDetails(cart[i].product).cart_desc +"</small></div>" +
                    "<span class='text-muted'>" + (itemDetails(cart[i].product).price/100).toFixed(2) +"</span>" +
                    "</li>";
            }

            cartDiv.innerHTML += html;
        }

        //Since there are items enable the checkout button
        document.getElementById('checkoutBtn').disabled = false;
    }
}

function addonToggle(product) {
    //Fetch the id in the dataset
    var id = product.dataset.id;
    var cart = fetchCart();
    var complete = false;
    var i;

    //Firstly check if this addon is already in cart, if it is in the cart call to remove it
    //Loop through the cart looking for an item by that product id
    for (i = 0; i < cart.length; i++) {
        //Find the matching row
        if (Number(id) === Number(cart[i].product)) {
            console.log('Found');
            //Matching item found
            //Get the itemvalue to refund
            const itemDtl = itemDetails(cart[i].product);

            //Refund the customer
            balanceChange(itemDtl.price, false);

            //Remove from the cart
            var index = cart.indexOf(cart[i]);
            if (index > -1) {
                cart.splice(index, 1);
            }

            //Save the cart in the session
            saveCart(cart);

            //Add it to the visual part
            buildCart();
            buildSummaryTable();

            complete = true;
            product.disabled = true;
            setTimeout(function () {
                product.checked = false;
                product.disabled = false;
            }, 150);
        }
    }

    if (!complete) {
        //There was none in the cart to be removed, add it
        //Check if balance covers the cost
        if (sessionStorage.balance >= itemDetails(id).price) {
            //Balance covers cost, continue

            //Add the item object to the cart
            var uuid = UUID();
            cart.push({
                rowid: uuid,
                product: id
            });

            //Save the cart
            saveCart(cart);

            //Add it to the visual part
            buildCart();
            buildSummaryTable();

            //Charge the balance
            balanceChange(itemDetails(id).price, true);
            product.checked = true;
        } else {
            alert('Beklager, produktet kunne ikke legges til da saldoen din er for lav');
            product.disabled = true;
            setTimeout(function () {
                product.checked = false;
                product.disabled = false;
            }, 150);

        }
    }
}

function addCart(product) {
    //Fetch the id in the dataset
    var id = product.dataset.id;

    //Check if balance covers the cost
    if (sessionStorage.balance >= itemDetails(id).price) {
        //Balance covers cost, continue

        //Fetch the current cart
        var cart = fetchCart();

        //Add the item object to the cart
        var uuid = UUID();
        cart.push({
            rowid: uuid,
            product: id
        });

        //Save the cart
        saveCart(cart);

        //Add it to the visual part
        buildCart();

        //Charge the balance
        balanceChange(itemDetails(id).price, true);

        //Then give a visual indication by blinking the button clicked in green
        product.innerHTML = "Lagt til";
        product.classList.add("btn-success");
        product.classList.remove("btn-primary");
        setTimeout(function () {
            product.innerHTML = "Legg til i kurv";
            product.classList.add("btn-primary");
            product.classList.remove("btn-success");
        }, 2000);
    } else {
        //Give a visual indication of missing money
        var elementID = UUID();
        var elementHTML = "<div id='" + elementID + "' class='alert alert-danger' role='alert'>Du har ikke nok penger til " + itemDetails(id).name + ". (Mangler: " + ((itemDetails(id).price-sessionStorage.balance)/100).toFixed(2) + " Kr)</div>";

        product.innerHTML = "Kunne ikke legge til";
        product.classList.add("btn-danger");
        product.classList.remove("btn-primary");
        document.getElementById("messages").innerHTML += elementHTML;
        setTimeout(function () {
            product.innerHTML = "Legg til i kurv";
            product.classList.add("btn-primary");
            product.classList.remove("btn-danger");
            document.getElementById(elementID).remove();
        }, 3500);
    }
}

function removeFromCart(cartItem) {
    //Fetch the cart
    var cart = fetchCart();
    var rowid = cartItem.dataset.id;

    //Loop through the cart looking for an item by that rowid
    for (i = 0; i < cart.length; i++) {
        //Find the matching row
        if (String(rowid) === String(cart[i].rowid)) {
            //Get the itemvalue to refund
            const itemDtl = itemDetails(cart[i].product);

            //Refund the customer
            balanceChange(itemDtl.price, false);

            //Remove from the cart
            var index = cart.indexOf(cart[i]);
            if (index > -1) {
                cart.splice(index, 1);
            }

            //Save the cart in the session
            saveCart(cart);
        }
    }

    //Rebuild visual cart and balance dom elements
    buildCart();
    buildSummaryTable();
    balanceDOM();
}