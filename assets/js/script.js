const API = '8b792d8469d79e6095dc88e95785615c'
let lon 
let lat 
// let weatherData = {current:{temp:''}};
const weatherCard = $('.1')
const searchEl = $('.search-container')
const weatherEl = $('.weather-container')
const futureWeatherEl = $('.future-weather')
const currentWeatherEl = $('.current-weather')
const weatherLocation = $('.weather-location')
const locationInput = $('#location')
const savedLocationsEl = $('.saved-locations')
let savedLocations = []


// Used to convert abbreviations to full names
const states = { AL:'Alabama',  MO:'Missouri',
    AK:'Alaska',  MT:'Montana',
    AZ:'Arizona',  NE:'Nebraska',
    AR:'Arkansas',  NV:'Nevada',
     CA:'California',  NH:'New Hampshire',
     CO:'Colorado',  NJ:'New Jersey',
     CT:'Connecticut',  NM:'New Mexico',
     DE:'Delaware',  NY:'New York',
     DC:'District of Columbia',  NC:'North Carolina',
     FL:'Florida',  ND:'North Dakota',
     GA:'Georgia',  OH:'Ohio',
     HI:'Hawaii',  OK:'Oklahoma',
     ID:'Idaho',  OR:'Oregon',
     IL:'Illinois',  PA:'Pennsylvania',
     IN:'Indiana',  RI:'Rhode Island',
     IA:'Iowa',  SC:'South Carolina',
     KS:'Kansas',  SD:'South Dakota',
     KY:'Kentucky',  TN:'Tennessee',
     LA:'Louisiana',  TX:'Texas',
     ME:'Maine',  UT:'Utah',
     MD:'Maryland',  VT:'Vermont',
     MA:'Massachusetts',  VA:'Virginia',
     MI:'Michigan', WA:'Washington' ,
     MN:'Minnesota',  WV:'West Virginia',
     MS:'Mississippi',  WI:'Wisconsin',
     WY:'Wyoming'}

const stateAbbr = ['AL', 'MO', 'AK', 'MT', 'AZ', 'NE', 'AR', 'NV', 'CA', 'NH', 'CO', 'NJ', 'CT', 'NM', 'DE', 'NY',
                'DC', 'NC', 'FL', 'ND', 'GA', 'OH', 'HI', 'OK', 'ID', 'OR', 'IL', 'PA', 'IN', 'RI', 'IA', 'SC', 'KS',
                'SD', 'KY', 'TN', 'LA', 'TX', 'ME', 'UT', 'MD', 'VT', 'MA', 'VA', 'MI', 'WA', 'MN', 'WV', 'MS', 'WI', 'WY']



function currentWeather(data,location){

    // Main card for current weather
    const currentWeatherCard = $('<div>')
    const currentWeatherInfo = $('<div>')
    currentWeatherCard.addClass('card bg-light')
    currentWeatherInfo.addClass('card-body')


    // Current weather data
    const currentTemp = $('<p>').text('Temp: ' + data.current.temp + ' °F')
    const currentWind = $('<p>').text('Wind: ' + data.current.wind_speed + ' MPH')
    const currentHumidity = $('<p>').text('Humidity: ' + data.current.humidity + '%')
    const currentDate =  $('<p>').text(moment().format('MM/D/YY'))
    const currentWeatherIcon = $('<img>')
    const currentDescription = $('<p>').text('Weather: ' + data.current.weather[0].description.toUpperCase() )
    const currentUVI = data.current.uvi
    if (currentUVI<3){
        colorCode = 'green'
    }else if (currentUVI<6){
        colorCode = 'yellow'
    }else if (currentUVI<8){
        colorCode = 'orange'
    }else{
        colorCode = 'red'
    }
    const currentUVIEl = $('<p>').text('UV Index: '+currentUVI)
    currentUVIEl.attr('style','background-color:'+colorCode+';')
    currentWeatherIcon.attr('src','http://openweathermap.org/img/wn/'+(data.current.weather[0].icon)+'@2x.png');
    currentWeatherCard.attr('style','height:90%; width:100%;')

    // Append the information to the card
    currentWeatherInfo.append(location.toUpperCase(),currentDate,currentWeatherIcon,currentDescription,currentTemp,currentWind,currentHumidity,currentUVIEl)
    currentWeatherCard.append(currentWeatherInfo)
    currentWeatherEl.append(currentWeatherCard)
}

