import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

// API基础配置
const API_BASE_URL = 'http://localhost:3001/api';

// 创建Axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      // 服务器响应错误
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // 请求未收到响应
      console.error('Network Error:', error.message);
    } else {
      // 请求配置错误
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API响应类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 物品相关类型定义
export interface Good {
  id?: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchase_date: string;
  expiry_date: string;
  location: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// 物品API服务
export const goodsApi = {
  // 获取所有物品
  getAllGoods: async (): Promise<Good[]> => {
    const response = await apiClient.get<ApiResponse<Good[]>>('/goods');
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || '获取物品列表失败');
  },

  // 获取单个物品
  getGoodById: async (id: string): Promise<Good> => {
    const response = await apiClient.get<ApiResponse<Good>>(`/goods/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || '获取物品详情失败');
  },

  // 创建新物品
  createGood: async (good: Omit<Good, 'id' | 'created_at' | 'updated_at'>): Promise<Good> => {
    const response = await apiClient.post<ApiResponse<Good>>('/goods', good);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || '创建物品失败');
  },

  // 更新物品
  updateGood: async (id: string, good: Partial<Omit<Good, 'id' | 'created_at' | 'updated_at'>>): Promise<Good> => {
    const response = await apiClient.put<ApiResponse<Good>>(`/goods/${id}`, good);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || '更新物品失败');
  },

  // 删除物品
  deleteGood: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse>(`/goods/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || '删除物品失败');
    }
  },

  // 按分类筛选物品
  getGoodsByCategory: async (category: string): Promise<Good[]> => {
    const response = await apiClient.get<ApiResponse<Good[]>>(`/goods/category/${category}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || '获取分类物品失败');
  },

  // 搜索物品
  searchGoods: async (query: string): Promise<Good[]> => {
    const response = await apiClient.get<ApiResponse<Good[]>>(`/goods/search?q=${encodeURIComponent(query)}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || '搜索物品失败');
  },
};

// 导出axios实例以供其他用途
export { apiClient };

// 默认导出
export default {
  goods: goodsApi,
};