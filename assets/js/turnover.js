//This chart is powered by Chart.js https://www.chartjs.org/
const labels = ['Januar', 'Februar','Mars', 'April', 'Mai', 'Juni'];
const data = {
    labels: labels,
    datasets: [{
        label: 'Omsetningstall',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        data: [200000, 350000, 15000, 150000, 230100, 0],
        borderWidth: 2
    }]
};


const config = {
    type: 'bar',
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
};

var chartElem = new Chart(
    document.getElementById('chart'),
    config
);