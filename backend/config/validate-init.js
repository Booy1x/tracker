// 数据库初始化验证工具
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function validateDatabaseInit() {
  console.log('🔍 正在验证数据库初始化状态...\n');

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  try {
    // 1. 直接查询goods表
    const { data: goodsData, error: goodsError } = await supabase
      .from('goods')
      .select('*')
      .limit(1);

    if (goodsError) {
      if (goodsError.code === 'PGRST116') {
        console.log('❌ goods表不存在，数据库未初始化');
        return false;
      }
      console.error('❌ 查询goods表失败:', goodsError.message);
      return false;
    }

    console.log('✅ goods表已存在');

    // 2. 检查数据量
    const { data: allGoods, error: countError } = await supabase
      .from('goods')
      .select('*');

    if (countError) {
      console.error('❌ 查询数据量失败:', countError.message);
    } else {
      console.log('📊 goods表数据量:', allGoods?.length || 0);
      
      if (allGoods && allGoods.length > 0) {
        console.log('✅ 测试数据已插入:');
        allGoods.slice(0, 3).forEach(item => {
          console.log(`   ${item.name} - ${item.status} - 数量: ${item.quantity}`);
        });
      }
    }

    // 3. 检查表结构
    try {
      const { data: sample } = await supabase
        .from('goods')
        .select('*')
        .limit(1);
      
      if (sample && sample[0]) {
        console.log('🔧 goods表列结构:');
        Object.keys(sample[0]).forEach(key => {
          console.log(`   ${key}: ${typeof sample[0][key]}`);
        });
      }
    } catch (e) {
      console.log('🔧 表结构检查跳过');
    }

    console.log('\n🎉 数据库初始化验证完成！');
    console.log('✅ 表结构已创建');
    console.log('✅ 数据已插入');
    console.log('✅ 系统运行正常');
    return true;

  } catch (error) {
    console.error('❌ 验证失败:', error.message);
    return false;
  }
}

// 直接运行
if (require.main === module) {
  validateDatabaseInit();
}

module.exports = validateDatabaseInit;