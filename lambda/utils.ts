import axios from 'axios';
import { SSM } from "aws-sdk";
import type { weatherResponse, weatherDays } from './types'

export const getDate = (): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().substring(0, 10);
}

const getApiKey = async (): Promise<string> => {
    const ssm = new SSM();
    const apiKey = (await ssm.getParameter({ Name: "/apikeys/visualcrossing/weather-api" }).promise()).Parameter?.Value;
    if (!apiKey) {
        throw new Error("Api key couldn't be retrieved");
    }
    return apiKey;
}

export const getWeatherData = async (date: string, location: string): Promise<weatherDays> => {
    const apiKey = await getApiKey();
    const endpoint = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date}?unitGroup=metric&include=days&key=${apiKey}&contentType=json`
    const res = await axios.get<weatherResponse>(endpoint);
    return res.data.days[0]
};

export const processData = (data: weatherDays, date: string, location: string) => (JSON.stringify({
    date,
    location,
    tempmax: data.tempmax,
    tempmin: data.tempmin,
    temp: data.tempmin,
    feelslike: data.feelslike,
    feelslikemin: data.feelslikemin,
    feelslikemax: data.feelslikemax,
    sunrise: data.sunrise,
    sunset: data.sunset,
    snow: data.snow,
    conditions: data.conditions,
    description: data.description,
}));

