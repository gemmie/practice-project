import axios, { AxiosResponse } from 'axios';

export const httpClient = axios.create();
export type HttpResponse<T> = AxiosResponse<T>;
