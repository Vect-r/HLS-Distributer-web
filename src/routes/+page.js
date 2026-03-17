export async function load(params,fetch) {
    const res = await fetch('http://127.0.0.1:8000/api/items/');
    const response = await res.json()

    const tags = [];
    const networks = [];
    const performers = [];
    const platforms = [];

    return {tags,networks,performers,platforms}
}