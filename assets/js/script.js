var APIKey = "7202a3965a6ca2ab1f0e01acc25139b8";
var currentCity = $("#current-city")
var currentTemp = $("#temperature")
var humidity = $("#humidity")
var windSpeed = $("#wind-speed")
var searchButton = ("#search-button")

function displayWeather() {

    var city = $("#search-city").val()
    //READ - PArse
    var previousSearch = JSON.parse(localStorage.getItem("cityName")) || []
    previousSearch.push(city)
    localStorage.setItem("cityName", JSON.stringify(previousSearch))
    currentWeather(city)
    forecast(city)

    searchCity()
}

function searchCity() {

    
    var previousSearch = JSON.parse(localStorage.getItem("cityName")) || []
    $(".list-group").html("")
    for (var i = 0; i < previousSearch.length; i++) {
        
        $(".list-group").append(`<li><button class="previousSearch  btn bg-primary bg-gradient text-light">${previousSearch[i]}</button></li>`)

      
    }
}

searchCity()

$(".list-group").on("click", ".previousSearch", function (event) {
    var city = event.target.textContent //$(this).text()
    // console.log(city,"Previous")

    
    currentWeather(city)
    forecast(city)
}
)


function clearHistory() {
    localStorage.removeItem("cityName")
    $(".list-group").html("")

   
}

function currentWeather(city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey

    fetch(queryURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (response) {
            console.log(response)


            if(response.cod==="400"){
                alert("Please enter city. It cannot be empty.")
                clearHistory()
              }else if(response.cod==="404"){
              alert("Entered city not found.!!")
              clearHistory()
              } else{
              
          
           
          
//Data object from server side Api for icon property.
var weatherIcon = response.weather[0].icon
var iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"


//Date for the city
var convDate = dayjs(response.dt_txt).format("DD/MM/YYYY")

// var date= response.dt

//parse the response for name of city and concatinate the date and icon.
$(currentCity).html(response.name + " " + convDate + "<img src=" + iconUrl + ">")

//Data object for temp from server side Api
var tempF = (response.main.temp)
$(currentTemp).html(tempF + "&#8457")

//For Humidity
$(humidity).html(response.main.humidity + "%")

//For wind speed
$(windSpeed).html(response.wind.speed + " MPH")}

        })

    
}


//Function for five day forecast

function forecast(city) {

    var queryForecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIKey

    fetch(queryForecastURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (response) {
            console.log(response)

            //Icon for five day forecast  

            var j = 0;
            for (var i = 0; i < response.list.length; i = i + 8) {
                var iconCode = response.list[i].weather[0].icon
                var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png"

                var convDate = dayjs(response.list[i].dt_txt).format("DD/MM/YYYY")

                $("#fDate" + [j]).html(convDate)


                $("#fImg" + [j]).html("<img src=" + iconUrl + ">")

                $("#fTemp" + [j]).html(response.list[i].main.temp + "&#8457")
                $("#fWind" + [j]).html(response.list[i].wind.speed + " MPH")
                $("#fHumidity" + [j]).html(response.list[i].main.humidity + "%")
                j++
            }
        })


}

//Click event
$("#search-button").on("click", displayWeather)
$("#clear-history").on("click", clearHistory)