import axios from 'axios'
const button = document.getElementById("button")

const endpoint = "https://2oxnxxfh16.execute-api.eu-west-1.amazonaws.com/prod/weather"
button.addEventListener("click", async () => {
    const res = await axios.get(endpoint);
    console.log(res);
    console.log("hello");
});

