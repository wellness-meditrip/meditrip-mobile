import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  isCancel,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  API_CONFIG,
  API_ENDPOINTS,
  SERVICE_URLS,
  ApiResponse,
  ApiError,
} from './api';

// API 클라이언트 클래스
class ApiClient {
  private axiosInstances: Map<string, AxiosInstance> = new Map();
  private cancelTokens: Map<string, CancelTokenSource> = new Map();

  constructor() {
    // 서비스별 axios 인스턴스 생성
    this.createAxiosInstances();
  }

  // 서비스별 axios 인스턴스 생성
  private createAxiosInstances() {
    Object.entries(SERVICE_URLS).forEach(([service, baseURL]) => {
      const instance = axios.create({
        baseURL,
        headers: API_CONFIG.HEADERS,
        timeout: API_CONFIG.TIMEOUT,
      });

      this.setupInterceptors(instance, service);
      this.axiosInstances.set(service, instance);
    });
  }

  // 서비스에 맞는 axios 인스턴스 가져오기
  private getAxiosInstance(service: string): AxiosInstance {
    const instance = this.axiosInstances.get(service);
    if (!instance) {
      throw new Error(`Unknown service: ${service}`);
    }
    return instance;
  }

  // 인터셉터 설정
  private setupInterceptors(instance: AxiosInstance, service: string) {
    // 요청 인터셉터
    instance.interceptors.request.use(
      config => {
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    instance.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        // 401 에러 처리 (토큰 만료)
        if (error.response?.status === 401) {
          // 토큰 갱신 로직을 여기에 추가할 수 있습니다
          this.removeAuthToken();
        }

        return Promise.reject(error);
      }
    );
  }

