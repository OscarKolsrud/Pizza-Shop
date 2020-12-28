//Run the start sequence
window.onload = function () {
    //Init the cart if there is none defined
    if (!sessionStorage.cart) {
        saveCart([]);
    }
    buildCart();

    //Init a balance if none is defined
    if (!sessionStorage.balance) {
        //We store the balance as the lowest denomination of the currency
        sessionStorage.balance = 100000;
    }

    //Build other visual elements
    balanceDOM();
    buildMenu();

    //Then init the favorite array if none
    if (!localStorage.favorites) {
        saveFavorite([]);
    }
    //Then build favorites and set checkboxes
    buildFavoriteModalList();
    updateFavoriteCheckboxes();
}