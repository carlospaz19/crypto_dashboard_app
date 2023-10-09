export function createLinealChart(dates, prices){
    const chartData = {
        labels: dates,
        datasets: [
          {
            data: prices,
            label: "USD Price",
            fill: false,
          },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: {
            ticks: {
              color: 'white',
            },
            grid: {
              color: 'white',
              display: true,
            },
          },
          y: {
            ticks: {
              color: 'white',
            },
            grid: {
              color: 'white',
              display: true,
            },
          },
        },
      };

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const chart = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: chartOptions,
    });

    return canvas;
}
  
export function createPieChart(labels, values) {
    const ctx = document.getElementById('cryptoPercentageChart').getContext('2d');

    Chart.defaults.color = 'white';

    const backgroundColor = generateRandomColors(labels.length);

    const chartData = {
        labels: labels,
        datasets: [{
            label: "Cryptos Market Cap Percentages",
            data: values,
            backgroundColor: backgroundColor,
        }]
    };

    const chartOptions = {
        plugins: {
            title: {
                display: true,
                text: 'Crypto Market Cap Percentages',
                font: {
                    size: 25,
                    weight: 'bold',
                }
            },
            legend: {
                labels: {
                    font: {
                        size: 16,
                        weight: 'bold',
                    }
                }
            },
        },
    }

    if(window.myChart){
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "pie",
        data: chartData,
        options: chartOptions,
    });
  }
  
function generateRandomColors(length) {
    const colors = [];
    for (let i = 0; i < length; i++) {
        const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
        colors.push(randomColor);
    }
    return colors;
}