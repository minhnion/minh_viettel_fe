const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL}`;

// --- Common response handler ---
const handleApiResponse = async (response) => {
  let data = {};
  try {
    data = await response.json();
  } catch (e) {
    data = { message: response.statusText || 'An unknown error occurred.' };
  }

  if (!response.ok) {
    let errorMessage = 'An unknown error occurred.';
    if (data.error) {
      if (Array.isArray(data.error) && data.error.length > 0 && data.error[0].msg) {
        errorMessage = data.error[0].msg;
      } else if (typeof data.error === 'string') {
        errorMessage = data.error;
      } else if (data.error.message) {
        errorMessage = data.error.message;
      }
    } else if (data.message) {
      errorMessage = data.message;
    } else if (response.statusText) {
      errorMessage = response.statusText;
    } else {
      errorMessage = `Error: ${response.status}`;
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;

    if (response.status === 401 && data.error === "Email not verified") {
      error.isVerificationError = true;
    }
    throw error;
  }

  return data;
};
// --- End common response handler ---

// --- API call functions ---

export const registerApi = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error("API Register Error:", error);
    if (error instanceof TypeError) {
      throw new Error('Connection error. Please check your network and CORS settings.');
    }
    throw error;
  }
};

export const loginApi = async (credentials) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    formData.append('grant_type', 'password'); 

    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      credentials: 'include', // To handle session cookies
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error("API Login Error:", error);
    if (error instanceof TypeError) {
      throw new Error('Connection error. Please check your network and CORS settings.');
    }
    throw error;
  }
};

export const infoApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/info`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Assuming token-based auth
      },
      credentials: 'include', // To send session cookie
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error("API Info Error:", error);
    if (error instanceof TypeError) {
      throw new Error('Connection error. Please check your network and CORS settings.');
    }
    throw error;
  }
};

export const logoutApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include', // To invalidate session cookie
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error("API Logout Error:", error);
    if (error instanceof TypeError) {
      throw new Error('Connection error. Please check your network.');
    }
    throw error;
  }
};

export const analyzeImageApi = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/analyze-image/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
      credentials: 'include',
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error("API Analyze Image Error:", error);
    if (error instanceof TypeError) {
      throw new Error('Connection error. Please check your network and CORS settings.');
    }
    throw error;
  }
};

export const getHistoryApi = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error("API History Error:", error);
    if (error instanceof TypeError) {
      throw new Error('Connection error. Please check your network and CORS settings.');
    }
    throw error;
  }
};