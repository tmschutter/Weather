const weatherCodes = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing Rime Fog',
    51: 'Drizzle (Light)',
    53: 'Drizzle (Moderate)',
    55: 'Drizzle (Heavy)',
    56: 'Freezing Drizzle (Light)',
    57: 'Freezing Drizzle (Heavy)',
    61: 'Rain (Light)',
    63: 'Rain (Moderate)',
    65: 'Rain (Heavy)',
    66: 'Freezing Rain (Light)',
    67: 'Freezing Rain (Heavy)',
    71: 'Snow Fall (Light)',
    73: 'Snow Fall (Moderate)',
    75: 'Snow Fall (Heavy)',
    77: 'Snow Grains',
    80: 'Rain Showers (Light)',
    81: 'Rain Showers (Moderate)',
    82: 'Rain Showers (Heavy)',
    85: 'Snow Showers (Light)',
    86: 'Snow Showers (Heavy)',
    95: 'Thunderstorm',
    96: 'Thunderstorm'
}

const weatherIcons = {
    0: '<i class="bi bi-sun h1"></i>',
    1: '<i class="bi bi-sun h1"></i>',
    2: '<i class="bi bi-cloud-sun h1"></i>',
    3: '<i class="bi bi-cloud h1"></i>',
    45: '<i class="bi bi-cloud-haze h1"></i>',
    48: '<i class="bi bi-cloud-haze h1"></i>',
    51: '<i class="bi bi-cloud-drizzle h1"></i>',
    53: '<i class="bi bi-cloud-drizzle h1"></i>',
    55: '<i class="bi bi-cloud-drizzle h1"></i>',
    56: '<i class="bi bi-cloud-sleet h1"></i>',
    57: '<i class="bi bi-cloud-sleet h1"></i>)',
    61: '<i class="bi bi-cloud-rain h1"></i>',
    63: '<i class="bi bi-cloud-rain h1"></i>',
    65: '<i class="bi bi-cloud-rain-heavy h1"></i>',
    66: '<i class="bi bi-cloud-hail h1"></i>',
    67: '<i class="bi bi-cloud-hail h1"></i>',
    71: '<i class="bi bi-cloud-snow h1"></i>',
    73: '<i class="bi bi-cloud-snow h1"></i>',
    75: '<i class="bi bi-cloud-snow h1"></i>',
    77: '<i class="bi bi-cloud-snow h1"></i>',
    80: '<i class="bi bi-cloud-rain h1"></i>',
    81: '<i class="bi bi-cloud-rain h1"></i>',
    82: '<i class="bi bi-cloud-rain-heavy h1"></i>',
    85: '<i class="bi bi-cloud-snow h1"></i>',
    86: '<i class="bi bi-cloud-snow h1"></i>',
    95: '<i class="bi bi-cloud-lightning-rain h1"></i>',
    96: '<i class="bi bi-cloud-lightning-rain h1"></i>'
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const getWeather = document.getElementById('getWeather')

getWeather.addEventListener('click', async ()=>{
    let inputZip = document.getElementById('inputZip')
    let locData = await geolocFromZip(inputZip.value)
    let forecast = await forecastFromLocData(locData.lat, locData.lon)

    let resultsHTML = document.querySelector('#daily')
    resultsHTML.style.display = null
    populateCurrent(forecast.current_weather, locData)
    populateDaily(forecast.daily)
})

async function geolocFromZip(zip){
    const response = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${zip}&format=json&countrycodes=us`)
    const data = await response.json()
    const locData = {}
    locData.locName = data[0].display_name
    locData.lat = data[0].lat
    locData.lon = data[0].lon
    return locData
}

async function forecastFromLocData(lat, lon){
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}
&current_weather=true
&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max
&temperature_unit=fahrenheit
&windspeed_unit=mph
&precipitation_unit=inch
&timezone=America%2FNew_York`
        )
    const data = await response.json()
    return data
}

function dateTranslate(input){
    let dateArray = input.split('-')
    let day = dateArray[2]
    let year = dateArray[0]
    let month = months[parseInt(dateArray[1])-1]
    return `${day} ${month} ${year}`
}

function populateCurrent(obj, obj2){
    const currentTemp = document.querySelector('.currentTemp')
    const currentWind = document.querySelector('.currentWind')
    const currentWeather = document.querySelector('.currentWeather')
    const currentLocation = document.querySelector('.location')

    currentLocation.innerHTML = obj2.locName
    currentTemp.innerHTML = `${obj.temperature}\u00B0 F`
    currentWind.innerHTML = `Wind: ${obj.windspeed} MPH`
    currentWeather.innerHTML = `${weatherIcons[obj.weathercode]}<br>${weatherCodes[obj.weathercode]}`
}

function populateDaily(obj){
    const date = document.querySelectorAll('.date')
    const precip = document.querySelectorAll('.precip')
    const temp = document.querySelectorAll('.temp')
    const weather = document.querySelectorAll('.weather')
    const wind = document.querySelectorAll('.wind')

    for (let i = 0; i < 7; i++){
        let iDate = dateTranslate(obj.time[i])
        date[i].innerHTML = (i === 0 ? `Today: <br> ${iDate}` : (i === 1 ? `Tomorrow: <br> ${iDate}` : iDate))
        precip[i].innerHTML = `${obj.precipitation_sum[i]} in`
        temp[i].innerHTML = `<span class="tempMax">${obj.temperature_2m_max[i]}\u00B0 F</span><br><span class="tempMin">${obj.temperature_2m_min[i]}\u00B0 F</span>`
        weather[i].innerHTML = `${weatherIcons[obj.weathercode[i]]}<br>${weatherCodes[obj.weathercode[i]]}`
        wind[i].innerHTML = `Wind: ${obj.windspeed_10m_max[i]} MPH`
    }
}

