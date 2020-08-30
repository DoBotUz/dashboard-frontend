import axios from '@/api';

export default () => ({
  update: (payload) => axios.post('/profile/update', payload),
  deleteAvatar: () => axios.delete('/profile/delete-avatar'),
});
