// RESOURCES ---------------------------------------------------------------------------------------------------------------------------------
// GEOCODING API - Gets latitude and longitude from a city name
// http://api.positionstack.com/v1/forward?access_key=8ae92ff290e983b9c25ec44f51a128d4&query={INSERTCITYNAMEHERE}&limit=1

// WEATHER API - Gets weather data from a latitude and longitude
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=6908f19be130153ae9b75ad61e4a47a3





// html containers ----------------------------------------------------------------------------------------------------------------------------
const searchContainer = $('#searchContainer');
const contentContainer = $('#contentContainer');


// loading spinner -------------------------------------------------------------------------------------------------------------------------
function loadingSpinner(){
    let loadingSpinnerContainer = $('<div class="h-100 d-flex justify-content-center align-items-center">')
    let loadingSpinnerGroup = $('<div class="spinner-border text-primary" role="status">');
    let loadingSpinnerEl = $('<span class="visually-hidden">');
    loadingSpinnerGroup.append(loadingSpinnerEl);
    loadingSpinnerContainer.append(loadingSpinnerGroup);
    contentContainer.append(loadingSpinnerContainer);
    // deletes spinner after weather data loads
    setTimeout(function(){
        contentContainer.empty();
    }, 3000)
}



// Searchbar ------------------------------------------------------------------------------------------------------------------------------------
// generate searchbar onto page
const searchGroup = $('<div class="input-group m-3">');
let searchInput = $('<input type="text" class="form-control" placeholder="Input City" aria-label="Input City" aria-describedby="button-addon2">')
let searchButton = $('<button class="btn btn-outline-secondary" type="button" id="button-addon2">')
    .text('Search');
searchGroup.append(searchInput);
searchGroup.append(searchButton);
searchContainer.append(searchGroup);

// searchbar functionality
let currentCity = '';

// when search is clicked
searchButton.on('click', function(){
    if(searchInput.val() !== ''){
        currentCity = searchInput.val();

        // save input to search history
        saveCity(currentCity);
        genSearchHistory();

        // geocode inputted city
        geocode(currentCity)

        //get weather data after geocode data loads
        loadingSpinner();
        setTimeout(fetchWeatherData, 3000);
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
    // geocode city
    geocode(currentCity);
    //get weather data after geocode data loads
    loadingSpinner();
    setTimeout(fetchWeatherData, 3000);
})

// fetch geocoding api ---------------------------------------------------------------------------------------------------------------------
let currentLatitude = '';
let currentLongitude = '';

// geocodes city using geocoding api
function geocode(city){
    fetch(`http://api.positionstack.com/v1/forward?access_key=8ae92ff290e983b9c25ec44f51a128d4&query=${city}&limit=1`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            currentLatitude = data.data[0].latitude;
            currentLongitude = data.data[0].longitude;
        });
}

// fetch weather data api -------------------------------------------------------------------------------------------------------------------
function fetchWeatherData(){
    console.log(currentLatitude);
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${currentLatitude}&lon=${currentLongitude}&appid=6908f19be130153ae9b75ad61e4a47a3`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}


// generate weather data content ------------------------------------------------------------------------------------------------------------