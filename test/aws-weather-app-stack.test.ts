import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { AwsWeatherAppStack } from "../lib/stack";

jest.mock("aws-cdk-lib/pipelines", () => ({
    CodePipeline: jest.fn(),
    ShellStep: jest.fn(),
    CodePipelineSource: { gitHub: jest.fn() }
}))

describe("Weather App test", () => {
    it("Stack created", () => {
        const app = new cdk.App();
        // when
        const stack = new AwsWeatherAppStack(app, "AwsWeatherAppStack");
        // then
        expect(Template.fromStack(stack)).toMatchSnapshot();
    })
})