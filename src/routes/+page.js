import { error } from '@sveltejs/kit';
import {sortOptions} from '$lib/stores.js'
import { baseUrl } from '$lib/stores.js';
import { authFetch } from '../lib/api.js';

export async function load({url}) {
    // const res = await fetch('http://127.0.0.1:8000/api/items/');
    const res = await authFetch('/api/items/');
    const item_values = await res.json()

    const queries = Object.fromEntries(url.searchParams)
    let states = { 
        tags: [],
        models: [], 
        networks: [], 
        sort: '',
    }

    
    url.searchParams.getAll('tags').forEach(element => {
        if (!item_values.tags.includes(element)){
            throw error(404, 'Invalid Tag. Please Visit Home.');
        }
        states.tags.push(element)
        
    });
    url.searchParams.getAll('models').forEach(element => {
        if (!item_values.performers.includes(element)){
            throw error(404, 'Item not found');
        }
        states.models.push(element)
    });
    url.searchParams.getAll('networks').forEach(element => {
        if (!item_values.networks.includes(element)){
            throw error(404, 'Item not found');
        }
        states.networks.push(element)
    });

    if ('sort' in queries){
        if (!Object.keys(sortOptions).includes(queries.sort)){
            throw error(404)
        }
        states.sort = queries.sort;
    }

    
    let apiParams = {
        search: queries.search || '',
        tag:states.tags,
        performer: states.models,
        network:states.networks,
        ordering: queries.sort || '-created_at',
        // page: queries.page || 1
        offset: 0
    }
    
    
    // console.log(apiParams)

    return {item_values,apiParams}
}

export const ssr = false;
export const csr = true;