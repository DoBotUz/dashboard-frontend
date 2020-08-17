import axios from '@/api';

export default () => ({
  update: (payload) => axios.post('/users/profile/update', payload),
  deleteAvatar: () => axios.delete('/users/profile/delete-avatar'),
});
