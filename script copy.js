const defaultWilayah = "sukabumi";



class ThemesFolder {
    constructor(namaFolder, banyakFile) {
        this.namaFolder = namaFolder;
        this.isiFolder = [];
        this.autoCreate(banyakFile);
        this.style = [
            {}
        ]
    }
    
    autoCreate(banyakFile) {
        for (let i = 1; i <= banyakFile; i++) {
            this.isiFolder.push(`${i}`);
        }
    }
}

ThemesFolder.prototype.randomFile = function() {
    let randomFile = this.isiFolder[Math.floor(Math.random() * this.isiFolder.length)];
    
    return `${this.namaFolder}/${randomFile}`;
    
}


class DayThemes {
    constructor(){
        this.jmlFile = {
            cerah : 2,
            berawan : 3,
            sebagianBerawan : 9,
            hujan : 4,
            badaipetir : 3,
            salju : 1,
            kabut: 3,
            berangin : 2,
            random : 5, 
        };
    }

    findProperTheme(cuaca) {
        if (cuaca.includes('thunder')) {
            let badaipetir = new ThemesFolder('badaipetir', this.jmlFile.badaipetir);
            return badaipetir.randomFile();

        } else if (cuaca.includes('snow')) {
            let salju = new ThemesFolder('salju', this.jmlFile.salju);  
            return salju.randomFile();

        } else if (cuaca.includes('rain', 'showers')) {
            let hujan = new ThemesFolder('hujan', this.jmlFile.hujan);
            return hujan.randomFile();

        } else if (cuaca.includes('clear')) {
            let cerah = new ThemesFolder('cerah', this.jmlFile.cerah);
            return cerah.randomFile();

        } else if (cuaca.includes('cloudy' && 'partly')) {
            let sebagianBerawan = new ThemesFolder('sebagianBerawan', this.jmlFile.berawan);
            return sebagianBerawan.randomFile(); 

        } else if (cuaca.includes('cloudy')) {
            let berawan = new ThemesFolder('berawan', this.jmlFile.berawan);
            return berawan.randomFile(); 

        } else if (cuaca.includes('fog')) {
            let kabut = new ThemesFolder('kabut', this.jmlFile.kabut);
            return kabut.randomFile();

        } else if (cuaca.includes('wind')) {
            let berangin = new ThemesFolder('berangin', this.jmlFile.berangin);
            return berangin.randomFile();

        } else {
            let Random = new ThemesFolder('Random', this.jmlFile.random);
            return Random.randomFile();
        }
    }

    getURL(cuaca) {
        return `background/siang/${this.findProperTheme(cuaca)}`;
    }
}


class NightThemes extends DayThemes{
    constructor() {
        super()
        this.jmlFile = {
            cerah : 9,
            berawan : 1,
            sebagianBerawan : 6,
            hujan : 3,
            badaipetir : 2,
            salju : 3,
            kabut: 1,
            berangin : 1,
            random : 7, 
        };
    }

    getURL(cuaca) {
        return `background/malam/${this.findProperTheme(cuaca)}`;
    }
}


let backgroundVideo = document.getElementById('background-video');
let sourceVideo = document.getElementById('source-video');
const backgroundImage = document.getElementById('background-image');

function updateTheme(currentTime, sunriseTime, sunsetTime, cuaca) {
    if (currentTime >= sunriseTime && currentTime < sunsetTime) {
        let theme = new DayThemes()

        let url = theme.getURL(cuaca);
        sourceVideo.src = `${url}.webm`;
        backgroundImage.src = `${url}.webp`;
        backgroundVideo.load();
        
    } else {
        let theme = new NightThemes()
        
        let url = theme.getURL(cuaca);
        sourceVideo.src = `${url}.webm`;
        backgroundImage.src = `${url}.webp`;
        backgroundVideo.load();
    }
}








