import { httpClient } from 'core/http/httpClient';
import { cacheClient } from 'core/cache/cacheClient';

export const getAllBreeds = async (cacheKey: string) => {
    const breeds = await httpClient
        .get('https://dog.ceo/api/breeds/list/all')
        .then((httpResponse) => httpResponse.data);

    console.log('cache MISS');
    await cacheClient.set(cacheKey, breeds);

    return breeds;
};
