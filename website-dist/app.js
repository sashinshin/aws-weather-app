const button = document.getElementById("button");

button.addEventListener("click", async () => {
    const endpoint = "https://2oxnxxfh16.execute-api.eu-west-1.amazonaws.com/prod/weather"
    const res = await fetch(endpoint).then(res => res.json()).then(data => data);

    const list = await res.map(t => JSON.parse(t))
    console.log(list);

    const dataContainer = document.getElementById("data-container");
    list.forEach(element => {
        const day = document.createElement("li")
        const node = document.createTextNode(`${element.date}: ${element.description} It was ${element.temp}, and felt like ${element.feelslike}`);
        day.appendChild(node)
        dataContainer.appendChild(day)
    });

    button.remove();
});

