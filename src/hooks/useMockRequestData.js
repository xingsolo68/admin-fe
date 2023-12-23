import axios from 'axios';
import { useQuery } from 'react-query';

const fetchMockRequest = (mockId) => {
  return axios.get(`http://127.0.0.1:5000/mock/${mockId}`);
};

export const useMockRequestData = (mockId) => {
  return useQuery(['mock-request', mockId], async () => (await fetchMockRequest(mockId)).data, {
    enabled: !!mockId
  });
};
