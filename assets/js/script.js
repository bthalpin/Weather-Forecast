const API = '8b792d8469d79e6095dc88e95785615c'
let lon 
let lat 

function getWeather(){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API}&units=imperial`)
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
    })
}

function getCoords(){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=boston, massachusettes&appid=${API}&units=imperial`)
    .then(res=>res.json())
    .then(data=>{
        lon = data.coord.lon
        lat = data.coord.lat
        getWeather()
    })
}

getCoords()
const searchEl = $('.search-container')
const weatherEl = $('.weather-container')
const futureWeatherEl = $('.future-weather')
const currentWeatherEl = $('.current-weather')

const currentWeatherCard = $('<div>')
const currentWeatherInfo = $('<div>')
currentWeatherCard.addClass('card bg-light')
currentWeatherInfo.addClass('card-body')
currentWeatherCard.attr('style','height:90%; width:100%;')
currentWeatherCard.append(currentWeatherInfo)
currentWeatherEl.append(currentWeatherCard)

for (let i=0;i<5;i++) {
    let dailyWeatherCard = $('<div>')
    let dailyWeatherInfo = $('<div>')
    dailyWeatherInfo.text('test')
    dailyWeatherCard.addClass('card col-12 col-md-6 col-lg-2')
    dailyWeatherInfo.addClass('card-body')
    dailyWeatherCard.attr('style',' height:300px;')
    dailyWeatherCard.append(dailyWeatherInfo)
    futureWeatherEl.append(dailyWeatherCard)
    futureWeatherEl.addClass('d-flex justify-content-around')
}