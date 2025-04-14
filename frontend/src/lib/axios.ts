import axios, { AxiosError } from "axios";
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;
            const data: any = error.response.data;
            const message = data?.message || error.message || 'An unexpected error occurred';

            console.error('API Error:', { status, data, message });

            switch (status) {
                case 401:
                    toast.error('Authentication required. Please log in.');
                    break;
                case 403:
                    toast.error(message || 'You do not have permission to perform this action.');
                    break;
                case 404:
                    toast.error(message || 'The requested resource was not found.');
                    break;
                case 422:
                    toast.warning('Validation failed. Please check the form fields.');
                    break;
                case 500:
                case 503:
                    toast.error(message || 'A server error occurred. Please try again later.');
                    break;
                default:
                    if (status >= 400 && status < 500) {
                         toast.error(`Client Error (${status}): ${message}`);
                    } else {
                         toast.error(`Error (${status}): ${message}`);
                    }
            }
        } else if (error.request) {
            console.error('Network Error:', error.request);
            toast.error('Network error. Please check your connection or try again later.');
        } else {
            console.error('Request Setup Error:', error.message);
            toast.error(`Request error: ${error.message}`);
        }

        return Promise.reject(error);
    }
);


export default api;
