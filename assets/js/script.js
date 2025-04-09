let lon 
let lat 
let GEO_LOCATION_API

const mainBackground = $('body');
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



function currentWeather(data, location){
    if (!data?.main || !(data?.weather?.length > 0)) {
        return 
    }

    // Main card for current weather
    const currentWeatherCard = $('<div>')
    const currentWeatherInfo = $('<div>')
    currentWeatherCard.addClass('card')
    currentWeatherInfo.addClass('card-body')


    // Current weather data
    
    const currentTemp = $('<p>').text('Temp: ' + data.main.temp + ' °F')
    const currentWind = $('<p>').text('Wind: ' + data.main.wind_speed + ' MPH')
    const currentHumidity = $('<p>').text('Humidity: ' + data.main.humidity + '%')
    const currentDate =  $('<h5>').text(moment().format('MM/D/YY'))
    const currentWeatherIcon = $('<img>')
    const currentDescription = $('<p>').text('Weather: ' + data.weather[0].description.toUpperCase() )
    // const currentUVI = data.current.uvi

    // Displays only the city name
    const currentCity = $('<h3>').text(location.toUpperCase().split(',')[0])

    // Color for UVIndex
    // if (currentUVI<3){
    //     colorCode = 'green'
    // }else if (currentUVI<6){
    //     colorCode = 'yellow'
    // }else if (currentUVI<8){
    //     colorCode = 'orange'
    // }else{
    //     colorCode = 'red'
    // }


    // const currentUVIEl = $('<p>').text('UV Index: ')
    // const currentUVISpan = $('<span>').text(currentUVI)
    // currentUVISpan.attr('style','background-color:'+colorCode+'; border-radius:5px; padding:2px 4px; color:white;')

    // Weather picture
    currentWeatherIcon.attr('src','https://openweathermap.org/img/wn/'+(data.weather[0].icon)+'@2x.png');
    currentWeatherCard.attr('style','height:90%; width:100%;')
    const currentWeather = data.weather[0].main

    const weatherBackgrounds = ['Clear','Clouds','Haze','Mist','Rain','Snow','Thunderstorm']
    if(weatherBackgrounds.includes(currentWeather)){

        mainBackground.attr('style',`background-image:url(assets/images/${currentWeather}.jpg);background-position:fixed;`)
    } else {
        mainBackground.attr('style','background-color:rgb(123, 176, 255)');

    }

    
    // Append the information to the card
    // currentUVIEl.append(currentUVISpan)
    currentWeatherInfo.append(currentCity,currentDate,currentWeatherIcon,currentDescription,currentTemp,currentWind,currentHumidity)
    currentWeatherCard.append(currentWeatherInfo)
    currentWeatherEl.append(currentWeatherCard)
}

function getFutureWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${GEO_LOCATION_API}&units=imperial`).then(res => res.json()).then(data => {

        const futureWeatherTitle = $('<h2>').text('5 Day Forecast:')
        futureWeatherTitle.attr('style','background: linear-gradient(to top,rgb(39, 72, 178),rgb(85, 124, 252));padding:1rem;color:white;margin:0;border-radius:0.3rem;')
        futureWeatherEl.append(futureWeatherTitle)

        if (!(data?.list?.length > 0)) {
            return
        }

        const midDayWeather = data.list.filter(weather => weather.dt_txt?.endsWith('15:00:00'))

        for (let i = 0; i < 5; i++) {
            if (!midDayWeather[i]) {
                return
            }
            
            // Main card for each day
            let dailyWeatherCard = $('<div>')
            let dailyWeatherInfo = $('<div>')
    
            // Weather data for each day
            const dailyTemp = $('<p>').text('Temp: ' + midDayWeather[i].main.temp + ' °F')
            const dailyWind = $('<p>').text('Wind: ' + midDayWeather[i].wind.speed + ' MPH')
            const dailyHumidity = $('<p>').text('Humidity: ' + midDayWeather[i].main.humidity + '%')
            const date =  $('<h4>').text(moment.unix(midDayWeather[i].dt).format('MM/D/YY'))
    
            // Weather picture
            const icon = $('<img>').attr('src','https://openweathermap.org/img/wn/'+(midDayWeather[i].weather[0].icon)+'@2x.png');
    
            dailyWeatherCard.addClass('card col-12 col-sm-6 col-md-3 col-xl-2' )
            dailyWeatherInfo.addClass('card-body '+JSON.stringify(i))
            // dailyWeatherCard.attr('style',' height:300px;')
    
            // Append the information to the card for each day
            dailyWeatherInfo.append(date,icon,dailyTemp,dailyWind,dailyHumidity)
            dailyWeatherCard.append(dailyWeatherInfo)
            futureWeatherEl.append(dailyWeatherCard)
        }
    })
    .catch(err => console.error(err))
}

// Clears screen and updates the weather info for new location
function updateData(data,location){
    if (currentWeatherEl.children){
        currentWeatherEl.empty()
    }

    if (futureWeatherEl.children){
        futureWeatherEl.empty()
    }

    currentWeather(data, location)
    getFutureWeather()
}


// Api call for weather data once location information is received
function getWeather(location){
    
    saveLocation(location)
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${GEO_LOCATION_API}&units=imperial`)
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

    if (GEO_LOCATION_API) {
        selectCoordinateURL(location)
    } else {
        getAPIKey(location)
    }
   
}

function getAPIKey(location) {
    
    // Fetch api key
    fetch('https://charity-raffle.herokuapp.com/api/weather-key')
    .then(res => res.json())
    .then(data => {
        console.log(data, 'GETTING API KEY')
        // If valid key, fetch coordinates
        if (data !== "UNAUTHORIZED") {
            GEO_LOCATION_API = data;

            selectCoordinateURL(location)
        }
    })
    .catch(err => console.log(err))
}

function selectCoordinateURL(location) {
    // If numbers entered
    if (['0','1','2','3','4','5','6','7','8','9'].includes(location[0])){
        getCoords(`https://api.openweathermap.org/geo/1.0/zip?zip=${location}&appid=${GEO_LOCATION_API}`, location)
    } else {
        getCoords(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=${1}&appid=${GEO_LOCATION_API}`, location)
    }
}

function getCoords(url, location){
    fetch(url)
    .then(res=>{
        return res.json()
        })
    .then(data=>{
        if (data.cod!=='404' && (data[0]||data.lon)){
            
            // Array returned if fetched using city
            if (data[0]){
                lon = data[0].lon
                lat = data[0].lat
                getWeather(location)
            }

            // Object returned using zip code
            else{
                lon = data.lon
                lat = data.lat
                getWeather(data.name)
            }

        }
        else {
            locationInput.val('')
            locationInput.attr('placeholder','Enter a Valid Location')
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
