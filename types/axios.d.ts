import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig<D = any> {
    _retry?: boolean;
  }
}