  // 토큰 설정 (모든 인스턴스에 적용)
  async setAuthToken(token: string) {
    // 모든 axios 인스턴스에 토큰 설정
    this.axiosInstances.forEach(instance => {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    });

    // AsyncStorage에 토큰 저장
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      // 토큰 저장 실패 처리
    }
  }

  // 토큰 제거 (모든 인스턴스에서 제거)
  async removeAuthToken() {
    // 모든 axios 인스턴스에서 토큰 제거
    this.axiosInstances.forEach(instance => {
      delete instance.defaults.headers.common['Authorization'];
    });

    // AsyncStorage에서 토큰 제거
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      // 토큰 제거 실패 처리
    }
  }

  // 토큰 로드 (모든 인스턴스에 적용)
  async loadAuthToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        // 모든 axios 인스턴스에 토큰 설정
        this.axiosInstances.forEach(instance => {
          instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        });
      }
      return token;
    } catch (error) {
      return null;
    }
  }

  // 토큰 가져오기 (AsyncStorage에서만 가져오기, 헤더 설정 안함)
  async getAuthToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return token;
    } catch (error) {
      return null;
    }
  }

  // 헤더 설정 (모든 인스턴스에 적용)
  setHeaders(headers: Record<string, string>) {
    this.axiosInstances.forEach(instance => {
      Object.assign(instance.defaults.headers, headers);
    });
  }

  // 요청 취소 토큰 생성
  private createCancelToken(requestId: string): CancelTokenSource {
    // 기존 토큰이 있으면 취소
    const existingToken = this.cancelTokens.get(requestId);
    if (existingToken) {
      existingToken.cancel('새로운 요청으로 인해 취소됨');
    }

    const cancelToken = axios.CancelToken.source();
    this.cancelTokens.set(requestId, cancelToken);
    return cancelToken;
  }

  // 요청 취소
  cancelRequest(requestId: string) {
    const cancelToken = this.cancelTokens.get(requestId);
    if (cancelToken) {
      cancelToken.cancel('사용자에 의해 취소됨');
      this.cancelTokens.delete(requestId);
    }
  }

  // 모든 요청 취소
  cancelAllRequests() {
    this.cancelTokens.forEach(cancelToken => {
      cancelToken.cancel('모든 요청이 취소됨');
    });
    this.cancelTokens.clear();
  }

  // 요청 ID 생성
  private generateRequestId(
    endpoint: string,
    params?: Record<string, any>
  ): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return `${endpoint}${paramsStr}`;
  }

  // GET 요청
  async get<T = any>(
    service: string,
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const instance = this.getAxiosInstance(service);
    const requestId = this.generateRequestId(endpoint, params);
    const cancelToken = this.createCancelToken(requestId);

    try {
      const response = await instance.get<T>(endpoint, {
        params,
        cancelToken: cancelToken.token,
        ...config,
      });

      this.cancelTokens.delete(requestId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      this.cancelTokens.delete(requestId);
      return this.handleError(error);
    }
  }

  // POST 요청
  async post<T = any>(
    service: string,
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const instance = this.getAxiosInstance(service);
    const requestId = this.generateRequestId(endpoint, params);
    const cancelToken = this.createCancelToken(requestId);

    try {
      const response = await instance.post<T>(endpoint, data, {
        params,
        cancelToken: cancelToken.token,
        ...config,
      });

      this.cancelTokens.delete(requestId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      this.cancelTokens.delete(requestId);
      return this.handleError(error);
    }
  }

  // PUT 요청
  async put<T = any>(
    service: string,
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const instance = this.getAxiosInstance(service);
    const requestId = this.generateRequestId(endpoint, params);
    const cancelToken = this.createCancelToken(requestId);

    try {
      const response = await instance.put<T>(endpoint, data, {
        params,
        cancelToken: cancelToken.token,
        ...config,
      });

      this.cancelTokens.delete(requestId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      this.cancelTokens.delete(requestId);
      return this.handleError(error);
    }
  }

  // DELETE 요청
  async delete<T = any>(
    service: string,
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const instance = this.getAxiosInstance(service);
    const requestId = this.generateRequestId(endpoint, params);
    const cancelToken = this.createCancelToken(requestId);

    try {
      const response = await instance.delete<T>(endpoint, {
        params,
        cancelToken: cancelToken.token,
        ...config,
      });

      this.cancelTokens.delete(requestId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      this.cancelTokens.delete(requestId);
      return this.handleError(error);
    }
  }

  // PATCH 요청 추가
  async patch<T = any>(
    service: string,
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const instance = this.getAxiosInstance(service);
    const requestId = this.generateRequestId(endpoint, params);
    const cancelToken = this.createCancelToken(requestId);

    try {
      const response = await instance.patch<T>(endpoint, data, {
        params,
        cancelToken: cancelToken.token,
        ...config,
      });

      this.cancelTokens.delete(requestId);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      this.cancelTokens.delete(requestId);
      return this.handleError(error);
    }
  }

  // 에러 처리
  private handleError(error: any): ApiResponse {
    if (isCancel(error)) {
      return {
        success: false,
        error: '요청이 취소되었습니다.',
      };
    }

    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태
      const status = error.response.status;
      const message = error.response.data?.message || `HTTP ${status} 에러`;

      return {
        success: false,
        error: message,
      };
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못함
      return {
        success: false,
        error: '서버에 연결할 수 없습니다.',
      };
    } else {
      // 요청 설정 중 에러
      return {
        success: false,
        error: error.message || '네트워크 오류가 발생했습니다.',
      };
    }
  }
}

// 싱글톤 인스턴스 생성
export const apiClient = new ApiClient();

// 편의 함수들
export const api = {
  get: <T = any>(
    service: string,
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => apiClient.get<T>(service, endpoint, params, config),

  post: <T = any>(
    service: string,
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => apiClient.post<T>(service, endpoint, data, params, config),

  put: <T = any>(
    service: string,
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => apiClient.put<T>(service, endpoint, data, params, config),

  patch: <T = any>(
    service: string,
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => apiClient.patch<T>(service, endpoint, data, params, config),

  delete: <T = any>(
    service: string,
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => apiClient.delete<T>(service, endpoint, params, config),

  setAuthToken: (token: string) => apiClient.setAuthToken(token),
  removeAuthToken: () => apiClient.removeAuthToken(),
  loadAuthToken: () => apiClient.loadAuthToken(),
  getAuthToken: () => apiClient.getAuthToken(),
  setHeaders: (headers: Record<string, string>) =>
    apiClient.setHeaders(headers),
  cancelRequest: (requestId: string) => apiClient.cancelRequest(requestId),
  cancelAllRequests: () => apiClient.cancelAllRequests(),
};

export { API_ENDPOINTS };
