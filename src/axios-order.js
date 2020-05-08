import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-my-burger-e3301.firebaseio.com/",
});
export default instance;
