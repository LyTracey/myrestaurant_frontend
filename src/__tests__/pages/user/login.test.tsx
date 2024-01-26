import '@testing-library/jest-dom';
import { render,  cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../../pages/user/Login';
import { BrowserRouter } from 'react-router-dom';
import { GlobalContextProvider } from '../../../App';
import userEvent from '@testing-library/user-event';
import axios from 'axios';


jest.mock('axios');

describe("<Login /> unit tests", () => {

    beforeEach(() => {
        render(
            <BrowserRouter>
                <GlobalContextProvider>
                    <Login />
                </GlobalContextProvider>
            </BrowserRouter>
        );
    });

    afterEach(() => cleanup);
    
    test("validate initial username feedback field is empty", () => {
        expect(screen.getByTestId("username-feedback")).toHaveTextContent("");
    });
    
    test("username validation message appears when invalid form submitted", async () => {
        const loginButton = screen.getByRole('button', { name: "Login"});
        fireEvent.click(loginButton);
        await waitFor(() => expect(screen.getByTestId("username-feedback")).toHaveTextContent("Please enter a username."));
    });

    test("validate initial password feedback field is empty", () => {
        expect(screen.getByTestId("password-feedback")).toHaveTextContent("");
    });
    
    test("password validation message appears when invalid form submitted", async () => {
        const loginButton = screen.getByRole('button', { name: "Login"});
        fireEvent.click(loginButton);
        await waitFor(() => expect(screen.getByTestId("password-feedback")).toHaveTextContent("Please enter a password."));
    });
})

const localStorageCases = [["access", "accessToken"], ["refresh", "refreshToken"], ["username", "myUser"]];

describe("<Login /> integration tests", () => {
    beforeAll(() => {
        // Mock window.location.pathname
        Object.defineProperty(window, "location", { 
            value: {
                ...window.location,
                location: "/login"
            }
        });

        // Mock login API
        (axios.post as jest.Mock).mockResolvedValue({
            access: "accessToken",
            refresh: "refreshToken"
        });
    })

    beforeEach(() => {
        render(
            <BrowserRouter>
                <GlobalContextProvider>
                    <Login />
                </GlobalContextProvider>
            </BrowserRouter>
        );
    });

    afterEach(() => cleanup);

    test("navigate to profile after successful login", async () => {
        const usernameField = screen.getByTestId("username-field");
        const passwordField = screen.getByTestId("password-field");
        const loginButton = screen.getByRole("button", {name: "Login"});

        userEvent.type(usernameField, "myUser");
        userEvent.type(passwordField, "myPassword")
        await userEvent.click(loginButton);

        waitFor(() => expect(window.location.pathname).toEqual("/profile"));
    });

    test.each(localStorageCases)("values are added to localStorage after successful login", async (key, value) => {
        const usernameField = screen.getByTestId("username-field");
        const passwordField = screen.getByTestId("password-field");
        const loginButton = screen.getByRole("button", {name: "Login"});

        userEvent.type(usernameField, "myUser");
        userEvent.type(passwordField, "myPassword")
        await userEvent.click(loginButton);

        waitFor(() => expect(window.localStorage.getItem(key)).toEqual(value));    
    });

});



