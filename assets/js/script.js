// Searchbar ----------------------------------------------------------------------
const searchContainer = $('#searchContainer');

const searchGroup = $('<div class="input-group m-3">');
let searchInput = $('<input type="text" class="form-control" placeholder="Input City" aria-label="Input City" aria-describedby="button-addon2">')
let searchButton = $('<button class="btn btn-outline-secondary" type="button" id="button-addon2">')
    .text('Search');
searchGroup.append(searchInput);
searchGroup.append(searchButton);

searchContainer.append(searchGroup);

// Search history -----------------------------------------------------------------


// fetch weather data api ---------------------------------------------------------


// generate weather data content --------------------------------------------------