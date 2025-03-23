import axios from 'axios';
const local = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: `${local}`,
});
export default api;
