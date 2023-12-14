// document.addEventListener('DOMContentLoaded', function() {
//     setTimeout(function() {
//         document.querySelector('.preloader-container').style.display = 'none';
//     }, 4000)
// })

const preloader = document.querySelector('.preloader-container');
const backgroundLoader = document.querySelector('.background-loader')
const textLoader = backgroundLoader.querySelector('p');


window.onload = function() {
    setTimeout(function() {
        preloader.style.opacity = 0;
    }, 800)
}


backgroundVideo.addEventListener('loadstart', function() {
    backgroundLoader.style.opacity = 1;
    setTimeout(() => {
        textLoader.style.opacity = 1;
    }, 3000);
})
backgroundVideo.addEventListener('canplaythrough', function() {
    // setTimeout(function() {
    backgroundLoader.style.opacity = 0;
    textLoader.style.opacity = 0;

    // }, 100)
})


// backgroundImage.addEventListener('load', function() {
//     preloader.style.opacity = 1;
// })

backgroundImage.onload = function() {
    setTimeout(function() {
        backgroundLoader.style.opacity = 0;
        textLoader.style.opacity = 0;
    }, 100)
}





const defaultWilayah = "yogyakarta";


class DataSet {
    constructor (
        wilayah, timestamp, timezone, icon, suhu, cuaca, 
        kelembapan, angin, tekanan, sunrisetime, sunsettime
    ) {
        this.wilayah = wilayah;
        this.timestamp = timestamp;
        this.timezone = timezone;
        this.cuaca = cuaca;
        this.suhu = Math.round(suhu);
        this.icon = icon;
        this.kelembapan = kelembapan;
        this.angin = angin;
        this.tekanan = tekanan;
        this.sunriseTime = sunrisetime;
        this.sunsetTime = sunsettime;
    }

    onDisplay() {   
        document.getElementById('icon-cuaca').src = `asset/weather-icon/${this.icon}.svg` ;
        document.getElementById('suhu').innerHTML = this.suhu;
        document.getElementById('cuaca').innerHTML = this.cuaca;
        document.getElementById('humidity').innerHTML = this.kelembapan + "%";
        document.getElementById('wind').innerHTML = `${this.angin} km/h`;
        document.getElementById('pressure').innerHTML = `${this.tekanan} hPa`;
        document.getElementById('wilayah').innerHTML = `${this.wilayah}`;
        document.getElementById('time').innerHTML = this.currentTime;
        document.getElementById('date').innerHTML = this.longDate;
        console.log("wilayah: " + this.wilayah)
        console.log("condition: " + this.cuaca);
        console.log("weahter icon: " + this.icon)
        console.log("sunrise: " + this.sunriseTime);
        console.log("sunset: " + this.sunsetTime);
    }

    dateTimeLocalFormat(option) {
        const UTCtime = new Date(this.timestamp * 1000)
        const localTime = UTCtime.toLocaleString('id-ID', {
            timeZone: this.timezone, ...option
        })

        return localTime;
    }


    get currentTime() {
        return this.dateTimeLocalFormat({hour: '2-digit', minute: '2-digit'});
    }

    get longDate() {
        return this.dateTimeLocalFormat({day: 'numeric', month: 'long', year: 'numeric'});
    }

    get shortDate() {
        return this.dateTimeLocalFormat({day: 'numeric', month: 'short'});
    }
}



const search = document.querySelector('.search');
const searchbar = document.querySelector('.search input');
const myChart = document.getElementById('myChart');
let chart;
let listAllDataHours;
let forecastDesc;

