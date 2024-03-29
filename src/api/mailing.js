import axios from '@/api';

export default () => ({
  fetch: (organizationId, params) => axios.get(`${organizationId}/mailing-templates`, { params }),
  fetchOne: (organizationId, mailing_id) => axios.get(`${organizationId}/mailing-templates/${mailing_id}`),
  fetchCats: (organizationId) => axios.get(`${organizationId}/mailing-templates/categories`),
  createDraft: (organizationId, payload) => axios.post(`/${organizationId}/mailing-templates/`, payload),
  updateDraft: (organizationId, payload) => axios.post(`/${organizationId}/mailing-templates/update`, payload),
  delete: (organizationId, id) => axios.delete(`/${organizationId}/mailing-templates/${id}`),
  startOne: (organizationId, botId, mailingId) => axios.post(`/${organizationId}/mailing-templates/start-draft/${mailingId}/${botId}`),
  duplicateOne: (organizationId, id) => axios.post(`/${organizationId}/mailing-templates/duplicate/${id}`),
})
