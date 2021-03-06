var searchbutton = $("#search-button");
var apiKey = "d899707429dae12637678613a5874634";
var searchinput = "";
var todayTemp = $("#todaytemp");
var todayWind = $("#todaywind");
var todayHumidity = $("#todayhumidity");
var todayUv = $("todayuvindex");
var currentDate = moment().format("M/D/YYYY");
var cityName = "";
var dailyDivs = [$("#daily-1div"), $("#daily-2div"), $("#daily-3div"), $("#daily-4div"), $("#daily-5div")];
var savedCities = JSON.parse (localStorage.getItem("savedCities")) || [];
var myIcon = document.querySelector("#weathericon");



for (var i = 0; i < savedCities.length; i ++) {
    var city = savedCities[i];
    var cityNameEl = $("<li>");//making line
    cityNameEl.addClass("btn list-group-item");
    cityNameEl.text(city);
    $("#city-list").append(cityNameEl);//creating city list 
}

var keyCount = 0;
searchbutton.click(function(){
    console.log ("buttonwasclicked")
    searchinput = $("#inputcity").val().trim(); 
    //get value in inputcity and trim empty spaces
    var previouslySavedCities = JSON.parse(localStorage.getItem("savedCities")) || []
    previouslySavedCities.push(searchinput)//new city searched to push to array then push to local storage
    localStorage.setItem("savedCities", JSON.stringify(previouslySavedCities)) //can only save a string to local storage
    getUserLocation(searchinput);
});

function getSavedCityWeather(){
    getUserLocation($(this).text())
}


function getUserLocation (searchinput){
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchinput + "&limit=1&appid=" + apiKey;
    fetch(apiUrl).then(function(response){
        if (response.ok){
            response.json().then(function(data){
            console.log(data);
              // Gets the lon and lat of the location
              var locationLat = data[0].lat;
              var locationLon = data[0].lon;
              cityName = data[0].name;
              // Convert from Int to Str
              var latString = locationLat.toString();
              var lonString = locationLon.toString();
              // Call function to get values
              getWeatherLocation(latString, lonString);  
            });
        } else {
            alert("Location Not Found");
        }
    });
};

function getWeatherLocation (lat, lon){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;
    fetch (apiUrl).then(function(response){
        if  (response.ok){
            response.json().then(function(data){
                console.log(data);
                var currentCityNameEl = $("#cityname");
                    currentCityNameEl.text(cityName.toUpperCase()+ " " + currentDate);
                myIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png")
                var currentTempEl = $("#todaytemp");
                    currentTempEl.text(data.current.temp  + "\xB0F");
                var currentWindEl = $("#todaywind");
                    currentWindEl.text(data.current.wind_speed + "MPH");
                var currentHumidityEl = $("#todayhumidity");
                    currentHumidityEl.text(data.current.humidity+ "%");
                var currentUvEl = $("#todayuvindex");
                    currentUvEl.text(data.current.uvi);
                if (data.current.uvi < 3) {
                    currentUvEl.addClass("green");
                }
                else if (data.current.uvi >3 && data.current.uvi <7){
                    currentUvEl.removeClass("green");
                    currentUvEl.addClass("yellow");
                }
                else {
                    currentUvEl.removeClass("green");
                    currentUvEl.removeClass("yellow");
                    currentUvEl.addClass("red");
                }

        for ( var i = 0; i < dailyDivs.length; i ++){
            var humanDateFormat = new Date(data.daily[i + 1].dt * 1000).toLocaleDateString("en-US");
            dailyDivs[i].find(".dateText").text(humanDateFormat);
            var weatherSelector = "#weathericon"+ (i+1);
            dailyDivs[i].find(weatherSelector).attr("src", "http://openweathermap.org/img/wn/" + data.daily[i+1].weather[0].icon + "@2x.png");
            dailyDivs[i].find(".tempText").text(data.daily[i + 1].temp.day  + "\xB0F");
            dailyDivs[i].find(".windText").text(data.daily[i + 1].wind_speed + "MPH");
            dailyDivs[i].find(".humidityText").text(data.daily[i + 1].humidity + "%");
            dailyDivs[i].find(".uvText").text(data.daily[i + 1].uvi);
        }
            });
        }
    });
};

$("#city-list").on("click", "list-group-item", getSavedCityWeather)