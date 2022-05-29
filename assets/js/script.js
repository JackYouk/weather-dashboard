// RESOURCES ---------------------------------------------------------------------------------------------------------------------------------
// GEOCODING API - Gets latitude and longitude from a city name
// http://api.positionstack.com/v1/forward?access_key=8ae92ff290e983b9c25ec44f51a128d4&query={INSERTCITYNAMEHERE}&limit=1

// WEATHER API - Gets weather data from a latitude and longitude
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}






// Searchbar ------------------------------------------------------------------------------------------------------------------------------------
// generate searchbar onto page
const searchContainer = $('#searchContainer');
const searchGroup = $('<div class="input-group m-3">');
let searchInput = $('<input type="text" class="form-control" placeholder="Input City" aria-label="Input City" aria-describedby="button-addon2">')
let searchButton = $('<button class="btn btn-outline-secondary" type="button" id="button-addon2">')
    .text('Search');
searchGroup.append(searchInput);
searchGroup.append(searchButton);
searchContainer.append(searchGroup);

// searchbar functionality
let currentCity = '';

searchButton.on('click', function(){
    if(searchInput.val() !== ''){
        currentCity = searchInput.val();
        saveCity(currentCity);
        genSearchHistory();
    }else{
        alert('Please enter a valid city name.');
    }
})



// Search history --------------------------------------------------------------------------------------------------------------------------
// save city to local storage function
let savedCities = JSON.parse(localStorage.getItem("savedCities") || "[]");
function saveCity(city){
    savedCities.push(city);
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
}

// generate search history from local storage
let historyContainer = $('<div>');
searchContainer.append(historyContainer);
function genSearchHistory(){
    historyContainer.empty();
    let localSaved = JSON.parse(localStorage.getItem("savedCities") || "[]");
    for(let i = 0; i < localSaved.length; i++){
        let savedCityBtn = $('<button type="button" class="btn btn-secondary m-3">')
            .addClass('savedCityBtn')
            .text(localSaved[i]);
        historyContainer.append(savedCityBtn);
    }
}
genSearchHistory();

// search history functionality
$('.savedCityBtn').on('click', function(){
    currentCity = $(this).text();
    console.log(currentCity);
})



// fetch weather data api -------------------------------------------------------------------------------------------------------------------


// generate weather data content -------------------------------------------------------------------------------------------------------------