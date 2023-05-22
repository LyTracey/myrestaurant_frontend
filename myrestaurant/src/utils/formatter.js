export function errorFormatter(error) {
    var _a;
    /*
        Returns error.response.data as an array of its values.
    */
    var errorObj = JSON.parse(JSON.stringify((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data));
    var formattedError = Object.entries(errorObj !== null && errorObj !== void 0 ? errorObj : {}).map(function (item) { return String(item[1]); });
    return formattedError;
}
;
