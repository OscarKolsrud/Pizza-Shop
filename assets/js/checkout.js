//This is a bit of jquery that configures the checkout modal
$('#checkoutModal').modal({
    keyboard: false,
    backdrop: 'static',
    focus: false,
    show: false
});

function closeCheckout(refeshpage) {
    //Close the modal
    $('#checkoutModal').modal('hide');

    if (refeshpage) {
        location.reload();
    }
}

function initCheckout() {
    var cart = fetchCart();
    //Open the modal
    $('#checkoutModal').modal('show');

    //Build addons
    var addonOfferings = document.getElementById('addonOfferings');
    var totalOfferings = "";

    //Loop through the menu and add it to the addonOfferingsDIV
    for (i = 0; i < menu.length; i++) {
        //Only display products that are addons.
        if (menu[i].addon) {
            var offering = '<div class="custom-control custom-checkbox">' +
                '<input type="checkbox" class="custom-control-input" data-id="' + menu[i].id + '" id="addonOffering-' + menu[i].id + '" name="addonOffering[]" onchange="addonToggle(this)">' +
                '<label class="custom-control-label" for="addonOffering-' + menu[i].id + '">' + menu[i].name + ' - ' + menu[i].cart_desc + ' (<strong>Pris: </strong>' + (menu[i].price / 100).toFixed(2) + ',-)' +
                '</div>';

            totalOfferings += offering;
        }

        addonOfferings.innerHTML = totalOfferings;
    }

    //Loop through and check all boxes of previous added addons
    for (i = 0; i < cart.length; i++) {
        //Look for matching rows
        if (itemDetails(cart[i].product).addon) {
            var checkBox = document.getElementById("addonOffering-" + cart[i].product);

            checkBox.checked = true;
        }
    }

    buildSummaryTable();
}

function buildSummaryTable() {
    const cart = fetchCart();
    const summaryTable = document.getElementById("summaryTable");
    var newHtml = "";

    //For simplicity we start out by clearing the whole list.
    summaryTable.innerHTML = '';

    if (cart.length === 0) {
        //There is no cart items. Sad times.
        summaryTable.innerHTML = "";

        //Since there is no items disable the checkout button
        document.getElementById('checkoutBtn').disabled = true;
        document.getElementById('completeCheckout').disabled = true;
    } else {

        newHtml += '<table class="table table-sm table-hover">' +
            '<thead><tr>' +
            '<th scope="col" style="width: 15%;"></th>' +
            '<th scope="col" style="width: 75%;">Vare</th>' +
            '<th scope="col" style="width: 10%;">Pris</th>' +
            '</tr>' +
            '</thead><tbody>';

        //Build the list
        for (i = 0; i < cart.length; i++) {
            if (itemDetails(cart[i].product).addon) {
                //Product is an addon. Do not allow removing with the X
                var html = '<tr>' +
                    '<td><a href="#" class="text-danger text-decoration-none" data-id="' + cart[i].rowid + '" onclick="alert(`Dette produktet er et tilleggsprodukt og kan kun fjernes fra utsjekk skjermen ved å fjerne haken ved det`)">X</a></td>' +
                    '<td>' + itemDetails(cart[i].product).name + '</td>' +
                    '<th scope="row">' + (itemDetails(cart[i].product).price / 100).toFixed(2) + ',-</th>' +
                    '</tr>';
            } else {
                //Product is not an addon. Let it be removed
                var html = '<tr>' +
                    '<td><a href="#" class="text-danger text-decoration-none" data-id="' + cart[i].rowid + '" onclick="removeFromCart(this)">X</a></td>' +
                    '<td>' + itemDetails(cart[i].product).name + '</td>' +
                    '<th scope="row">' + (itemDetails(cart[i].product).price / 100).toFixed(2) + ',-</th>' +
                    '</tr>';
            }

            newHtml += html;
        }

        newHtml += '<tr><td></td>' +
            '<th scope="row" class="text-right">Total</th>' +
            '<td><span id="checkoutValueCounter">' + (cartValue() / 100).toFixed(2) + '</span>,-</td>' +
            '</tr>' +
            '</tbody>' +
            '</table>';

        //Save it
        summaryTable.innerHTML = newHtml;

        //Since there are items enable the checkout button
        document.getElementById('checkoutBtn').disabled = false;
        document.getElementById('completeCheckout').disabled = false;
    }
}

