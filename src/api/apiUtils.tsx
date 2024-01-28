import { userAPI, dataAPI } from "./axiosInstances";
import { Dispatch, SetStateAction } from "react";
import jwtDecode from "jwt-decode";

interface TokenData {
  access: string;
  refresh: string;
}

// Set access and refresh token
export function changeTokens(
  data: TokenData,
  userSetter: Dispatch<SetStateAction<any>>
) {
  return new Promise(function (resolve, reject) {
    // Set access token
    localStorage.setItem("access", data.access);
    userAPI.defaults.headers["Authorization"] = `Bearer ${data.access}`;
    dataAPI.defaults.headers["Authorization"] = `Bearer ${data.access}`;

    // Set user info
    try {
      const { isStaff, role }: any = jwtDecode(data.access);
      userSetter({
        isStaff: isStaff,
        role: role,
      });
    } catch {
      throw new Response("User data not available", { status: 401 });
    }

    // Set expiry time
    try {
      const { exp }: any = jwtDecode(data.access);
      localStorage.setItem("expiry", String(exp * 1000));
    } catch (error) {
      console.log(error);
    }

    // Set refresh token
    localStorage.setItem("refresh", data.refresh);

    if (localStorage.getItem("refresh")) {
      resolve("Success");
    } else {
      reject("Error");
    }
  });
}
