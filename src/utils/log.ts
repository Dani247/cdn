export const log = (...params: any[]) => {
    if (process.env.PRINT_LOGS) {
        console.log(...params);
    }
}