const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });

    if (response.status === 204) {
        return undefined as T;
    }

    const data = await response.json();

    if (!response.ok) {
        const mensajeError =
            data.errores?.join(' | ') ||
            (typeof data.error === 'string' ? data.error : null) ||
            data.msg ||
            data.mensaje ||
            data.message ||
            'Error en la petición';
        throw new Error(mensajeError);
    }

    return data;
}

export const api = {
    get: <T>(endpoint: string) => request<T>(endpoint),
    post: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) =>
        request<T>(endpoint, { method: 'DELETE' }),
};