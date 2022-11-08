import { httpClient } from 'core/http/httpClient';
import { cacheClient } from 'core/cache/cacheClient';

export const getAllBreeds = async () => {
    return await httpClient
        .get('https://dog.ceo/api/breeds/list/all')
        .then((httpResponse) => httpResponse.data);
};
