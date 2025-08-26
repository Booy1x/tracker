// API响应类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 物品类型定义
export interface Good {
  id?: number;
  name: string;
  category: string;
  purchase_date: string;
  expiry_date: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
}

// 物品分类常量和类型
export const GoodCategory = {
  VEGETABLES: '蔬菜',
  FRUITS: '水果',
  MEAT: '肉类',
  DAIRY: '乳制品',
  GRAINS: '谷物',
  CANNED: '罐头',
  FROZEN: '冷冻食品',
  BEVERAGES: '饮料',
  SNACKS: '零食',
  OTHER: '其他',
} as const;

export type GoodCategory = (typeof GoodCategory)[keyof typeof GoodCategory];

// API错误类型
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// 搜索参数类型
export interface SearchParams {
  q?: string;
  category?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}
