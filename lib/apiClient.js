export async function apiFetch(input, init = {}) {
    const token = localStorage.getItem('accessToken');

    const res = await fetch(`${input}`, {
        ...init, headers: {
            'Content-Type': 'application/json', ...(init.headers || {}), Authorization: token ? `Bearer ${token}` : '',
        },
    });

    if (res.status === 401) {
        window.dispatchEvent(new Event('logout'));
        throw new Error('Unauthorized');
    }

    return res;
}

