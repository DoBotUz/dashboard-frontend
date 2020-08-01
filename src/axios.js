// axios
import axios from 'axios'

const baseURL = 'https://localhost:4001/rest/v1/'

export default axios.create({
  baseURL: baseURL
  // You can add your headers here
})
