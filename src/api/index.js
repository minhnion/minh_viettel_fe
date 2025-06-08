// src/api/auth.js
const API_BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api`;

// --- Hàm xử lý response chung ---
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
// --- Kết thúc hàm xử lý response ---


// --- Các hàm gọi API ---

export const registerApi = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      // credentials: 'include' KHÔNG cần thiết cho đăng ký nếu không cần gửi cookie nào
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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include', // <<<--- THÊM: Để trình duyệt nhận và lưu session cookie từ response
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

// Hàm để lấy thông tin người dùng đã đăng nhập
export const infoApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/info`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // <<<--- THÊM: Để trình duyệt gửi session cookie
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

export const logoutApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // <<<--- THÊM: Cần gửi session cookie để biết session nào cần hủy
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