import { AxiosError } from "axios";

export function errorFormatter (error: AxiosError | any) {
    /*
        Returns error.response.data as an array of its values.
    */

    const data = error?.response?.data ?? error.message;

    if (typeof(data) === "string") {
        return [data]
    } else if (Array.isArray(data)) {
        return data
    } else {
        return Object.values(data)
    }
};