/* Global Variables */
const server = "http://localhost:3000";
// The URL to retrive weather info from it
const baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
apiKey = 'cb881e35dc2224460437f27b914abd60';
queryParams = '&units=metric&APPID=';

// Create a new date instance dynamically with JS

let d = new Date();
// let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
let newDate = d.toDateString();

//an async function that uses fetch() to make a GET request to the OpenWeatherMap API.
document.getElementById('generate').addEventListener('click', performAction);

function performAction() {
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;
    const endpoint = baseURL + zip + queryParams + apiKey;


    // Get Weather return Promise
    getWeatherData(zip).then((retrunedData) => {
        if (retrunedData) {
            const {
                main: { temp },
                name: city,
                weather: [{ description }],
                sys: { country },
            } = retrunedData;

            const information = {
                newDate,
                city,
                country,
                temp,
                description,
                feelings,
            };

            const posts = postData(server + '/addIncomingData', information);
            // console.log(posts);
            if (zip !== '') {
                updateUI();
                show();
            } else {
                hide();
            }
        }
    });

}
const getWeatherData = async (zipCode) => {

    try {
        const res = await fetch(baseURL + zipCode + queryParams + apiKey);
        const data = await res.json();
        // console.log(data)
        return data;
    } catch (error) {
        console.log("error", error);
    }
};

// Function to POST data 
const postData = async (url = '', information = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(information),
    });

    try {
        if (response.ok) {
            const newData = await response.json();
            // console.log(newData);
            return newData;
        }
    } catch (error) {
        console.log("error", error);
    }
};

const updateUI = async () => {
    const res = await fetch(server + '/all');
    try {
        const savedData = await res.json();
        console.log(savedData);

        const degree = Math.round(savedData.temp);
        const country = savedData.country;
        const city = savedData.city;
        const feel = savedData.feelings;

        document.getElementById('date').innerHTML = savedData.newDate;
        document.getElementById('temp').innerHTML = `${degree}&deg;C`;
        document.getElementById('content').innerHTML = `I Am Feel : ${feel}`;
        document.getElementById('city').innerHTML = `${city} , ${country}`;
        document.getElementById('description').innerHTML = savedData.description;

    } catch (error) {
        console.log("error", error);
    }
};

function show() {
    document.querySelector('.entry').style.display = 'block';
}
function hide() {
    document.querySelector('.entry').style.display = 'none';
}