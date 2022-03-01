const API = '8b792d8469d79e6095dc88e95785615c'
let lon 
let lat 
// let weatherData = {current:{temp:''}};
const weatherCard = $('.1')
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
    currentWeatherCard.addClass('card')
    currentWeatherInfo.addClass('card-body')


    // Current weather data
    const currentCity = $('<h3>').text(location.toUpperCase())
    const currentTemp = $('<p>').text('Temp: ' + data.current.temp + ' °F')
    const currentWind = $('<p>').text('Wind: ' + data.current.wind_speed + ' MPH')
    const currentHumidity = $('<p>').text('Humidity: ' + data.current.humidity + '%')
    const currentDate =  $('<p>').text(moment().format('MM/D/YY'))
    const currentWeatherIcon = $('<img>')
    const currentDescription = $('<p>').text('Weather: ' + data.current.weather[0].description.toUpperCase() )
    const currentUVI = data.current.uvi

    // Color for UVIndex
    if (currentUVI<3){
        colorCode = 'green'
    }else if (currentUVI<6){
        colorCode = 'yellow'
    }else if (currentUVI<8){
        colorCode = 'orange'
    }else{
        colorCode = 'red'
    }

    const currentUVIEl = $('<p>').text('UV Index: ')
    const currentUVISpan = $('<span>').text(currentUVI)
    currentUVISpan.attr('style','background-color:'+colorCode+'; border-radius:5px; padding:2px 4px; color:white;')

    // Weather picture
    currentWeatherIcon.attr('src','https://openweathermap.org/img/wn/'+(data.current.weather[0].icon)+'@2x.png');
    currentWeatherCard.attr('style','height:90%; width:100%;')

    // Append the information to the card
    currentUVIEl.append(currentUVISpan)
    currentWeatherInfo.append(currentCity,currentDate,currentWeatherIcon,currentDescription,currentTemp,currentWind,currentHumidity,currentUVIEl)
    currentWeatherCard.append(currentWeatherInfo)
    currentWeatherEl.append(currentWeatherCard)
}

function futureWeather(data) {
    for (let i=1;i<6;i++) {

        // Main card for each day
        let dailyWeatherCard = $('<div>')
        let dailyWeatherInfo = $('<div>')

        // Weather data for each day
        const dailyTemp = $('<p>').text('Temp: ' + data.daily[i].temp.day + ' °F')
        const dailyWind = $('<p>').text('Wind: ' + data.daily[i].wind_speed + ' MPH')
        const dailyHumidity = $('<p>').text('Humidity: ' + data.daily[i].humidity + '%')
        const date =  $('<h4>').text(moment.unix(data.daily[i].dt).format('MM/D/YY'))

        // Weather picture
        const icon = $('<img>').attr('src','https://openweathermap.org/img/wn/'+(data.daily[i].weather[0].icon)+'@2x.png');

        dailyWeatherCard.addClass('card col-12 col-sm-5 col-md-4 col-xl-2' )
        dailyWeatherInfo.addClass('card-body '+JSON.stringify(i))
        dailyWeatherCard.attr('style',' height:300px; min-width:190px;')

        // Append the information to the card for each day
        dailyWeatherInfo.append(date,icon,dailyTemp,dailyWind,dailyHumidity)
        dailyWeatherCard.append(dailyWeatherInfo)
        futureWeatherEl.append(dailyWeatherCard)
    }
}

// Clears screen and updates the weather info for new location
function updateData(data,location){
    if (currentWeatherEl.children){
        currentWeatherEl.empty()
    }
    if (futureWeatherEl.children){
        futureWeatherEl.empty()
    }
    currentWeather(data,location)
    futureWeather(data)
}


// Api call for weather data once location information is received
function getWeather(location){
    
    saveLocation(location)
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API}&units=imperial`)
    .then(res=>res.json())
    .then(data=>{
        updateData(data,location)
    })
    .catch(err=>console.log(err))
}

function cleanUpLocation(location) {
    locationInput.val('')
    locationInput.attr('placeholder','Enter a City')
    
    // If state provided
    if (location.includes(',')){
        location = location.split(',')
        const city = location[0].trim()
        let state = location[1].toUpperCase().trim()

        // If stat initials were used, converts to full name
        if (stateAbbr.includes(state)){
            state = states[state]
        }
        location = city + ', ' + state
    }
    else{
        location = location.trim()
    }
    console.log(location)
    // If numbers entered
    if (['0','1','2','3','4','5','6','7','8','9'].includes(location[0])){
        getCoords(`https://api.openweathermap.org/geo/1.0/zip?zip=${location}&appid=${API}`,location)
    } else {
        getCoords(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=${1}&appid=${API}`,location)
    }
}


function getCoords(url,location){
    console.log(location)
    fetch(url)
    .then(res=>{
        return res.json()
        })
    .then(data=>{
        if (data.cod!=='404' && (data[0]||data.lon)){
            console.log(data)
            if (data[0]){
                
                lon = data[0].lon
                lat = data[0].lat
                getWeather(location)
            }
            else{
                lon = data.lon
                lat = data.lat
                getWeather(data.name)
            }

        }
        else {
            locationInput.val('')
            locationInput.attr('placeholder','Invalid location')
            return
        }
    })
    .catch(err=>console.log(err))   
    
}

// Clears and loads saved locations
function loadSavedLocations(){
    if (savedLocationsEl.children) {
        savedLocationsEl.empty()
    }
    savedLocations = JSON.parse(localStorage.getItem('savedLocations'))
    if (!savedLocations){
        savedLocations = []
    }

    // Creates links for saved locations with newer entries on top
    for (let i=savedLocations.length-1;i>=0;i--){
        savedLocationsEl.append($('<div class="text-center text-wrap p-1 my-1 saved rounded"></div>').text(savedLocations[i]).on('click',function(){
            cleanUpLocation(savedLocations[i])
        }))

    }
}
// Saves 10 unique locations to storage
function saveLocation(location){
    location = location.toUpperCase()
    console.log(location)

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
    cleanUpLocation(locationInput.val())
    // locationInput.val('')
    // saveLocation(locationInput.val().split(','))
}

// Loads on page refresh
function init(){
    weatherLocation.on('submit',handleSubmit)
    loadSavedLocations()
}

init()
