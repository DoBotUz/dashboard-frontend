import axios from 'axios';

export default {
  getMe: (token) => axios.get(`https://api.telegram.org/bot${token}/getMe`)
}