// axios
import axios from 'axios'

const baseURL = "http://localhost:3000/rest/v1/"

export default axios.create({
  baseURL: baseURL
  // You can add your headers here
})
