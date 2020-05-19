import axios from "axios";

const instance = axios.create({
  baseURL: "[You Server URL]",
});
export default instance;
