if (typeof (Storage) !== "undefined") {
    // Support for localStorage is detected

    //This encodes and saves the favorites
    function saveFavorite(detail) {
        //Since session and local only supports strings we convert to json
        var jsonValue = JSON.stringify(detail);

        localStorage.setItem('favorites', jsonValue);
    }

    //This function retrieves and decodes the favorites
    function fetchFavorite() {
        //Fetch the stored favorites in JSON format
        var jsonValue = localStorage.getItem('favorites');

        return JSON.parse(jsonValue);
    }

    function favoriteToggle(id) {
        //Fetch the list
        var favoriteList = fetchFavorite();

        //First check if it is already in the favorite list
        if (!favoriteList.includes(id.value)) {
            //Add to array
            favoriteList.push(id.value);
        } else {
            //Remove from array
            var index = favoriteList.indexOf(id.value);
            if (index > -1) {
                favoriteList.splice(index, 1);
            }
        }

        //Save it
        saveFavorite(favoriteList);

        //Always call to update the DOM elements
        buildFavoriteModalList();
        updateFavoriteCheckboxes();
    }

    function buildFavoriteModalList() {
        var favorites = fetchFavorite();
        var favoriteDiv = document.getElementById("favoriteContent");

        //For simplicity we start out by clearing the whole list.
        favoriteDiv.innerHTML = '';

        if (favorites.length === 0) {
            //There is no favorites. Sad times
            favoriteDiv.innerHTML = "<h2 class='text-center'>Du har ingen favoritter😞</h2>";
        } else {
            //There are favorites. Build the list
            for (i = 0; i < favorites.length; i++) {
                var favoriteItem = '<div class="card mb-3"><div class="row no-gutters"><div class="col-md-4">' +
                    '<img src="' + itemDetails(favorites[i]).image + '" class="card-img" alt="Pizza bilde">' +
                    '</div><div class="col-md-8"><div class="card-body">' +
                    '<h5 class="card-title">' + itemDetails(favorites[i]).name + '</h5>' +
                    '<p class="card-title h6">Pris: ' + (itemDetails(favorites[i]).price / 100).toFixed(2) + ',-</p>' +
                    '<p class="card-text">' + itemDetails(favorites[i]).desc + '</p>' +
                    '<p class="card-text">' +
                    '<button type="button" class="btn btn-primary" data-id="' + itemDetails(favorites[i]).id + '" onclick="addCart(this)">Legg til i handlekurv</button>' +
                    '</p></div></div></div></div>';

                favoriteDiv.innerHTML += favoriteItem;
            }
        }
    }

    function updateFavoriteCheckboxes() {
        //Fetch the current favorite list
        var favorites = fetchFavorite();

        //Loop through all favorite checkboxes and set checkbox status
        for (i = 0; i < favorites.length; i++) {
            var checkBox = document.getElementById("favorittCheck-" + favorites[i]);

            checkBox.checked = !!favorites.includes(checkBox.value);
        }
    }
} else {
    alert('Beklager, nettleseren din fungerer ikke med favoritt funksjonen');
}