function changeDeliveryMethod(method) {
    //Get the delivery details field
    var deliveryDetails = document.getElementById('deliveryMethod');

    if (method === "pickup") {
        deliveryDetails.innerHTML = '<label for="pickupRestaurant">Hvilken restaurant vil du hente ved?</label>' +
            '<select class="custom-select d-block w-100" id="pickupRestaurant" name="restaurant" required>' +
            '<option value="" disabled>Velg en...</option>' +
            '<option value="oslo">Oslo</option>' +
            '<option value="rud">Rud</option>' +
            '</select>' +
            '<div class="invalid-feedback">' +
            'Velg en gyldig restaurant' +
            '</div>';
    } else if (method === "delivery") {
        deliveryDetails.innerHTML = '<label for="deliveryAddress">Adresse</label>' +
            '<input type="text" class="form-control" id="deliveryAddress" placeholder="Gateveien 1, 1352 Kolsås" name="deliveryAddress" required>' +
            '<small class="text-muted">Pass på at denne er riktig og detaljert</small>' +
            '<div class="invalid-feedback">' +
            'En adresse kreves' +
            '</div>';
    } else {
        alert('Leveransemethoden som ble valgt er ugyldig')
        throw "Not a valid delivery method";
    }
}

//This part handles validation and submission
const form = document.getElementById('checkoutForm');
form.onsubmit = function (evt) {
    //Prevent normal submission
    evt.preventDefault();

    //Do first part of validation (No normal validation errors, and that there is cart content
    if ((form.checkValidity() === false)) {
        form.classList.add('was-validated');
    } else if (fetchCart().length === 0) {
        form.classList.add('was-validated');
        alert('Du har ingen produkter i handlekurven')
    } else {
        //No validation errors, continue on with the checkoutprocess
        const formData = new FormData(form);
        const orderBox = document.getElementById("checkoutBox");

        //Construct a object containing all the basic order data
        const orderData = {
            firstname: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email')
        }

        if (formData.get('deliveryMethod') === "delivery") {
            //Add delivery data to order object
            orderData.deliveryMethod = "delivery";
            orderData.deliveryMeta = {
                location: formData.get('deliveryAddress')
            }
        } else if (formData.get('deliveryMethod') === "pickup") {
            //Add pickup data to order object
            orderData.deliveryMethod = "pickup";
            orderData.deliveryMeta = {
                location: formData.get('restaurant')
            }
        }

        //Then add the order
        const cart = fetchCart();
        var i;
        orderData.order = [];
        for (i = 0; i < cart.length; i++) {
            //Fetch product details
            var itemDtl = itemDetails(cart[i].product);
            itemDtl.rowid = cart[i].rowid;
            orderData.order.push(itemDtl);
        }

        db.collection("pizza-orders").add(orderData)
            .then(function (docRef) {
                console.log("Document written to firestore with ID: ", docRef.id);
                console.log(docRef);
                orderBox.innerHTML = "<h2 class='text-center'>Vi har mottatt ordren din🎉</h2>" +
                    "<br>" +
                    "<h4 class='text-center'>Ordre ref.: " + docRef.id + "</h4>" +
                    "<br>" +
                    "<div class='col text-center'>" +
                    "<button class='btn btn-primary btn-sm mt-3' type='button' onclick='closeCheckout(true);'>Lukk</button>" +
                    "</div>";
                //Clear the cart and "reset"
                sessionStorage.balance = 100000;
                saveCart([]);
                console.log('Order finished🎉');
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
                alert('Beklager! En feil oppsto. Feilmeldingen vi fikk var: ' + error + ' Prøv på nytt senere!');
            });
    }
}

//This part detects the delivery method from the radio buttons
const deliveryRadio = document.getElementById('delivery');
const pickupRadio = document.getElementById('pickup');

pickupRadio.onchange = function (evt) {
    changeDeliveryMethod('pickup');
}

deliveryRadio.onchange = function (evt) {
    changeDeliveryMethod('delivery');
}

