import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const getPreferenceByEmail = async (userEmail: string) => {
  const response = await axios.get(
    `/api/preferences/get?userEmail=${userEmail}`,
  );
  return response.data;
};

const useGetPreference = (userEmail: string) => {
  return useQuery(['preference', userEmail], () =>
    getPreferenceByEmail(userEmail),
  );
};

export default useGetPreference;
