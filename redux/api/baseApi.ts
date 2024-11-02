import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { clearToken } from "../apiSlices/tokenSlice";

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://192.168.12.158:3000",
  baseUrl: "https://nail-flags-gnome-receiver.trycloudflare.com/",
  timeout: 10000,
  prepareHeaders: async (headers, { getState }) => {
    // const token = localStorage.getItem("token");
    const token = Cookies.get("token");
    // console.log(token);
    if (token) {
      // console.log(token);
      headers.set("authorization", `Bearer ${token}`);
      // headers.getSetCookie()
    }
    return headers;
  },
});

const baseQueryWithRath: typeof baseQuery = async (args, api, extraOptions) => {
  // const socket = getSocket();
  // if (!socket){
  //   initiateSocket();
  // }

  let result = await baseQuery(args, api, extraOptions);
  // console.log(result);

  if (result?.error?.status) {
    if (result?.error?.status === 403) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Session Expired. Please Login Again",
        confirmButtonText: "Ok",
      });
    }

    // if (result?.error?.status === 404) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text:
    //       result.error.data.message ||
    //       result?.error?.error ||
    //       "An error occurred",
    //     confirmButtonText: "Ok",
    //   });
    // }
  }

  if (result?.error?.status === 401) {
    // Handle token refresh logic here if needed
    // For now, we'll log out the user
    // removeStorageRole();
    // Swal.fire({
    //   icon: "error",
    //   title: "Oops...",
    //   text: "Session Expired. Please Login Again",
    //   confirmButtonText: "Ok",
    // });

    api.dispatch(clearToken());
    // result = await baseQuery(args, api, extraOptions);
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  // keepUnusedDataFor: 0,
  baseQuery: baseQueryWithRath,

  endpoints: () => ({}),
  tagTypes: [
    "user",
    "services",
    "appointments",
    "notes",
    "prescription",
    "review",
    "termsAndCondition",
    "faqs",
    "notifications",
    "payment",
    "tips",
  ],
});

export const imageUrl = "https://nail-flags-gnome-receiver.trycloudflare.com//";
