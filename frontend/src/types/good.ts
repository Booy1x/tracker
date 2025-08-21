// 物品数据类型定义

export interface Good {
  id: string;
  name: string;
  purchaseDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  quantity: number;
  unit: string;
  notes?: string;
  imageUrl?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  daysRemaining: number;
  status: 'fresh' | 'expiring_week' | 'expiring_soon' | 'expired';
}

export interface CreateGoodRequest {
  name: string;
  purchaseDate: string;
  expiryDate: string;
  quantity: number;
  unit: string;
  notes?: string;
  imageUrl?: string;
  category?: string;
}

export interface UpdateGoodRequest {
  name?: string;
  purchaseDate?: string;
  expiryDate?: string;
  quantity?: number;
  unit?: string;
  notes?: string;
  imageUrl?: string;
  category?: string;
}

export interface GoodFormData {
  name: string;
  purchaseDate: string;
  expiryDate: string;
  quantity: string;
  unit: string;
  notes: string;
  imageUrl: string;
  category: string;
}

export interface GoodFilters {
  status?: 'all' | 'fresh' | 'expiring_week' | 'expiring_soon' | 'expired';
  category?: string;
  search?: string;
}

export interface GoodsResponse {
  data: Good[];
  total: number;
  page: number;
  perPage: number;
}

// 物品状态配置
export const GOOD_STATUS_CONFIG = {
  fresh: {
    label: '新鲜',
    color: '#52c41a',
    bgColor: '#f6ffed',
    icon: '🟢'
  },
  expiring_week: {
    label: '一周内过期',
    color: '#faad14',
    bgColor: '#fffbe6',
    icon: '🟡'
  },
  expiring_soon: {
    label: '即将过期',
    color: '#ff4d4f',
    bgColor: '#fff2f0',
    icon: '🔴'
  },
  expired: {
    label: '已过期',
    color: '#8c8c8c',
    bgColor: '#f5f5f5',
    icon: '⚫'
  }
} as const;

// 常用单位列表
export const COMMON_UNITS = [
  '个', '件', '盒', '包', '袋', '瓶', '罐', '条', '块', '斤', '公斤', '克', '升', '毫升'
];

// 常用分类
export const COMMON_CATEGORIES = [
  '蔬菜', '水果', '肉类', '乳制品', '谷物', '罐头', '冷冻食品', '饮料', '零食', '其他'
];

// 表单验证规则
export const GOOD_VALIDATION_RULES = {
  name: {
    required: '物品名称不能为空',
    maxLength: { value: 255, message: '物品名称不能超过255个字符' }
  },
  purchaseDate: {
    required: '购买日期不能为空',
    validate: (value: string) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) return '购买日期格式无效';
      return true;
    }
  },
  expiryDate: {
    required: '过期日期不能为空',
    validate: (value: string, formData: GoodFormData) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) return '过期日期格式无效';
      
      const purchaseDate = new Date(formData.purchaseDate);
      if (date <= purchaseDate) return '过期日期必须晚于购买日期';
      
      return true;
    }
  },
  quantity: {
    required: '数量不能为空',
    min: { value: 0.01, message: '数量必须大于0' },
    max: { value: 10000, message: '数量不能超过10000' }
  },
  unit: {
    required: '单位不能为空',
    maxLength: { value: 50, message: '单位不能超过50个字符' }
  },
  notes: {
    maxLength: { value: 1000, message: '备注不能超过1000个字符' }
  },
  imageUrl: {
    maxLength: { value: 1000, message: '图片URL不能超过1000个字符' }
  },
  category: {
    maxLength: { value: 100, message: '分类不能超过100个字符' }
  }
};

// 工具函数：计算剩余天数
export const calculateDaysRemaining = (expiryDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(diffDays, 0);
};

// 工具函数：获取物品状态
export const getGoodStatus = (expiryDate: string): Good['status'] => {
  const daysRemaining = calculateDaysRemaining(expiryDate);
  
  if (daysRemaining === 0) {
    return 'expired';
  } else if (daysRemaining <= 3) {
    return 'expiring_soon';
  } else if (daysRemaining <= 7) {
    return 'expiring_week';
  } else {
    return 'fresh';
  }
};

// 工具函数：格式化日期显示
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 工具函数：格式化剩余天数显示
export const formatDaysRemaining = (days: number): string => {
  if (days === 0) {
    return '已过期';
  } else if (days === 1) {
    return '明天过期';
  } else {
    return `还有${days}天`;
  }
};