// DOM Elements
const time = document.getElementById("time"),
  date = document.getElementById("date"),
  greeting = document.getElementById("greeting"),
  name = document.getElementById("name"),
  focus = document.getElementById("focus"),
  blockquote = document.querySelector(".blockquote"),
  btn = document.querySelector(".image_bg_btn"),
  figcaption = document.querySelector("figcaption"),
  btnQuote = document.querySelector(".quote_btn"),
  weatherIcon = document.querySelector(".weather-icon"),
  temperature = document.querySelector(".temperature"),
  city = document.querySelector(".city"),
  humidity = document.querySelector(".humidity"),
  wind = document.querySelector(".wind"),
  weatherDescription = document.querySelector(".weather-description");

const nightImgPath = "assets/images/night/";
const dayImgPath = "assets/images/day/";
const eveningImgPath = "assets/images/evening/";
const morningImgPath = "assets/images/morning/";
const images = [
  "01.jpg",
  "02.jpg",
  "03.jpg",
  "05.jpg",
  "06.jpg",
  "07.jpg",
  "08.jpg",
  "09.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
  "13.jpg",
  "14.jpg",
  "15.jpg",
  "16.jpg",
  "17.jpg",
  "18.jpg",
  "19.jpg",
  "20.jpg",
];

let i = 0;
let imagesIndex = [];
let imagesPath = [];

function generateImageArr() {
  const size = 6;
  imagesPath.length = 0;
  imagesIndex = JSON.parse(localStorage.getItem("imagesIndex") || "[]");
  if (imagesIndex === null || imagesIndex.length === 0) {
    imagesIndex = [...Array(24).fill(0)];
  }
  let testArr = new Array(Math.ceil(imagesIndex.length / size))
    .fill("")
    .map(function () {
      return this.splice(0, size);
    }, imagesIndex.slice())
    .map(getNewRandomItems);
  testArr.forEach(addFilePathToArray);
  imagesIndex = testArr.flat();
  localStorage.setItem("imagesIndex", JSON.stringify(imagesIndex));
}

function addFilePathToArray(indexArr, index) {
  let path =
    index == 0
      ? nightImgPath
      : index === 1
      ? morningImgPath
      : index === 2
      ? dayImgPath
      : index === 3
      ? eveningImgPath
      : null;
  indexArr.forEach((item) => {
    imagesPath.push(path + images[item]);
  });
}

function getNewRandomItems(oldArr) {
  let availableIndexes = [...Array(images.length).keys()].filter(
    (i) => oldArr.indexOf(i) === -1
  );
  return oldArr.map(() => {
    let newIndex = Math.floor(Math.random() * availableIndexes.length);
    let newValue = availableIndexes[newIndex];
    availableIndexes.splice(newIndex, 1);
    return newValue;
  });
}

function viewBgImage(data) {
  const body = document.querySelector("body");
  const src = data;
  const img = document.createElement("img");
  img.src = src;
  img.onload = () => {
    body.style.backgroundImage = `url(${src})`;
  };
}

function getImage() {
  i++;
  const index = i % imagesPath.length;
  const imageSrc = imagesPath[index];
  viewBgImage(imageSrc);
  btn.disabled = true;
  setTimeout(function () {
    btn.disabled = false;
  }, 1000);
}

