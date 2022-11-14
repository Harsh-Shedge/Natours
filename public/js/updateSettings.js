import axios from 'axios';

import { showAlert } from './alert';

// type either password or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:7000/api/v1/users/updatePassword'
        : 'http://localhost:7000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