//get weather data object from API 
async function checkWeather(wilayah) {
    
    const API_Url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${wilayah}/next7days?unitGroup=metric&key=TY6AA7XBHB3Z6PHMYUEKRBH6T&iconSet=icons2`;
    const response = await fetch(API_Url);
    const data = await response.json();
    // console.log(data);

    const currentData = new DataSet (
        data.resolvedAddress, 
        data.currentConditions.datetimeEpoch,
        data.timezone, 
        data.currentConditions.icon,
        data.currentConditions.temp, 
        data.currentConditions.conditions,
        data.currentConditions.humidity, 
        data.currentConditions.windspeed, 
        data.currentConditions.pressure,
        data.currentConditions.sunrise,
        data.currentConditions.sunset
        );
    currentData.onDisplay();

    console.log(currentData);
        
    listAllDataHours = [];
    forecastDesc = [];
    let tempList = [];
    let tanggal = [];
        
    for (let i = 0; i < 7; i++) {
        let hourObjectPerDay = [];
        let tempPerDay = [];
        for (let j = 0; j < 24; j++) {
            const dataHour = new DataSet (
                data.resolvedAddress,
                data.days[i].hours[j].datetimeEpoch,
                data.timezone, 
                data.days[i].hours[j].icon,
                data.days[i].hours[j].temp, 
                data.days[i].hours[j].conditions,
                data.days[i].hours[j].humidity, 
                data.days[i].hours[j].windspeed, 
                data.days[i].hours[j].pressure,
                data.days[i].sunrise,
                data.days[i].sunset
            )
            // listHourObjects[i].push(dataHour);
            hourObjectPerDay.push(dataHour);
            tempPerDay.push(dataHour.suhu);
            
        }

        listAllDataHours.push(hourObjectPerDay);
        forecastDesc.push(data.days[i].description);
        tempList.push(tempPerDay);
        tanggal.push(hourObjectPerDay[0].shortDate);

        
        updateDaycard(i, tanggal[i], data.days[i].icon, data.days[i].tempmin, data.days[i].tempmax )
    }
    
    updateTheme(currentData.sunriseTime, currentData.currentTime, currentData.sunsetTime, currentData.icon);  
    
    if (chart) {
        // Jika chart sudah ada, hapus data lama dan tambahkan data baru
        clearData(chart);
        addDataArray(chart, tempList, tanggal);
    } else {
        // Jika chart belum ada, buat chart baru
        generateChart(tempList, tanggal);
    }
    searchbar.value = '';
    
    resetAllDayCards();
    setOneDayCard(0);
    // listAllDataHours[0][0].onDisplay();
}

// getListTime(data2);
checkWeather(defaultWilayah);

search.addEventListener('submit', function(event) {
    event.preventDefault();
    checkWeather(searchbar.value);
})



const dayCards = document.querySelectorAll('.daycard');
function updateDaycard(index, tanggal, namaIcon, suhuMin, suhuMax){
    document.querySelector(`#daycard${index} .tanggal`).innerHTML = tanggal;
    document.querySelector(`#daycard${index} .icon img`).src = `asset/weather-icon/${namaIcon}.svg`;
    document.querySelector(`#daycard${index} .temp-min`).innerHTML = Math.round(suhuMin) + '°';
    document.querySelector(`#daycard${index} .temp-max`).innerHTML = Math.round(suhuMax) + '°';   
    // document.querySelector('.forecast-desc .desc-text').innerHTML = forecastDesc[0];
    // resetAllDaycards();
    // setOneDaycard(0);
}


dayCards.forEach((dayCard, index) => { 
    dayCard.addEventListener('click', function() {
        resetAllDayCards();
        setOneDayCard(index); // Pass the index directly
    });
});



function resetAllDayCards() {
    dayCards.forEach((dayCard, index) => {
        //remove class clicked in daycard and set all hidden status true.
        dayCard.classList.remove('clicked');
        //hidden all chart datasets
        displayChart(index, true);
        removeHover(null, index, { chart: chart });
    })
}

function setOneDayCard(index) {
    //set clicked daycard hidden-status to false (ondisplay)
    displayChart(index, false);
    addHover(null, index, { chart: chart }); // Simulate hover
    dayCards[index].classList.add('clicked'); // Use index to access the correct dayCard
    document.querySelector('.forecast-desc .desc-text').innerHTML = forecastDesc[index];
}