// Show Time
function showDateTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds(),
    day = today.getDate(),
    month = today.toLocaleString("default", { month: "long" }),
    weekDay = today.toLocaleString("default", { weekday: "long" });

  //Output Time
  time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(
    sec
  )}`;

  date.innerHTML = `${weekDay}, ${month} ${day}`;

  if (min === 0) {
    setBgGreet();
  }

  setTimeout(showDateTime, 1000);
}

// Add Zeros
function addZero(n) {
  return (parseInt(n, 10) < 10 ? "0" : "") + n;
}

// Set background and Greeting
function setBgGreet() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes();

  switch (true) {
    case hour < 6:
      greeting.textContent = "Good Night, ";
      document.body.style.color = "white";
      break;
    case hour < 12:
      greeting.textContent = "Good Morning, ";
      break;
    case hour < 18:
      greeting.textContent = "Good Afternoon, ";
      break;
    case hour < 24:
      greeting.textContent = "Good Evening, ";
      document.body.style.color = "white";
      break;
    default:
      console.log("time is crazy");
  }
  if (i % imagesPath.length !== hour) {
    viewBgImage(imagesPath[hour]);
    i = hour;
  }
}

//Set Name
function setName(e) {
  if (e.type === "keypress") {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("name", e.target.innerText);
      name.blur();
    }
  } else if (e.type === "click") {
    name.textContent = "";
  } else {
    if (name.textContent.trim() !== "") {
      localStorage.setItem("name", e.target.innerText);
    }
    getName();
  }
}

// Get Name
function getName() {
  if (localStorage.getItem("name") === null) {
    name.textContent = "[Enter Name]";
  } else {
    name.textContent = localStorage.getItem("name");
  }
}

// Get Focus
function getFocus() {
  if (localStorage.getItem("focus") === null) {
    focus.textContent = "[Enter Focus]";
  } else {
    focus.textContent = localStorage.getItem("focus");
  }
}

//Set Name
function setFocus(e) {
  if (e.type === "keypress") {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      localStorage.setItem("focus", e.target.innerText);
      focus.blur();
    }
  } else if (e.type === "click") {
    focus.textContent = "";
  } else {
    if (focus.textContent.trim() !== "") {
      localStorage.setItem("focus", e.target.innerText);
    }
    getFocus();
  }
}

async function getQuote() {
  const url = `https://favqs.com/api/qotd`;
  const res = await fetch(url);
  const data = await res.json();
  blockquote.textContent = data.quote.body;
  figcaption.textContent = data.quote.author;
}

function setCity(event) {
  if (event.type === "keypress") {
    // Make sure enter is pressed
    if (event.which == 13 || event.keyCode == 13) {
      localStorage.setItem("city", event.target.innerText);
      getWeather();
      city.blur();
    }
  } else if (event.type === "click") {
    city.textContent = "";
  } else {
    if (city.textContent.trim() !== "") {
      localStorage.setItem("city", event.target.innerText);
      getWeather();
    }
    getCity();
  }
}

function getCity() {
  if (localStorage.getItem("city") === null) {
    city.textContent = "Minsk";
  } else {
    city.textContent = localStorage.getItem("city");
  }
}

async function getWeather() {
  getCity();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=9c33d089eac88e5ac645c7568c1e9b38&units=metric`;
  const res = await fetch(url);
  let data;

  if (res.ok) {
    data = await res.json();
  } else {
    weatherIcon.className = "";
    city.textContent = `City: ${city.textContent}`;
    temperature.textContent = "";
    humidity.textContent = "";
    wind.textContent = "";
    weatherDescription.textContent = `Sorry, api.openweathermap.org unavailable. ${res.status} : ${res.statusText}`;
    return;
  }

  weatherIcon.className = "weather-icon owf";
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${data.main.temp.toFixed(0)}`;
  humidity.textContent = `Humidity: ${data.main.humidity.toFixed(0)}%`;
  wind.textContent = `Wind: ${data.wind.speed.toFixed(0)} km/h`;
  weatherDescription.textContent = data.weather[0].description;
}

name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
name.addEventListener("click", setName);

focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);
focus.addEventListener("click", setFocus);

btn.addEventListener("click", getImage);

document.addEventListener("DOMContentLoaded", getQuote);
btnQuote.addEventListener("click", getQuote);

document.addEventListener("DOMContentLoaded", getWeather);
city.addEventListener("keypress", setCity);
city.addEventListener("blur", setCity);
city.addEventListener("click", setCity);

//Run
generateImageArr();
showDateTime();
setBgGreet();
getName();
getFocus();
//generateImageArr();
