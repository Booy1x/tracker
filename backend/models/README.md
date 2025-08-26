# 物品数据模型使用指南

## 概述

本指南介绍如何在智能物品保质期管理系统中使用物品数据模型。

## 文件结构

```
backend/
├── models/
│   └── Good.js              # 物品数据模型类
├── services/
│   └── goodService.js       # 物品服务层
├── config/
│   ├── db.js               # 数据库连接
│   └── manual-init.sql     # 数据库初始化SQL
└── scripts/
    └── manual-init.js      # 数据库初始化脚本

frontend/
└── src/
    └── types/
        └── good.ts         # TypeScript类型定义
```

## 数据库表结构

### goods表

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | UUID | 主键，自动生成 |
| name | VARCHAR(255) | 物品名称 |
| purchase_date | DATE | 购买日期 |
| expiry_date | DATE | 过期日期 |
| notes | TEXT | 备注 |
| image_url | TEXT | 图片URL |
| category | VARCHAR(100) | 分类 |
| user_id | UUID | 用户ID，外键 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 使用方法

### 1. 初始化数据库

```bash
# 运行数据库初始化脚本
node scripts/manual-init.js

# 或手动执行SQL
psql -f config/manual-init.sql
```

### 2. 使用物品模型

#### 后端（Node.js）

```javascript
const Good = require('./models/Good');
const goodService = require('./services/goodService');

// 创建新物品
const newGood = new Good({
  name: '牛奶',
  purchaseDate: '2024-01-15',
  expiryDate: '2024-01-25',
  quantity: 2,
  unit: '盒',
  category: '食品',
  userId: 'user-uuid'
});

// 验证数据
const validation = newGood.validate();
if (validation.isValid) {
  // 保存到数据库
  const savedGood = await goodService.createGood(newGood.toDatabaseObject());
}

// 获取物品状态
const daysRemaining = newGood.getDaysRemaining(); // 10
const status = newGood.getStatus(); // 'fresh'
```

#### 前端（TypeScript）

```typescript
import { Good, CreateGoodRequest, calculateDaysRemaining } from './types/good';

// 定义物品数据
const good: Good = {
  id: '123',
  name: '牛奶',
  purchaseDate: '2024-01-15',
  expiryDate: '2024-01-25',
  quantity: 2,
  unit: '盒',
  daysRemaining: 10,
  status: 'fresh'
};

// 计算剩余天数
const days = calculateDaysRemaining('2024-01-25');

// 创建物品请求
const createRequest: CreateGoodRequest = {
  name: '牛奶',
  purchaseDate: '2024-01-15',
  expiryDate: '2024-01-25',
  quantity: 2,
  unit: '盒'
};
```

### 3. 物品状态系统

#### 状态定义
- **fresh**: 新鲜（剩余7天以上）
- **expiring_week**: 一周内过期（3-7天）
- **expiring_soon**: 即将过期（1-3天）
- **expired**: 已过期（0天或负数）

#### 状态配置（前端）
```typescript
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
};
```

### 4. 服务层API

#### 获取物品列表
```javascript
const goods = await goodService.getAllGoods({
  category: '食品',
  search: '牛奶'
});
```

#### 创建物品
```javascript
const newGood = await goodService.createGood({
  name: '苹果',
  purchaseDate: '2024-01-20',
  expiryDate: '2024-01-30',
  category: '水果'
});
```

#### 获取统计信息
```javascript
const stats = await goodService.getGoodStats();
// 返回：{ total: 10, expired: 2, expiringSoon: 1, ... }
```

### 5. 前端验证规则

```typescript
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
    validate: (value: string, formData: any) => {
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
  }
};
```

## 常用单位和分类

### 建议单位
- 食品：个、盒、包、袋、瓶、罐、条、块
- 重量：斤、公斤、克
- 容量：升、毫升

### 建议分类
- 蔬菜、水果、肉类、乳制品
- 谷物、罐头、冷冻食品
- 饮料、零食、其他

## 注意事项

1. **数据验证**：所有数据在保存前都会进行验证
2. **自动计算**：daysRemaining和status字段由系统自动计算
3. **日期格式**：统一使用YYYY-MM-DD格式
4. **单位规范**：建议使用标准单位便于统计
5. **图片URL**：支持外部图片链接
6. **用户隔离**：每个用户只能看到自己的物品

## 下一步

完成数据模型创建后，您可以：
1. 运行数据库初始化脚本
2. 配置数据库连接参数
3. 测试物品CRUD API
4. 创建前端物品管理界面
5. 实现物品状态颜色编码功能