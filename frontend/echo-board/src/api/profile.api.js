import axios from "axios";
import { API_URL } from "../config";

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const updateProfile = (data) =>
  API.put("/profile/update", data);

export const getProfile = () =>
  API.get("/profile");