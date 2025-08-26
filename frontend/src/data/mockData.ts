import type { Good } from '../types/good';

// 模拟物品数据
export const mockGoods: Good[] = [
  {
    id: '1',
    name: '苹果',
    purchaseDate: '2024-01-15',
    expiryDate: '2024-01-25',
    category: '水果',
    notes: '红富士苹果，新鲜采摘',
    imageUrl: '',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    daysRemaining: 10,
    status: 'fresh'
  },
  {
    id: '2',
    name: '牛奶',
    purchaseDate: '2024-01-10',
    expiryDate: '2024-01-20',
    category: '饮料',
    notes: '全脂牛奶，低温保存',
    imageUrl: '',
    createdAt: '2024-01-10T08:30:00Z',
    updatedAt: '2024-01-10T08:30:00Z',
    daysRemaining: 5,
    status: 'expiring_week'
  },
  {
    id: '3',
    name: '面包',
    purchaseDate: '2024-01-12',
    expiryDate: '2024-01-18',
    category: '主食',
    notes: '全麦面包，无添加剂',
    imageUrl: '',
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
    daysRemaining: 3,
    status: 'expiring_soon'
  },
  {
    id: '4',
    name: '酸奶',
    purchaseDate: '2024-01-05',
    expiryDate: '2024-01-15',
    category: '乳制品',
    notes: '原味酸奶',
    imageUrl: '',
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
    daysRemaining: 0,
    status: 'expired'
  },
  {
    id: '5',
    name: '鸡蛋',
    purchaseDate: '2024-01-08',
    expiryDate: '2024-02-08',
    category: '食品',
    notes: '土鸡蛋',
    imageUrl: '',
    createdAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-08T16:45:00Z',
    daysRemaining: 24,
    status: 'fresh'
  }
];