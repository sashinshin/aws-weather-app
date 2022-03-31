const button = document.getElementById("button");

const endpoint = "https://2oxnxxfh16.execute-api.eu-west-1.amazonaws.com/prod/weather"
button.addEventListener("click", async () => {
    const res = await fetch(endpoint, {
        method: "GET",
        headers: {

        }
    })
    const parsed = JSON.parse(res.body);
    console.log(res);
    console.log("hello");
    const data = parsed.map(day => day.temp)
    console.log(data);
});

