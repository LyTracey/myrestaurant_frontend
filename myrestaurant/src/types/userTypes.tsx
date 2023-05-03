export interface User {
    email: string,
    password1: string,
    password2: string,
    is_staff: boolean
};

export interface LoginUser {
    email: string,
    password: string
};