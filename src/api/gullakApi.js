import axios from "axios";
const BASE_URL = "https://dukanse-be.onrender.com/api/gullakDashboard";

export const fetchTotalActiveCoins = () =>
  axios.get(`${BASE_URL}/getTotalActiveCoins`);

export const fetchBreakageRate = () =>
  axios.get(`${BASE_URL}/getBreakageRate`);

export const fetchCoinsExpiringSoon = () =>
  axios.get(`${BASE_URL}/getCoinsExpiringSoon`);

export const fetchCoinActivityOverview = (filter) =>
  axios.get(`${BASE_URL}/getCoinActivityOverview`, { params: { filter } });

export const fetchGullakManagement = () =>
  axios.get(`${BASE_URL}/gullakManagement`);

export const fetchCoinActivityDropdown = () =>
  axios.get(`${BASE_URL}/coinActivityDropdown`);
