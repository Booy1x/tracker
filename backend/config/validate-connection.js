// Supabase连接验证工具
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function validateSupabaseConnection() {
  console.log('🔍 正在验证Supabase连接...\n');

  // 检查环境变量
  const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ 缺少环境变量:', missingVars.join(', '));
    console.log('\n📋 请确保已设置以下环境变量：');
    console.log('   SUPABASE_URL=https://your-project.supabase.co');
    console.log('   SUPABASE_ANON_KEY=your-anon-key');
    return false;
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // 使用更基础的查询测试连接 - 检查数据库版本
    const { data, error } = await supabase
      .rpc('version');

    if (error) {
      // 尝试另一种方法 - 检查数据库连接
      const { data: testData, error: testError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(1);

      if (testError) {
        if (testError.message.includes('fetch failed')) {
          console.error('❌ 网络连接失败 - 请检查URL和网络设置');
        } else if (testError.message.includes('JWT')) {
          console.warn('⚠️  连接建立但密钥无效 - 请检查ANON_KEY');
        } else if (testError.message.includes('schema') || testError.message.includes('table')) {
          console.warn('⚠️  连接成功但数据库为空，需要初始化表结构');
        } else {
          console.error('❌ 连接错误:', testError.message);
        }
        return false;
      }

      console.log('✅ Supabase连接成功！');
      console.log('🔗 URL:', process.env.SUPABASE_URL);
      console.log('📊 数据库连接正常');
      return true;
    }

    console.log('✅ Supabase连接成功！');
    console.log('🔗 URL:', process.env.SUPABASE_URL);
    console.log('📊 PostgreSQL版本:', data);
    return true;

  } catch (error) {
    console.error('❌ 连接错误:', error.message);
    return false;
  }
}

// 如果直接运行此文件
if (require.main === module) {
  validateSupabaseConnection();
}

module.exports = validateSupabaseConnection;