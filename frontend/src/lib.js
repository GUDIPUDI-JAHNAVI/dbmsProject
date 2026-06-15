import { demoSearch, demoSignin, demoSignup } from './demoData';

export const isDemoMode = () => {
  if (import.meta.env.VITE_API_BASE_URL) return false;
  const host = window.location.hostname;
  return host !== 'localhost' && host !== '127.0.0.1';
};

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

const handleDemoApi = (reqMethod, apiUrl, jsonData, responseHandler) => {
  const url = new URL(apiUrl, window.location.origin);

  if (reqMethod === 'POST' && url.pathname.endsWith('/authservice/signup')) {
    responseHandler(demoSignup(jsonData));
    return;
  }

  if (reqMethod === 'POST' && url.pathname.endsWith('/authservice/signin')) {
    responseHandler(demoSignin(jsonData));
    return;
  }

  if (reqMethod === 'GET' && url.pathname.includes('/itemservice/search')) {
    responseHandler(demoSearch(url.searchParams));
    return;
  }

  responseHandler({ code: 404, message: 'Demo endpoint not found' });
};

export function callApi(reqMethod, apiUrl, jsonData, responseHandler, jwtToken = '') {
  if (isDemoMode()) {
    window.setTimeout(() => handleDemoApi(reqMethod, apiUrl, jsonData, responseHandler), 150);
    return;
  }

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
    .catch((err) => {
      const message = err.message === 'Failed to fetch'
        ? 'Cannot reach the API. Start the backend locally, or use the GitHub Pages demo mode.'
        : err.message || String(err);
      alert(message);
    });
}
