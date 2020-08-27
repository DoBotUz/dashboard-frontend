import io from 'socket.io-client';

let socketOrganizationId = null;
let clientSocket = null;

export default (organizationId) => {
  console.log(organizationId, socketOrganizationId);
  if (organizationId != socketOrganizationId) {
    clientSocket = io(`${process.env.VUE_APP_WS_URL}/frontend`, {
      query: {
        authorization: `Bearer ${localStorage.getItem('access_token')}`,
        organizationId: organizationId
      },
    });
    socketOrganizationId = organizationId;
  }
  return clientSocket;
}