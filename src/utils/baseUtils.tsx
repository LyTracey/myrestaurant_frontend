// import { userAPI } from "../components/pages/Base/App";
// import endpoints from "../data/endpoints";
import { AxiosResponse, AxiosError } from "axios";
// import { PUBLIC } from "../components/pages/Base/App";
// import { Location, NavigateFunction } from "react-router-dom";
import { dataAPI, userAPI } from "../components/pages/Base/App";
import { Dispatch, SetStateAction, MouseEvent } from "react";
import { FormEvent } from "react";


// Submit Request abstraction
const SUBMIT_ACTIONS = {
    ADD: "add",
    DELETE: "delete",
    UPDATE: "update"
};

interface SubmitObj {
    event: FormEvent<HTMLFormElement> | MouseEvent<HTMLElement>,
    method: string,
    data?: any,
    url: string,
    resolve: (...args: any) => void,
    reject:  (error: AxiosError, ...args: any) => void,
    setValidated?: Dispatch<SetStateAction<boolean>> | null
};

export function submitDataRequest ({event, method, data, url, resolve, reject, setValidated=null}: SubmitObj) {
    /*
        Function that handles delete, post, and patch requests for the dataAPI.
    */
   
   event.preventDefault();

   if (event.currentTarget instanceof HTMLFormElement && event.currentTarget.checkValidity!() === false) {
        event.stopPropagation();
        return "Not valid"
   } else {
        switch (method) {
            case SUBMIT_ACTIONS.DELETE:
                return dataAPI.delete( url,
                    ).then((response: AxiosResponse) => resolve(response)
                    ).catch((error: AxiosError) => reject(error));
            case SUBMIT_ACTIONS.ADD:
                return dataAPI.post( url, data
                ).then((response: AxiosResponse) => resolve(response))
                .catch((error: AxiosError) => reject(error));
            case SUBMIT_ACTIONS.UPDATE:
                return dataAPI.patch( url, data
                ).then((response: AxiosResponse) => resolve(response))
                .catch((error: AxiosError) => reject(error));
            default:
                return "Unknown action"
        }
    }

    if (setValidated !== null ) {
        setValidated!(true);
    }

};


export function submitUserRequest ({event, method, data, url, resolve, reject, setValidated=null}: SubmitObj) {
    /*
        Function that handles delete, post, and patch requests for the dataAPI.
    */
   
   event.preventDefault();

   if (event.currentTarget instanceof HTMLFormElement && event.currentTarget.checkValidity!() === false) {
        event.stopPropagation();
        return "Not valid"
   } else {
        switch (method) {
            case SUBMIT_ACTIONS.DELETE:
                return userAPI.delete( url,
                    ).then((response: AxiosResponse) => resolve(response)
                    ).catch((error: AxiosError) => reject(error));
            case SUBMIT_ACTIONS.ADD:
                return userAPI.post( url, data
                ).then((response: AxiosResponse) => resolve(response))
                .catch((error: AxiosError) => reject(error));
            case SUBMIT_ACTIONS.UPDATE:
                return userAPI.patch( url, data
                ).then((response: AxiosResponse) => resolve(response))
                .catch((error: AxiosError) => reject(error));
            default:
                return "Unknown action"
        }
    }

    if (setValidated !== null ) {
        setValidated!(true);
    }

};
