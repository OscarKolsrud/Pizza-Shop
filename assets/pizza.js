//We store the balance as the lowest denomination of the currency
var balance = 100000;

var cart = [];

//Ensure that the correct balance gets loaded and other init functions
window.onload = refreshBalance();

//Generate an UUID
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

//This functions only job is setting the balance counter
function refreshBalance() {
    var balanceCounter = document.getElementById('balanceCounter');

    balanceCounter.innerHTML = (balance / 100).toFixed(2);

    //Also for safety reasons calculate the cart value
    document.getElementById("cartValue").innerHTML = (cartValue()/100).toFixed(2);
}

function cartValue() {
    var i;
    var price = 0;
    for (i = 0; i < cart.length; i++) {
        price += Number(cart[i].price);
    }

    return price;
}

//This function charges the user balance
function chargeBalance(amount, subtract) {
    //Determine if this is a recharge or a
    if (subtract) {
        //This is a charge (negative)
        balance -= amount;
    } else {
        //This is a recharge (positive)
        balance += amount;
    }

    //Finish by refreshing the balance
    refreshBalance();
}

function addCart(productData) {
    //Firstly check if there is balance to add this pizza
    if (balance >= productData.dataset.pricing) {
        //All good, balance allows for this

        //Create an unique UUID
        var uuid = create_UUID();
        //Create the cart item object
        var product = {
            id: uuid,
            name: productData.dataset.name,
            ingredients: productData.dataset.ingredients,
            price: productData.dataset.pricing,
        };

        //Add the item object to the cart array
        cart.push(product);

        //Add the product to the "visual cart"

        var html = "<li class='list-group-item d-flex justify-content-between lh-condensed' id='" + uuid + "'><div>" +
            "<h6 class='my-0'>" + productData.dataset.name + "</h6>" +
            "<small class='text-muted'>" + productData.dataset.ingredients +"</small></div>" +
            "<span class='text-muted'>" + (productData.dataset.pricing/100).toFixed(2) +"</span></li>";

        var cartContent = document.getElementById("cartContent");

        cartContent.innerHTML += html;

        //Finally charge the product cost to the customers balance and alert
        chargeBalance(productData.dataset.pricing, true);

        //Then give a visual indication by blinkin the button clicked in green
        productData.innerHTML = "Lagt til";
        productData.classList.add("btn-success");
        productData.classList.remove("btn-primary");
        setTimeout(function () {
            productData.innerHTML = "Legg til i kurv";
            productData.classList.add("btn-primary");
            productData.classList.remove("btn-success");
        }, 2000);
    } else {
        //Give a visual indication of missing money
        var elementID = create_UUID();
        var elementHTML = "<div id='" + elementID + "' class='alert alert-danger' role='alert'>Du har ikke nok penger til " + productData.dataset.name + ". (Mangler: " + ((productData.dataset.pricing-balance)/100).toFixed(2) + " Kr)</div>";

        productData.innerHTML = "Kunne ikke legge til";
        productData.classList.add("btn-danger");
        productData.classList.remove("btn-primary");
        document.getElementById("messages").innerHTML += elementHTML;
        setTimeout(function () {
            productData.innerHTML = "Legg til i kurv";
            productData.classList.add("btn-primary");
            productData.classList.remove("btn-danger");
            document.getElementById(elementID).remove();
        }, 3500);
    }
}