class DataSet {
    constructor (wilayah, timestamp, timezone, icon, suhu, cuaca, 
        kelembapan, angin, tekanan, sunrisetime, sunsettime) {
        this.wilayah = wilayah;
        this.cuaca = cuaca;
        this.suhu = Math.round(suhu);
        this.icon = icon;
        this.kelembapan = kelembapan;
        this.angin = angin;
        this.tekanan = tekanan;
        this.sunriseTime = sunrisetime;
        this.sunsetTime = sunsettime;
        this.currentTime = '';
        this.longDate = '';
        this.shortDate = '';
        this.convertTime(timestamp, timezone);
    }

    onDisplay = function() {   
        document.getElementById('icon-cuaca').src = `asset/weather-icon/${this.icon}.svg` ;
        document.getElementById('suhu').innerHTML = this.suhu;
        document.getElementById('cuaca').innerHTML = this.cuaca;
        // document.getElementById('icon-cuaca').src = `asset/weather-icon/${this.cuaca}.png`;
        document.getElementById('humidity').innerHTML = this.kelembapan + "%";
        document.getElementById('wind').innerHTML = `${this.angin} km/h`;
        document.getElementById('pressure').innerHTML = `${this.tekanan} hPa`;
        document.getElementById('wilayah').innerHTML = `${this.wilayah}`;
        document.getElementById('time').innerHTML = this.currentTime;
        document.getElementById('date').innerHTML = this.longDate;
        console.log(this.cuaca);
    }

    convertTime = function(timestamp, timezone) {
        const UTCtime = new Date(timestamp * 1000)
        const localTime = UTCtime.toLocaleString('id-ID', {
            timeZone: `${timezone}`, hour: '2-digit', minute: '2-digit'
        })
        const longFormatDate = UTCtime.toLocaleString('en-US', {
            timeZone: `${timezone}`, day: 'numeric', month: 'long', year: 'numeric'
        })
        const shortFormatDate = UTCtime.toLocaleString('id-ID', {
            timeZone: `${timezone}`, day: 'numeric', month: 'short'
        })
        
        
        this.currentTime = localTime;
        this.longDate = longFormatDate;           
        this.shortDate = shortFormatDate;
    }
}


// class HourDataSet extends DataSet {
//     constructor (wilayah, timestamp, timezone, suhu, cuaca, kelembapan, angin, tekanan) {
//         super(wilayah, timestamp, timezone, suhu, cuaca, kelembapan, angin, tekanan)

//         this.addTimeTempList()
//     }

//     static timeList = [];
//     static tempList = [];

//     addTimeTempList = function() {
//         HourDataSet.timeList.push(this.waktu);
//         HourDataSet.tempList.push(this.suhu);
//     }
// }



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

    const currentData = new DataSet(
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
                data.days[i].hours[j].pressure
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
    
    updateTheme(currentData.currentTime, currentData.sunriseTime, currentData.sunsetTime, currentData.icon);  

    if (chart) {
        // Jika chart sudah ada, hapus data lama dan tambahkan data baru
        clearData(chart);
        addDataArray(chart, tempList, tanggal);
    } else {
        // Jika chart belum ada, buat chart baru
        generateChart(tempList, tanggal);
    }
    
    searchbar.value = '';

    // listAllDataHours[0][0].onDisplay();
}

// getListTime(data2);
checkWeather(defaultWilayah);

search.addEventListener('submit', function(event) {
    event.preventDefault();
    checkWeather(searchbar.value);
        // chart.data.datasets[2].hidden = true;
    // chart.data.datasets[1].hidden = false;
})



function updateDaycard(index, tanggal, namaIcon, suhuMin, suhuMax){
    document.querySelector(`#daycard${index} .tanggal`).innerHTML = tanggal;
    document.querySelector(`#daycard${index} .icon img`).src = `asset/weather-icon/${namaIcon}.svg`;
    document.querySelector(`#daycard${index} .temp-min`).innerHTML = Math.round(suhuMin) + '°';
    document.querySelector(`#daycard${index} .temp-max`).innerHTML = Math.round(suhuMax) + '°';   
}




const dayCards = document.querySelectorAll('.daycard');

