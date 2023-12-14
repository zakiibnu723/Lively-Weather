
function generateChart(suhu, tanggal) {

    let labels = [
        '00.00', '01.00', '02.00', '03.00', 
        '04.00', '05.00', '06.00', '07.00', 
        '08.00', '09.00', '10.00', '11.00', 
        '12.00', '13.00', '14.00', '15.00', 
        '16.00', '17.00', '18.00', '19.00', 
        '20.00', '21.00', '22.00', '23.00', 
    ]

    // let screen = window.matchMedia("(max-width: 480px)");
    
    // if (screen.matches) {
    //     for (let i = 0; i < 7; i++) {
    //         suhu[i] = suhu[i].filter((element, index, array) => index % 3 === 0)
    //         // tanggal[i] = tanggal[i].filter((element, index, array) => index % 3 === 0)
            
    //     }

    //     labels = labels.filter((element, index, array) => index % 3 === 0)
    // }



    const ctx = myChart.getContext('2d');
    chart = new Chart(ctx, {
        scaleFontColor: '#ffffff',
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${tanggal[0]} | temperature: `,
                data: suhu[0],
                fill: true,
                color: '#ffffff',
                backgroundColor: 'rgba(105, 105, 105, 0.095)',
                borderColor: '#FFEA00',
                lineTension: 0.5,
                borderWidth: 2.5,
                order: 2,

            }, {
                label: `${tanggal[1]} | temperature: `,
                data: suhu[1],
                fill: true,
                color: '#ffffff',
                backgroundColor: 'rgba(138, 138, 138, 0.035)',
                borderColor: 'rgba(105, 105, 105, 0.095)',
                lineTension: 0.5,
                borderWidth: 2.5,
                hidden: true,
                order: 0

            },{
                label: `${tanggal[2]} | temperature: `,
                data: suhu[2],
                fill: true,
                color: '#ffffff',
                backgroundColor: 'rgba(138, 138, 138, 0.035)',
                borderColor: 'rgba(105, 105, 105, 0.095)',
                lineTension: 0.5,
                borderWidth: 2.5,
                hidden: true,
                order: 0

            },{
                label: `${tanggal[3]} | temperature: `,
                data: suhu[3],
                fill: true,
                color: '#ffffff',
                backgroundColor: 'rgba(138, 138, 138, 0.035)',
                borderColor: 'rgba(105, 105, 105, 0.095)',
                lineTension: 0.5,
                borderWidth: 2.5,
                hidden: true,
                order: 0

            },{
                label: `${tanggal[4]} | temperature: `,
                data: suhu[4],
                fill: true,
                color: '#ffffff',
                backgroundColor: 'rgba(138, 138, 138, 0.035)',
                borderColor: 'rgba(105, 105, 105, 0.095)',
                lineTension: 0.5,
                borderWidth: 2.5,
                hidden: true,
                order: 0

            },{
                label: `${tanggal[5]} | temperature: `,
                data: suhu[5],
                fill: true,
                color: '#ffffff',
                backgroundColor: 'rgba(138, 138, 138, 0.035)',
                borderColor: 'rgba(105, 105, 105, 0.095)',
                lineTension: 0.5,
                borderWidth: 2.5,
                hidden: true,
                order: 0

            },{
                label: `${tanggal[6]} | temperature: `,
                data: suhu[6],
                fill: true,
                color: '#ffffff',
                backgroundColor: 'rgba(138, 138, 138, 0.035)',
                borderColor: 'rgba(105, 105, 105, 0.095)',
                lineTension: 0.5,
                borderWidth: 2.5,
                hidden: true,
                order: 0
            }]
        },
        options: {
            plugins: {
                title: {
                    display: false,
                    text: 'Hourly Forecast in 5 days'
                },

                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + ' °C';
                            }
                            return label;
                        },

                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: false,
                        text: 'Hour'
                    },
                    ticks: {
                        display: true,
                        color: '#ffffff',
                        maxTicksLimit: 8,
                        beginAtZero: false,
                        font: {
                            size: 9
                        }
                        // stepSize: 1
                    },
                    grid : {
                        color : '#70707053',
                        lineWidth: 0.5
                    }
                },
                y: {
                    title: {
                        display: false,
                        text: 'Temperature'
                    },

                    ticks: {
                        display: true,
                        color: '#ffffff',
                        maxTicksLimit: 8,
                        stepSize: 4,
                        beginAtZero: true,
                        font: {
                            size: 9
                        }
                    },
                    grid : {
                        color : '#70707053',
                        lineWidth: 0.5

                    }
                },
                
            },
            elements: {
                point:{
                    radius: 0,
                    hoverRadius: 7,
                    hitRadius: 10
                }
            },
            tooltip: {
                mode: 'point',
                intersect: true,
                // backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            
            onTouchStart: function(event, elements) {
                if (elements && elements.length > 0) {
                    const firstElement = elements[0];

                    DisplayDataHour(firstElement.datasetIndex, firstElement.index);
                }
            },

            onClick: function(event, elements) {
                if (elements && elements.length > 0) {
                    const firstElement = elements[0];

                    DisplayDataHour(firstElement.datasetIndex, firstElement.index);
                }
            },

            
            aspectRatio : false,
            responsive: true,
            maintainAspectRatio: false,
            width: 3200,
            height: 250,
            // chartArea: { backgroundColor: 'rgba(251, 85, 85, 0.4)'}
        },
        
    });
    
    // chart.style.backgroundColor = '#6060600f';
    
    
    // chart.data.datasets[2].hidden = false;
}

function DisplayDataHour(indexhari, indexjam) {
    const target = listAllDataHours[indexhari][indexjam];
    console.log(target)
    target.onDisplay();
    updateTheme(target.sunriseTime, target.currentTime, target.sunsetTime, target.icon)
}

function clearData(chart) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });
    chart.update();
}

function addDataArray(chart, newData) {
    chart.data.datasets.forEach((dataset, index) => {
        dataset.data.push(...newData[index]);
    });
    chart.update();
}

function displayChart(index, hiddenStatus) {
    chart.data.datasets[index].hidden = hiddenStatus
    console.log(hiddenStatus)
    chart.update()
        chart.render({
            duration: 0,  // Atur durasi animasi dalam milidetik
            easing: 'easeInOutQuad',  // Atur jenis animasi (opsional)
        })

}   



function addHover(evt, index, legend) {
    const dataset = legend.chart.data.datasets[index];

    // Tambahkan efek hover untuk dataset tertentu
    dataset.borderColor = '#FFEA00';
    dataset.backgroundColor = 'rgba(96, 96, 96, 0.456)';
    dataset.order = 99;

    legend.chart.update();
}
  
function removeHover(evt, index, legend) {
    const dataset = legend.chart.data.datasets[index];
  
    // Kembalikan warna ke nilai default
    dataset.borderColor = 'rgba(105, 105, 105, 0.250)';
    dataset.backgroundColor = 'rgba(138, 138, 138, 0.060)';
    dataset.order = 0;

    legend.chart.update();
}