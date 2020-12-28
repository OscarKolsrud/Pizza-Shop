//Run the start sequence
window.onload = function () {
    saveCart([]);
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