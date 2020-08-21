import axios from '@/api';

export default () => ({
  readAll: () => axios.post('/notifications/read-all'),
});
