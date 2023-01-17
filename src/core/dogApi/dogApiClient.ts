import { httpClient, HttpResponse } from '../http/httpClient';
import { cacheClient } from '../cache/cacheClient';

export type BreedsResponse = {
    message: any;
    status: string;
};

export const getAllBreeds = async (): Promise<BreedsResponse> => {
    return await httpClient
        .get('https://dog.ceo/api/breeds/list/all')
        .then(
            (httpResponse: HttpResponse<BreedsResponse>) => httpResponse.data
        );
};
