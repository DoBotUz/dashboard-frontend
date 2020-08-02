// axios
import axios from 'axios'

const baseURL = `${process.env.VUE_APP_BASE_URL}/rest/v1/`;
export default axios.create({
  baseURL: baseURL
  // You can add your headers here
})
