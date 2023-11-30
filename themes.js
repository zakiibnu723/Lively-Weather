class ThemesFolder {
    constructor(namaFolder, jumlahFile) {
        this.namaFolder = namaFolder;
        this.isiFolder = [];
        this.jumlahFile = jumlahFile;
    }
    
    generateFile() {
        for (let i = 1; i <= this.jumlahFile; i++) {
            this.isiFolder.push(`${i}`);
        }
    }

    set changeFolderName(namaFolder) {
        this.namaFolder = namaFolder;
    }

    set changeJumlahFile(jumlahlFile) {
        this.jumlahFile = jumlahlFile;
    }

    get randomFile() {
        let randomFile = this.isiFolder[Math.floor(Math.random() * this.isiFolder.length)];
        return `${this.namaFolder}/${randomFile}`;
    }
}


class DayThemes {
    constructor(){
        this.jmlFile = {
            cerah : 2,
            berawan : 4,
            sebagianberawan : 9,
            hujan : 4,
            badaipetir : 2,
            salju : 3,
            kabut: 5,
            berangin : 2,
            random : 4, 
        };
        
        this.defaultThemesFolder = new ThemesFolder('random', this.jmlFile.random)
    }

    findProperTheme(cuaca) {
        switch (true) {
            case cuaca.includes('thunder'):
                this.defaultThemesFolder.changeFolderName = 'badai-petir';
                this.defaultThemesFolder.changeJumlahFile = this.jmlFile.badaipetir;
                break;

            case cuaca.includes('snow'): 
                this.defaultThemesFolder.changeFolderName = 'salju';
                this.defaultThemesFolder.changeJumlahFile = this.jmlFile.salju;
                break;

            case cuaca.includes('rain') || cuaca.includes('showers'):
                this.defaultThemesFolder.changeFolderName = 'hujan';
                this.defaultThemesFolder.changeJumlahFile = this.jmlFile.hujan;
                break;
            
            case cuaca.includes('clear'):
                this.defaultThemesFolder.changeFolderName = 'cerah';
                this.defaultThemesFolder.changeJumlahFile = this.jmlFile.cerah;
                break;
            
            case cuaca.includes('cloudy') && cuaca.includes('partly'):
                this.defaultThemesFolder.changeFolderName = 'sebagian-berawan';
                this.defaultThemesFolder.changeJumlahFile = this.jmlFile.sebagianberawan;
                break;
                
            case cuaca.includes('cloudy'):
                this.defaultThemesFolder.changeFolderName = 'berawan';
                this.defaultThemesFolder.jmlFile = this.jmlFile.berawan;
                break;
                
            case cuaca.includes('fog'):
                this.defaultThemesFolder.changeFolderName = 'kabut';
                this.defaultThemesFolder.changeJumlahFile = this.jmlFile.kabut;
                
            case cuaca.includes('wind'):
                this.defaultThemesFolder.changeFolderName = 'berangin';
                this.defaultThemesFolder.changeJumlahFile = this.jmlFile.berangin;
                break;

            default:
                break;
        }

        this.defaultThemesFolder.generateFile()
        return this.defaultThemesFolder.randomFile;
    }


    getURL(cuaca) {
        return `day-themes/${this.findProperTheme(cuaca)}`;
    }
}


class NightThemes extends DayThemes{
    constructor() {
        super()
        this.jmlFile = {
            cerah : 7,
            berawan : 1,
            sebagianberawan : 6,
            hujan : 3,
            badaipetir : 2,
            salju : 3,
            kabut: 1,
            berangin : 1,
            random : 6, 
        };
    }

    getURL(cuaca) {
        return `night-themes/${this.findProperTheme(cuaca)}`;
    }
}


let backgroundVideo = document.getElementById('background-video');
let sourceVideo = document.getElementById('source-video');
const backgroundImage = document.getElementById('background-image');

function updateTheme(sunriseTime, currentTime, sunsetTime, cuaca) {
    if (currentTime >= sunriseTime && currentTime < sunsetTime) {
        let theme = new DayThemes()
        let url = theme.getURL(cuaca);

        sourceVideo.src = `${url}.webm`;
        backgroundImage.src = `${url}.webp`;
        backgroundVideo.load();

        console.log(theme.getURL(cuaca))
        
    } else {
        let theme = new NightThemes()
        let url = theme.getURL(cuaca);

        sourceVideo.src = `${url}.webm`;
        backgroundImage.src = `${url}.webp`;
        backgroundVideo.load();

        console.log(theme.getURL(cuaca))
    }
}


// updateTheme('06:00', '12:00', '18:00', 'snow');
