export function buildQuery(paramsObj) {
  const params = new URLSearchParams();

  for (const key in paramsObj) {
    const value = paramsObj[key];

    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    } else {
      params.append(key, value);
    }
  }

  return params.toString();
}

export function formatDate(d) {
  const options = { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
  return new Date(d).toLocaleString('en-US', options);
}