function futureWeather(data) {
    for (let i=0;i<5;i++) {

        // Main card for each day
        let dailyWeatherCard = $('<div>')
        let dailyWeatherInfo = $('<div>')

        // Weather data for each day
        const dailyTemp = $('<p>').text('Temp: ' + data.daily[i].temp.day + ' °F')
        const dailyWind = $('<p>').text('Wind: ' + data.daily[i].wind_speed + ' MPH')
        const dailyHumidity = $('<p>').text('Humidity: ' + data.daily[i].humidity + '%')
        const date =  $('<p>').text(moment.unix(data.daily[i].dt).format('MM/D/YY'))
        const icon = $('<img>').attr('src','http://openweathermap.org/img/wn/'+(data.daily[i].weather[0].icon)+'@2x.png');

        dailyWeatherCard.addClass('card col-12 col-md-5 col-lg-2 m-1' )
        dailyWeatherInfo.addClass('card-body '+JSON.stringify(i))
        dailyWeatherCard.attr('style',' height:300px;')

        // Append the information to the card for each day
        dailyWeatherInfo.append(date,icon,dailyTemp,dailyWind,dailyHumidity)
        dailyWeatherCard.append(dailyWeatherInfo)
        futureWeatherEl.append(dailyWeatherCard)
    }
}

function updateData(data,location){
    if (currentWeatherEl.children){
        currentWeatherEl.empty()
    }
    if (futureWeatherEl.children){
        futureWeatherEl.empty()
    }
    console.log(data)
    currentWeather(data,location)
    futureWeather(data)
}


// Api call for weather data once location information is received
function getWeather(location){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API}&units=imperial`)
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
        updateData(data,location)
    })
    .catch(err=>console.log(err))
}

function getCoords(location){
    console.log(location,'prob')
    // If state provided
    if (location.includes(',')){
        location = location.split(',')
        const city = location[0].trim()
        let state = location[1].toUpperCase().trim()

        // If stat initials were used, converts to full name
        if (stateAbbr.includes(state)){
            state = states[state]
        }
        location = city + ',' + state
    }
    else{
        location = location.trim()
    }
    saveLocation(location)
    // Api call to get longitude and latitude to receive more weather data from onecall(The getWeather fetch)
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API}&units=imperial`)
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
        if (data.cod===200){
            lon = data.coord.lon
            lat = data.coord.lat
            getWeather(location)
        }
        else {
            alert(data.message)
        }
    })
    .catch(err=>console.log(err))
}


function loadSavedLocations(){
    if (savedLocationsEl.children) {
        savedLocationsEl.empty()
    }
    savedLocations = JSON.parse(localStorage.getItem('savedLocations'))
    console.log(savedLocations)
    if (!savedLocations){
        savedLocations = []
    }

    // Creates links for saved locations with newer entries on top
    for (let i=savedLocations.length-1;i>=0;i--){
        console.log(savedLocations[i])
        savedLocationsEl.append($('<div class="bg-light text-center p-1 m-1"></div>').text(savedLocations[i]).on('click',function(){
            getCoords(savedLocations[i])
        }))

    }
}
// Saves 10 unique locations to storage
function saveLocation(location){
    location = location.toUpperCase()

    if (!savedLocations.includes(location)){
        if (savedLocations.length>=10){
            savedLocations.shift()
        }
        savedLocations.push(location)
        localStorage.setItem('savedLocations',JSON.stringify(savedLocations))
        loadSavedLocations()
    }
}

// Receives the location information, saves, and gets weather
function handleSubmit(event){
    event.preventDefault();
    if (!locationInput.val()){
        return
    }
    getCoords(locationInput.val())
    locationInput.val('')
    // saveLocation(locationInput.val().split(','))
}

// Loads on page refresh
function init(){
    weatherLocation.on('submit',handleSubmit)
    loadSavedLocations()
}

init()
