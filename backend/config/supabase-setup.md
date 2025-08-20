# Supabase 设置指南

## 步骤1: 创建Supabase项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project" 或登录您的账户
3. 创建新项目：
   - 项目名称: `tracker-expiry-system`
   - 数据库密码: 设置一个强密码
   - 地区: 选择最近的地区（推荐 `East US` 或 `Southeast Asia`）

## 步骤2: 获取连接参数

创建项目后，在Supabase仪表板中找到：

1. **项目URL**:
   - 设置 → API → Project URL
   - 格式: `https://[your-project-ref].supabase.co`

2. **匿名密钥 (anon key)**:
   - 设置 → API → anon public

3. **服务角色密钥 (service role)**:
   - 设置 → API → service_role (保密)

## 步骤3: 配置本地环境

将 `.env.example` 复制为 `.env` 并填入实际值：

```bash
# 复制环境文件
cp .env.example .env

# 编辑 .env 文件
SUPABASE_URL=https://[your-project-ref].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

## 步骤4: 验证连接

运行以下命令测试连接：

```bash
# 启动后端服务器
npm run dev

# 测试API
curl http://localhost:3001/api/health
```

## 数据库表结构预览

后续将创建以下表：
- `users` - 用户表
- `goods` - 物品表
- `reminders` - 提醒表

## 需要帮助？

如果您需要我帮您创建示例数据或配置数据库表，请告诉我！