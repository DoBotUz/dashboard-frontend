import axios from '@/api';

export default () => ({
  list: (organization) => axios.get(`${organization}/feedbacks/`),
})