export const getEnvVar = (input: string) => {
    const value= process.env[input];
    if (typeof value === "string") {
        return value;
    }
    throw new Error(`process.env.${input} was not set`)
}