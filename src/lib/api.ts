const API_BASE = '/api';

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `Request failed (${response.status})`);
  }
  return result as T;
}

export async function uploadImage(file: File): Promise<{ url: string; filename: string; size: number }> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `Upload failed (${response.status})`);
  }
  return result as { url: string; filename: string; size: number };
}

export async function uploadBase64Image(dataUrl: string): Promise<{ url: string; filename: string; size: number }> {
  return apiRequest<{ url: string; filename: string; size: number }>('/upload/base64', {
    method: 'POST',
    body: JSON.stringify({ dataUrl })
  });
}
