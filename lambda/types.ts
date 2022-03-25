export interface weatherResponse {
    queryCost: number;
    latitude: number;
    resolvedAddress: string;
    address: string;
    tzoffset: number;
    days: weatherDays[]
    stations: object;
}

export interface weatherDays {
    datetime: string;
    datetimeEpoch: number;
    tempmax: number;
    tempmin: number;
    temp: number;
    feelslikemax: number;
    feelslikemin: number;
    feelslike: number;
    dew: number;
    humidity: number;
    precip: number;
    precipprob: unknown;
    precipcover: number;
    preciptype: unknown;
    snow: unknown;
    snowdepth: number | null;
    windgust: number;
    windspeed: number;
    winddir: number;
    pressure: number;
    cloudcover: number;
    visibility: number;
    solarradiation: number;
    solarenergy: number;
    uvindex: number;
    sunrise: string;
    sunriseEpoch: number;
    sunset: string;
    sunsetEpoch: number;
    moonphase: number;
    conditions: string;
    description: string;
    icon: string;
    stations: string[]
    source: string;
}