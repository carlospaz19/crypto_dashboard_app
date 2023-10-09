import { createLinealChart, createPieChart } from './chartModule.js';

document.addEventListener("DOMContentLoaded", function () {
    const globalCryptoList = document.getElementById('crypto-global');

    function createMainTable(crypto){
        // Data for main table
        const cryptoItemOne = document.createElement("li");
        cryptoItemOne.innerHTML = `Active Cryptocurrencies: <strong>${crypto.active_cryptocurrencies}`
        const cryptoItemTwo = document.createElement("li");
        cryptoItemTwo.innerHTML = `Total market: <strong>${crypto.markets}</strong> cryptocurrencies`
        globalCryptoList.appendChild(cryptoItemOne);
        globalCryptoList.appendChild(cryptoItemTwo);

        // Data for market cap percentage
        const jsonPercentage = crypto.market_cap_percentage;

        let cryptoNames = [];
        let cryptoValues = [];

        let divTable = document.getElementById("percentage-dataTable");
        let table = document.createElement("table");

        let rowHeader = table.insertRow();

        let cellHeader1 = rowHeader.insertCell();
        cellHeader1.innerHTML = "Coin";

        let cellHeader2 = rowHeader.insertCell();
        cellHeader2.innerHTML = "Market Cap";

        // Creating table for global market cap
        for (const crypto in jsonPercentage) {
            if (jsonPercentage.hasOwnProperty(crypto)) {
                const cPercentage = jsonPercentage[crypto];
                const cryptoName = crypto.toUpperCase();
                const cryptoPercentage = Math.round(cPercentage);
                cryptoNames.push(cryptoName);
                cryptoValues.push(cryptoPercentage);
                
                let rowData = table.insertRow();
                
                let cellDataName = rowData.insertCell();
                cellDataName.innerHTML = cryptoName;
                
                let cellDataPercentage = rowData.insertCell();
                cellDataPercentage.innerHTML = `${cryptoPercentage}%`;

                rowData.classList.add((cryptoNames.length % 2 === 0) ? 'data-row-even' : 'data-row-odd');
            }
        }
    
        // Adding table
        divTable.appendChild(table);

        // Creating Pie Chart with global market cap info
        createPieChart(cryptoNames, cryptoValues);
    }

    function createTrending(data) {
        let topSection = document.getElementById('topSeven-section');
        const coins = data.coins;
        let i = 0;
    
        coins.forEach(coin => {

            let coinSection = document.createElement("div");
            coinSection.classList.add("section");
    
            let coinName = document.createElement("h2");
            coinName.classList.add("toggle");
            coinName.innerHTML = `${coin.item.name}`;

            let coinBox = document.createElement("div");
            coinBox.classList.add("boxCoin");

            let coinImage = document.createElement("img");
            coinImage.classList.add("imageCoin");
            coinImage.src = coin.item.large;
    
            let coinContent = document.createElement("div");
            coinContent.classList.add("contentCoin");

            let graphicContent = document.createElement("div");
            graphicContent.classList.add("contentGraphic");

            const coinId = coin.item.id;
            let usdPrice;
            let text;

            // Creating one data set info for each treding coin
            getCoinPrice(coinId).then(data => {
                usdPrice = data[coinId]?.usd;
                text = `Id: ${coin.item.id}<br />Symbol: ${coin.item.symbol}<br />Rank: ${coin.item.market_cap_rank}<br />Price: ${usdPrice} USD`;
                let coinText = document.createElement("p");
                coinText.innerHTML = text;

                coinContent.appendChild(coinText);

                // Get data chart from 15 days ago
                getChart(coin.item.id, 15).then(data => {

                    const pricesData = data.prices;
                    const dates = pricesData.map((priceData) => {
                        const date = new Date(priceData[0]);
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Agregar 1 ya que los meses se cuentan desde 0
                        const day = date.getDate().toString().padStart(2, '0');
                      
                        return `${year}-${month}-${day}`;
                    });
                    const prices = pricesData.map((priceData) => priceData[1]);

                    let linearCanvas = createLinealChart(dates, prices);

                    // Adding new linear canvas
                    graphicContent.appendChild(linearCanvas);
     
                });
            });

            // Adding trend section
            coinSection.appendChild(coinName);
            coinBox.appendChild(coinImage);
            coinBox.appendChild(coinContent);
            coinBox.appendChild(graphicContent);
            coinSection.appendChild(coinBox);
            topSection.appendChild(coinSection);

            // Agregar un evento clic al título de la sección
            coinName.addEventListener('click', () => {
                // Alternar la visibilidad del contenido cuando se hace clic en el título
                if (coinContent.style.display === 'none' || coinContent.style.display === '') {
                    coinContent.style.display = 'block';
                    coinImage.style.display = 'block';
                    graphicContent.style.display = 'block';
                } else {
                    coinContent.style.display = 'none';
                    coinImage.style.display = 'none';
                    graphicContent.style.display = 'none';
                }
            });
        });
    }    

    const getCrypto = async () => {
        const url = "https://api.coingecko.com/api/v3/global";
        const response = await fetch(url);
        const data = await response.json();
        return data;
      };
      
    getCrypto()
        .then(data => createMainTable(data.data))
        .catch(error => console.error(error));

    const getTrending = async () => {
        const url = "https://api.coingecko.com/api/v3/search/trending";
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    getTrending()
        .then(data => createTrending(data))
        .catch(error => console.error(error));

    const getCoinPrice = async (coinId) => {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=USD`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    const getChart = async (coin, days) => {
        const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=USD&days=${days}&interval=daily`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };
});