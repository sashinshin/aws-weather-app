import axios from "axios";
import { handler as accessWeatherHandler } from "../lambda/accessWeather/index";
import { handler as retrieveWeatherHandler } from "../lambda/retrieveWeather/index";

process.env.WEATHER_BUCKET_NAME = "test-bucket-name";

jest.mock("aws-sdk", () => ({
    S3: class {
        constructor() {
            return {
                getObject: () => ({
                    promise: () => (Promise.resolve({ result: { Body: "result" } }))
                }),
                listObjectsV2: () => ({
                    promise: () => (Promise.resolve({ Contents: [{ Key: "Key1" }, { Key: "Key2" }] }))
                }),
                putObject: () => ({
                    promise: () => (Promise.resolve({ Etag: "put-object-mock-response" }))
                })
            }
        }
    },
    SSM: class {
        constructor() {
            return {
                getParameter: () => ({
                    promise: () => (Promise.resolve({ Parameter: { Value: "mock-api-key" } }))
                })
            }
        }
    }
}));
jest.mock("axios");

test("Test accessWeather lambda", async () => {
    // when
    const res = await accessWeatherHandler();
    // then
    expect(res).toMatchSnapshot();
})

test("Test retrieveWeather lambda", async () => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockResolvedValueOnce({ data: { days: ["mock-api-response"] } });
    // when
    const res = await retrieveWeatherHandler();
    // then
    expect(res).toMatchSnapshot();
})
