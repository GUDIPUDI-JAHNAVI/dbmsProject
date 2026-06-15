export const apibaseurl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const getToken = () => localStorage.getItem('jwtToken') || '';
export const isAuth = () => Boolean(getToken());

export const setAuth = (token, user) => {
  localStorage.setItem('jwtToken', token);
  localStorage.setItem('authUser', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('authUser');
};

export const resolveImageUrl = (image) => {
  if (!image) return 'https://placehold.co/400x300?text=Product';
  if (typeof image === 'string' && image.startsWith('http')) return image;
  if (typeof image === 'string' && image.startsWith('/assets/')) {
    const seed = image.replace('/assets/', '').replace(/\.[^.]+$/, '');
    return `https://picsum.photos/seed/${seed}/400/300`;
  }
  return image;
};

export function callApi(reqMethod, apiUrl, jsonData, responseHandler, jwtToken = '') {
  const headers = {};
  if (jsonData) headers['Content-Type'] = 'application/json';
  if (jwtToken) headers.Token = jwtToken;

  const options = {
    method: reqMethod,
    headers,
    body: jsonData ? JSON.stringify(jsonData) : undefined,
  };

  fetch(apiUrl, options)
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok && data?.code == null) {
        throw new Error(data?.message || res.statusText || 'Request failed');
      }
      return data;
    })
    .then((data) => responseHandler(data))
    .catch((err) => alert(err.message || String(err)));
}
