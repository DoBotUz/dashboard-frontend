import axios from '@/api';

export default () => ({
  list: (organizationId) => axios.get(`${organizationId}/feedbacks/`),
})
