export async function load({url}) {
    const res = await fetch('http://127.0.0.1:8000/api/items/');
    const item_values = await res.json()

    const queries = Object.fromEntries(url.searchParams)
    let states = { 
        tags: [],
        models: [], 
        networks: [], 
    }

    
    url.searchParams.getAll('tags').forEach(element => {
        states.tags.push(element)
        
    });
    url.searchParams.getAll('models').forEach(element => {
        states.tags.push(element)
    });
    url.searchParams.getAll('networks').forEach(element => {
        states.tags.push(element)
    });
    
    let apiParams = {
        tag:states.tags,
        performer: states.models,
        search:'',
        network:states.networks,
        page: queries.page || 1
    }
    
    
    // console.log(apiParams)

    return {item_values,apiParams}
}