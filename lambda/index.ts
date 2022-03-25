import axios from 'axios';
import { SSM } from "aws-sdk";

export const handler = async (data: unknown): Promise<unknown> => {
    //event bridge triggered lambda


    
    
    // get api key
    const ssm = new SSM();
    const ssmRes = (await ssm.getParameter({Name: "/apikeys/visualcrossing/weather-api"}).promise()).Parameter?.Value;
    
    
    console.log(ssmRes);
    
    // make api call to weather api
    // yyyy-MM-dd
    const endDate = "2022-01-01";
    const startDate = "/2022-01-01";
    const date = endDate + startDate;

    const apiKey = ""
    const location = 'Stockholm'
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${date}?unitGroup=metric&key=${apiKey}&contentType=json`
    // const res = await axios.get(url);


    // clean data, create filename
    // write to s3

    return data;

}