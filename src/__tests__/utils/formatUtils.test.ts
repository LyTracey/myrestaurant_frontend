
import '@testing-library/jest-dom'
import { errorFormatter } from "../../utils/formatUtils"
import { AxiosError, AxiosResponse } from 'axios'

describe("errorFormatter()", () => {
    test("returns list with one element if error message is string", () => {
        const error = new Error("This is an error")
        expect(errorFormatter(error)).toEqual(["This is an error"])
        expect(errorFormatter(error)).toHaveLength(1)
    })

    test("returns list if error response is a list", () => {
        const error = new AxiosError()
        error.response = {
            data: ["Internal error", "Invalid password"]
        } as AxiosResponse 
        expect(errorFormatter(error)).toEqual(["Internal error", "Invalid password"])
        expect(errorFormatter(error)).toHaveLength(2)
    })


    test("returns list if error response is an object", () => {
        const error = new AxiosError()
        error.response = {
            data: {
                status: "Internal error", 
                message: "Invalid password"
            }
        } as AxiosResponse 
        expect(errorFormatter(error)).toEqual(["Internal error", "Invalid password"])
        expect(errorFormatter(error)).toHaveLength(2)
    })
})