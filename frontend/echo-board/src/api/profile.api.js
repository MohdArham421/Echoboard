import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const updateProfile = (data) =>
  API.put("/profile/update", data);

export const getProfile = () =>
  API.get("/profile");