export function errorFormatter(error) {
    /*
        Returns error.response.data as an array of its values.
    */
    var errorObj = JSON.parse(JSON.stringify(error.response.data));
    var formattedError = Object.entries(errorObj !== null && errorObj !== void 0 ? errorObj : {}).map(function (item) { return String(item[1]); });
    return formattedError;
}
;