let hiddenStatus = Array(dayCards.length).fill(true);
hiddenStatus[0] = false;

dayCards.forEach((dayCard, index) => { 
    dayCard.addEventListener('click', function() {
        hiddenStatus[index] = !hiddenStatus[index];
        displayChart(index, hiddenStatus[index])
        if (!hiddenStatus[index]) {
            dayCard.classList.add('clicked');
        } else {
            dayCard.classList.remove('clicked');
        }
    })
    
    dayCard.addEventListener('mouseenter', function () {
        dayCards.forEach((dayCard, index) => {
            removeHover(null, index, { chart: chart });
            dayCard.classList.remove('hover')
        })
        addHover(null, index, { chart: chart }); // Simulate hover
        dayCard.classList.add('hover')
        document.querySelector('.forecast-desc .desc-text').innerHTML = forecastDesc[index];
    });
    
    // dayCard.addEventListener('mouseleave', function () {
    //     removeHover(null, index, { chart: chart }); // Simulate leave
    // });
});






// dayCard.addEventListener('click', function() {
//     displayChart(0);
// })

for (let i = 0; i < 168; i++) {
    const selecthour = document.getElementById(`selecthour${i}`);
    selecthour.addEventListener('click', function() {
        listHourObjects[i].onDisplay();
    })
}

//default city 





// function getListTime(weatherData) {
//     for (let i = 0; i < weatherData.length; i++) {
//         let timestamp = weatherData[i].dt;
        
//         let dateTime = new Date(timestamp * 1000);
//         Hours
//     }
// }
// let cuaca = 'Cerah';
// let waktu = 7;

// let malam = new NightThemes();
// let siang = new DayThemes();

// console.log(malam.getURL(cuaca));
// console.log(siang.getURL(cuaca));









































// class timeData extends mainData {
//     constructor(timestamp, timezone) {
//         super(timestamp, timezone) 
//     }

//     getInfo = function() {
//         let utcTime = new Date(this.timestamp * 1000);
//         let timeZoneHour = Math.round(this.timezone / 3600);
    
//         let Hour = utcTime.getUTCHours() + timeZoneHour;
//         let Minute = utcTime.getUTCMinutes();
//         let date = utcTime.getUTCDate();
//         let month = utcTime.getUTCMonth();
//         let year = utcTime.getUTCFullYear();
  
//         return {
//             clock : `${Hour}:${Minute}`,
//             date : `${date} ${Month[month]}, ${year}`
//         }
//     }
    
//     updateData = function() {
//         document.getElementById('time').innerHTML = this.getInfo().clock;
//         document.getElementById('date').innerHTML = this.getInfo().date;
//     } 
// }






























































// const Alldata = {
//     wilayah : '',
//     negara : '',
//     waktu : '',
//     tanggal : '',
//     suhu : '',
//     cuaca: '',
//     kelembapan : '',
//     angin : '',
//     tekanan: '',
    
//     updateData : function() {
//         document.getElementById('suhu').innerHTML = this.suhu;
//         document.getElementById('cuaca').innerHTML = this.cuaca;
//         document.getElementById('humidity').innerHTML = this.kelembapan + "%";
//         document.getElementById('wind').innerHTML = this.angin + "km/h";
//         document.getElementById('pressure').innerHTML = this.tekanan;
//         document.getElementById('wilayah').innerHTML = `${this.wilayah}, ${this.negara}`;
//     },

//     changeTheme : function(theme) {
//         let backgroundVideo = document.getElementById('background-video');
//         let sourceVideo = document.getElementById('source-video');
        
//         sourceVideo.src = theme.randomFile();
//         backgroundVideo.load();

//     },
    
//     changeTheme : function() {
    
//     }
// }


// data.wilayah = data.name;
// data.negara = data.sys.country;
// data.waktu =
// data.tanggal = 
// data.suhu = data.main.temp;
// data.cuaca = data.weather[0].main;
// data.kelembapan = data.main.humidty
// data.angin = data.wind.speed,
// data.tekanan = data.main.pressure
// data.updateData();