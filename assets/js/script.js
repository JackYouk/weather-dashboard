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
    contentContainer.empty();
    let loadingSpinnerContainer = $('<div class="h-100 d-flex justify-content-center align-items-center">')
    let loadingSpinnerGroup = $('<div class="spinner-border text-primary" role="status">');
    let loadingSpinnerEl = $('<span class="visually-hidden">');
    loadingSpinnerGroup.append(loadingSpinnerEl);
    loadingSpinnerContainer.append(loadingSpinnerGroup);
    contentContainer.append(loadingSpinnerContainer);
}


// Searchbar ------------------------------------------------------------------------------------------------------------------------------------
// generate searchbar onto page
const searchGroup = $('<div class="input-group m-3">');
let searchInput = $('<input type="text" class="form-control" placeholder="Input City" aria-label="Input City" aria-describedby="button-addon2">')
let searchButton = $('<button class="btn btn-outline-secondary mr-3" type="button" id="button-addon2">')
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
        setTimeout(fetchWeatherData, 4500);

        // generate weather forcast
        setTimeout(genWeatherContent, 5500);
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
    //get weather data after geocode data loads
    loadingSpinner();
    // setTimeout(fetchWeatherData, 4500);
    fetchWeatherData(currentCity);
    // generate weather forcast
    setTimeout(genWeatherContent, 3000);
})

// fetch weather data api -------------------------------------------------------------------------------------------------------------------
let currentLatitude = '';
let currentLongitude = '';
let currentIcon = '';
let currentUnix = '';
let currentTemp = '';
let currentWind = '';
let currentHumidity = '';
let forecastDataArr = [];

function fetchWeatherData(city){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=6908f19be130153ae9b75ad61e4a47a3&units=imperial`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            // checks to make sure city was entered correctly
            if(data.cod === '404'){
                alert('Please Enter a Valid City');
                return;
            }else if(data.cod === '200'){
                // weather data for current day
                currentLatitude = data.city.coord.lat;
                currentLongitude = data.city.coord.lon;
                currentIcon = data.list[0].weather[0].icon;
                currentUnix = data.list[0].dt;
                currentTemp = data.list[0].main.temp;
                currentWind = data.list[0].wind.speed;
                currentHumidity = data.list[0].main.humidity;
                fetchUVI(currentLatitude, currentLongitude);
                // 5day forecast data (added to forecastDataArr) as objects
                forecastDataArr = [];
                for(let i = 1; i < 6; i++){
                    let forecastObject = {
                        unix: data.list[i].dt,
                        icon: data.list[i].weather[0].icon,
                        temp: data.list[i].main.temp,
                        wind: data.list[i].wind.speed,
                        humidity: data.list[i].main.humidity,
                    }
                    forecastDataArr.push(forecastObject);
                }
                return;
            }else{
                alert('Something went wrong, please try again.');
                return;
            }
        });
}

function fetchUVI(lat, long){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=6908f19be130153ae9b75ad61e4a47a3`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data){
            console.log(data);
            currentUV = data.current.uvi;
            return;
        })
}


// generate weather data content ------------------------------------------------------------------------------------------------------------
function genWeatherContent(){
    // clear content container
    contentContainer.empty();

    // generate current weather data ---------------------------------
    const currentWeatherContainer = $('<div>');

    // header with city and date/time and weather icon
    let date = moment.unix(currentUnix).format('L');
    let currentWeatherHeader = $('<h3 class="d-inline-flex align-items-center ml-3 pl-2 headerBG border border-primary rounded">')
        .text(currentCity + ' ' + date);
    currentWeatherContainer.append(currentWeatherHeader);
    let currentWeatherIcon = $(`<img src="./assets/images/${currentIcon}@2x.png" width="80px"/>`)
    currentWeatherHeader.append(currentWeatherIcon);

    // stats
    let statsGroup = $('<div class="d-inline-flex align-items-center ml-3 p-1 bg-light border border-dark rounded">');
    // current weather conditions label
    // let conditionsLabel = $('<p class="font-italic m-2">')
    //     .text('Current Conditions -');
    // statsGroup.append(conditionsLabel);
    // temp
    let tempEl = $('<p class="m-1">')
        .text(`Temp: ${currentTemp}°F`);
    statsGroup.append(tempEl);
    // wind
    let windEl = $('<p class="m-1">')
        .text(`Wind: ${currentWind}mph`);
    statsGroup.append(windEl);
    // humidity
    let humidityEl = $('<p class="m-1">')
        .text(`Humidity: ${currentHumidity}%`);
    statsGroup.append(humidityEl);
    // uv index (color changing)
    let uvEl = $('<p class="m-1">')
        .text(`UV Index: `);
    let uvElSpan = $('<span>')
        .text(currentUV);
    uvEl.append(uvElSpan);
    if(currentUV < 3){
        uvElSpan.addClass('bg-success p-1 rounded');
    }else if(currentUV < 8){
        uvElSpan.addClass('bg-warning p-1 rounded');
    }else{
        uvElSpan.addClass('bg-danger p-1 rounded');
    }
    statsGroup.append(uvEl);
    // statsGroup.append(uvEl);
    currentWeatherContainer.append(statsGroup);

    // append current conditions content to screen
    contentContainer.append(currentWeatherContainer);

    // generate 5 day forecast -----------------------------------

    // forecast container
    const forecastGroup = $('<div>');

    // 5 day forecast label
    let forecastLabel = $('<p class="font-weight-bold d-inline-flex align-items-center m-3 p-1 bg-light border border-dark rounded">')
        .text('5 Day Forecast:');
    forecastGroup.append(forecastLabel);

    // generate the 5 forecast cards
    // card group
    const cardGroup = $('<div class="d-flex row justify-content-center">');

    // for loop to create individual cards
    for(let i = 0; i <forecastDataArr.length; i++){
        // card div
        let cardDiv = $('<div class="col-9 col-md-2 card p-1 m-3" style="width: 20px;">');
        // card image
        let cardImg = $(`<img src="./assets/images/${forecastDataArr[i].icon}@2x.png" width="10px" class="card-img-top">`);
        cardDiv.append(cardImg);
        // cardbody div
        let cardBodyDiv = $('<div class="card-body">');
            // date header
            let forecastDate = moment.unix(forecastDataArr[i].unix).format('M/D/YY');
            let cardHeader = $('<h5 class="card-title">')
                .text(forecastDate);
            cardBodyDiv.append(cardHeader);
            // temp p
            let cardTemp = $('<p class="card-text">')
                .text(`Temp: ${forecastDataArr[i].temp}°F`);
            cardBodyDiv.append(cardTemp);
            // wind p
            let cardWind = $('<p class="card-text">')
                .text(`Wind: ${forecastDataArr[i].wind}mph`);
            cardBodyDiv.append(cardWind);
            // humidity p
            let cardHumidity = $('<p class="card-text">')
                .text(`Humidity: ${forecastDataArr[i].humidity}%`);
            cardBodyDiv.append(cardHumidity);

            cardDiv.append(cardBodyDiv);
        // append to cardGroup
        cardGroup.append(cardDiv);
    }

    // append cardgroup to forecastGroup
    forecastGroup.append(cardGroup);

    // append forecast
    contentContainer.append(forecastGroup);
}
