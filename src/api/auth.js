import axios from '@/api';

export default () => ({
  userInfo: () => axios.get('/users/profile'),
  activateByToken: (token) => axios.post(`/verify-email-token/${token}`),
});
