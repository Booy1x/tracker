-- 物品追踪器数据库初始化脚本
-- 在Supabase SQL Editor中执行以下语句

-- 1. 确保pgcrypto扩展已启用（用于UUID生成）
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. 创建物品表
CREATE TABLE IF NOT EXISTS goods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  purchase_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  notes TEXT,
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_dates CHECK (expiry_date >= purchase_date)
);

-- 3. 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.updated_at IS NOT DISTINCT FROM OLD.updated_at THEN
    NEW.updated_at := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. 删除已存在的触发器（避免重复）
DROP TRIGGER IF EXISTS update_goods_updated_at ON goods;

-- 5. 创建更新时间触发器
CREATE TRIGGER update_goods_updated_at
  BEFORE UPDATE ON goods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. 创建优化索引
CREATE INDEX IF NOT EXISTS idx_goods_user_id ON goods(user_id);
CREATE INDEX IF NOT EXISTS idx_goods_expiry_date ON goods(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_goods_created_at ON goods(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_goods_category ON goods(category) WHERE category IS NOT NULL;

-- 7. 启用行级安全
ALTER TABLE goods ENABLE ROW LEVEL SECURITY;

-- 8. 创建行级安全策略（使用标准命名）
DROP POLICY IF EXISTS "用户只能访问自己的物品" ON goods;
CREATE POLICY user_isolation_policy ON goods
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 9. 创建物品状态视图（使用标准命名和性能优化）
CREATE OR REPLACE VIEW goods_status AS
SELECT 
  id,
  name,
  purchase_date,
  expiry_date,
  notes,
  image_url,
  category,
  created_at,
  updated_at,
  user_id,
  GREATEST(expiry_date - CURRENT_DATE, 0) as days_remaining,
  CASE 
    WHEN expiry_date < CURRENT_DATE THEN 'expired'
    WHEN expiry_date <= CURRENT_DATE + INTERVAL '3 days' THEN 'expiring_soon'
    WHEN expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'expiring_week'
    ELSE 'fresh'
  END as status
FROM goods
WHERE user_id = auth.uid();

-- 10. 创建物化视图（可选，用于性能优化）
-- CREATE MATERIALIZED VIEW IF NOT EXISTS goods_status_mv AS
-- SELECT * FROM goods_status;

-- 11. 插入测试数据（使用事务和验证）
BEGIN;
INSERT INTO goods (name, purchase_date, expiry_date, category, notes, user_id) VALUES
('苹果', '2024-01-15', '2024-01-25', '水果', '红富士苹果', auth.uid()),
('牛奶', '2024-01-10', '2024-01-20', '饮料', '全脂牛奶', auth.uid()),
('面包', '2024-01-12', '2024-01-18', '主食', '全麦面包', auth.uid())
ON CONFLICT DO NOTHING;
COMMIT;

-- 12. 验证表创建成功
DO $$
BEGIN
  RAISE NOTICE '✅ 表结构创建成功';
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'goods') THEN
    RAISE NOTICE '✅ goods表已创建';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.views WHERE view_name = 'goods_status') THEN
    RAISE NOTICE '✅ goods_status视图已创建';
  END IF;
END $$;

-- 13. 快速验证查询
-- SELECT COUNT(*) as total_goods FROM goods;
-- SELECT status, COUNT(*) as count FROM goods_status GROUP BY status;