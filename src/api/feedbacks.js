import axios from '@/api';

export default () => ({
  list: (organization) => axios.get(`/feedbacks/${organization}/list`),
})