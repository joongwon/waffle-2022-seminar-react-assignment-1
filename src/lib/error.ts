import axios from "axios";
import { toast } from "react-toastify";

export const axiosErrorHandler = (message: string) => (err: unknown) => {
  if (axios.isAxiosError(err)) {
    const resMsg = err.response?.data.message;
    toast.error(`${message}${resMsg ? ": " + resMsg : ""}`);
  } else throw err;
};

export const axiosErrorStatus = (err: unknown) =>
  axios.isAxiosError(err) && (err.response?.status ?? null);
