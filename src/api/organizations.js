import axios from '@/api';

export default () => ({
  list: () => axios.get(`/organizations/list`),
});
