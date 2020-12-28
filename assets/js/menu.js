//This file handles everything related to menu storage, product lookup etc.
var menu = [
    {
        "id": 1,
        "name": "Ost & Skinke",
        "desc": "Fantastisk pizza toppet med ost og skinke",
        "cart_desc": "Ost, skinke (av svin)",
        "image": "assets/img/P90.jpg",
        "price": 17800
    },
    {
        "id": 2,
        "name": "Skinke & Sjampinjong",
        "desc": "Fantastisk pizza toppet med skinke og sjampinjong",
        "cart_desc": "Ost, skinke (av svin), sjampinjong",
        "image": "assets/img/P12.jpg",
        "price": 19860
    },
    {
        "id": 3,
        "name": "Kjøttboller & Løk",
        "desc": "Fantastisk pizza toppet med kjøttboller og løk",
        "cart_desc": "Ost, kjøttboller, løk",
        "image": "assets/img/P30.jpg",
        "price": 27150
    },
];

//This function looks up details of a product by ID
function itemDetails(id) {
    //Variable to keep track of loops
    var i;

    //Loop through until the specific product
    for (i = 0; i < menu.length; i++) {
        if (menu[i].id === Number(id)) {
            return menu[i];
        }
    }
}

//This function builds the cart in the DOM
function buildMenu() {
    //Fetch the menu div
    var menuDIV = document.getElementById('menu');

    //Loop through the menu and add it to the menu div
    for (i = 0; i < menu.length; i++) {
        var menuItem = '<div class="col-sm-6 mb-3" id="menuOffering-' + menu[i].id + '">' +
            '<div class="card text-center">' +
            '<div class="card-body">' +
            '<img src="' + menu[i].image + '" alt="Pizza bilde" style="max-width: 90%;">' +
            '<h5 class="card-title">' + menu[i].name + '</h5>' +
            '<p class="card-text">' + menu[i].desc + '<br><strong>Pris: </strong>' + (menu[i].price/100).toFixed(2) + ',-' +
            '</p>' +
            '<button class="btn btn-primary" data-id="' + menu[i].id + '" onclick="addCart(this)">Legg til i kurv</button>' +
            '<div class="form-check mt-2">' +
            '<input class="form-check-input" type="checkbox" onchange="favoriteToggle(this)" value="' + menu[i].id + '" id="favorittCheck-' + menu[i].id + '">' +
            '<label class="form-check-label" for="favorittCheck-' + menu[i].id + '">Legg til som favoritt</label>' +
            '</div></div></div></div>';

        menuDIV.innerHTML += menuItem;
    }
}