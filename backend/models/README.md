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
│   ├── schema.sql           # 数据库表结构
│   └── db.js               # 数据库连接
└── scripts/
    └── init-db.js          # 数据库初始化脚本

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
| quantity | DECIMAL(10,2) | 数量 |
| unit | VARCHAR(50) | 单位 |
| notes | TEXT | 备注 |
| image_url | TEXT | 图片URL |
| category | VARCHAR(100) | 分类 |
| user_id | UUID | 用户ID，外键 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### goods_status视图

提供额外的计算字段：
- `days_remaining`: 剩余天数
- `status`: 物品状态（fresh/expiring_week/expiring_soon/expired）

## 使用方法

### 1. 初始化数据库

```bash
# 运行数据库初始化脚本
node scripts/init-db.js

# 或手动在Supabase控制台执行SQL
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
  const savedGood = await goodService.createGood(newGood.toDatabaseObject(), userId);
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

### 3. 服务层API

#### 获取物品列表
```javascript
const goods = await goodService.getAllGoods(userId, {
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
  quantity: 5,
  unit: '个'
}, userId);
```

#### 获取统计信息
```javascript
const stats = await goodService.getGoodStats(userId);
// 返回：{ total: 10, expired: 2, expiringSoon: 1, ... }
```

## 物品状态说明

- **fresh**: 新鲜（剩余7天以上）
- **expiring_week**: 一周内过期（3-7天）
- **expiring_soon**: 即将过期（1-3天）
- **expired**: 已过期（0天或负数）

## 常用单位

建议使用的单位：
- 食品：个、盒、包、袋、瓶、罐、条、块
- 重量：斤、公斤、克
- 容量：升、毫升

## 分类建议

常用分类：
- 食品
- 饮料
- 日用品
- 化妆品
- 药品
- 其他

## 注意事项

1. **数据验证**：所有数据在保存前都会进行验证
2. **用户隔离**：每个用户只能看到自己的物品
3. **自动更新**：updated_at字段会自动更新
4. **权限控制**：使用Supabase的行级安全策略
5. **索引优化**：已创建常用查询的索引

## 下一步

完成数据模型创建后，您可以：
1. 运行数据库初始化脚本
2. 配置Supabase连接参数
3. 开始实现物品列表API
4. 创建前端物品管理界面