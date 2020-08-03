import axios from '@/api';

export default () => ({
  userInfo: () => axios.get('/users/profile'),
});
