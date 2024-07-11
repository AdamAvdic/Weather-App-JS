//this api key will be disabled until given permission

// Select the form and input elements from the DOM
const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

// Add an event listener to the form to handle the submit event
weatherForm.addEventListener("submit", async event => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the city name entered by the user
    const city = cityInput.value;

    // If a city name is entered, fetch the weather data
    if(city){
        try{
            const weatherData = await getWeatherData(city); // Fetch weather data
            displayWeatherInfo(weatherData); // Display the fetched weather data
        }
        catch(error){
            console.error(error);
            displayError(error); // Display an error message if fetching fails
        }
    }
    else{
        displayError("Please enter a city"); // Display an error if no city is entered
    }
});

// Function to fetch weather data from OpenWeatherMap API
async function getWeatherData(city){
    // Construct the API URL with the city name and API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    // Fetch data from the API
    const response = await fetch(apiUrl);

    // If the response is not okay, throw an error
    if(!response.ok){
        throw new Error("Could not fetch weather data");
    }

    // Parse and return the JSON data from the response
    return await response.json();
}

// Function to display weather information on the webpage
function displayWeatherInfo(data){
    // Destructure the data object to extract relevant weather information
    const {name: city, 
           main: {temp, humidity}, 
           weather: [{description, id}]} = data;

    // Clear any previous content in the card and set display style
    card.textContent = "";
    card.style.display = "flex";

    // Create elements to display weather information
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    // Set the text content for each element
    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(2)}°C`; // Convert temperature from Kelvin to Celsius
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id); // Get weather emoji based on weather ID

    // Add CSS classes for styling
    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    // Append the elements to the card
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

// Function to return a weather emoji based on the weather ID
function getWeatherEmoji(weatherId){
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "🌩️"; // Thunderstorm
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️"; // Drizzle
        case (weatherId >= 500 && weatherId < 600):
            return "🌦️"; // Rain
        case (weatherId >= 600 && weatherId < 700):
            return "☃️"; // Snow
        case (weatherId >= 700 && weatherId < 800):
            return "☁️"; // Atmosphere (e.g., mist, smoke)
        case (weatherId === 800):
            return "🌞"; // Clear sky
        case (weatherId >= 801 && weatherId < 810):
            return "☁️"; // Clouds
        default:
            return "😊"; // Default emoji
    }
}

// Function to display an error message on the webpage
function displayError(message){
    // Create an element to display the error message
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message; // Set the error message text
    errorDisplay.classList.add("errorDisplay"); // Add CSS class for styling

    // Clear any previous content in the card, set display style, and append the error message
    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}