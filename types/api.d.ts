import { AxiosRequestConfig } from 'axios';

declare module '@/lib/api' {
  export function get<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<T>;

  export function post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T>;

  export function put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<T>;

  export function del<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<T>;
}
