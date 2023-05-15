
export function errorFormatter (error: any) {
    /*
        Returns error.response.data as an array of its values.
    */
    const errorObj = JSON.parse(JSON.stringify(error.response.data));
    const formattedError = Object.entries(errorObj ?? {}).map((item) => String(item[1]));
    return formattedError
};