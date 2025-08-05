import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  isCancel,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, API_ENDPOINTS, ApiResponse, ApiError } from './api';

// API 클라이언트 클래스
class ApiClient {
  private axiosInstance: AxiosInstance;
  private cancelTokens: Map<string, CancelTokenSource> = new Map();

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: API_CONFIG.HEADERS,
      timeout: 10000, // 10초 타임아웃
    });

    this.setupInterceptors();
  }

  // 인터셉터 설정
  private setupInterceptors() {
    // 요청 인터셉터
    this.axiosInstance.interceptors.request.use(
      config => {
        // 요청 로깅 (개발 환경에서만)
        if (__DEV__) {
          console.log(
            '🚀 API Request:',
            config.method?.toUpperCase(),
            config.url
          );
          console.log('📤 요청 헤더:', config.headers);
          console.log('📤 요청 데이터:', config.data);
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.axiosInstance.interceptors.response.use(
      response => {
        // 응답 로깅 (개발 환경에서만)
        if (__DEV__) {
          console.log('✅ API Response:', response.status, response.config.url);
          console.log('📡 응답 헤더:', response.headers);
          console.log('📡 응답 데이터:', response.data);
        }
        return response;
      },
      error => {
        // 에러 로깅 (개발 환경에서만)
        if (__DEV__) {
          console.log(
            '❌ API Error:',
            error.response?.status,
            error.config?.url
          );
          console.log('❌ 에러 응답:', error.response?.data);
          console.log('❌ 에러 메시지:', error.message);
          console.log('❌ 요청 URL:', error.config?.url);
          console.log('❌ 요청 메서드:', error.config?.method);
          console.log('❌ 요청 데이터:', error.config?.data);
        }

        // 401 에러 처리 (토큰 만료)
        if (error.response?.status === 401) {
          // 토큰 갱신 로직을 여기에 추가할 수 있습니다
          this.removeAuthToken();
        }

        return Promise.reject(error);
      }
    );
  }

  // 토큰 설정
  async setAuthToken(token: string) {
    // 헤더에 토큰 설정
    this.axiosInstance.defaults.headers.common['Authorization'] =
      `Bearer ${token}`;

    // AsyncStorage에 토큰 저장
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('❌ 토큰 저장 실패:', error);
    }
  }

  // 토큰 제거
  async removeAuthToken() {
    // 헤더에서 토큰 제거
    delete this.axiosInstance.defaults.headers.common['Authorization'];

    // AsyncStorage에서 토큰 제거
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('❌ 토큰 제거 실패:', error);
    }
  }

  // 저장된 토큰 불러오기
  async loadAuthToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem('auth_token');

      if (token) {
        // 헤더에 토큰 설정
        this.axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${token}`;
        return token;
      }
      return null;
    } catch (error) {
      console.error('❌ 토큰 불러오기 실패:', error);
      return null;
    }
  }

  // 헤더 설정
  setHeaders(headers: Record<string, string>) {
    this.axiosInstance.defaults.headers.common = {
      ...this.axiosInstance.defaults.headers.common,
      ...headers,
    };
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
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId(endpoint, params);
    const cancelToken = this.createCancelToken(requestId);

    try {
      const response = await this.axiosInstance.get<T>(endpoint, {
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
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId(endpoint, params);
    const cancelToken = this.createCancelToken(requestId);

    try {
      const response = await this.axiosInstance.post<T>(endpoint, data, {
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
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId(endpoint, params);
    const cancelToken = this.createCancelToken(requestId);

    try {
      const response = await this.axiosInstance.put<T>(endpoint, data, {
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
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId(endpoint, params);
    const cancelToken = this.createCancelToken(requestId);

    try {
      const response = await this.axiosInstance.delete<T>(endpoint, {
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
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId(endpoint, params);
    const cancelToken = this.createCancelToken(requestId);

    try {
      const response = await this.axiosInstance.patch<T>(endpoint, data, {
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
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => apiClient.get<T>(endpoint, params, config),

  post: <T = any>(
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => apiClient.post<T>(endpoint, data, params, config),

  put: <T = any>(
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => apiClient.put<T>(endpoint, data, params, config),

  patch: <T = any>(
    endpoint: string,
    data?: any,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => apiClient.patch<T>(endpoint, data, params, config),

  delete: <T = any>(
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ) => apiClient.delete<T>(endpoint, params, config),

  setAuthToken: (token: string) => apiClient.setAuthToken(token),
  removeAuthToken: () => apiClient.removeAuthToken(),
  loadAuthToken: () => apiClient.loadAuthToken(),
  setHeaders: (headers: Record<string, string>) =>
    apiClient.setHeaders(headers),
  cancelRequest: (requestId: string) => apiClient.cancelRequest(requestId),
  cancelAllRequests: () => apiClient.cancelAllRequests(),
};

export { API_ENDPOINTS };
