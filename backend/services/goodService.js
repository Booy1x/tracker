// 物品服务层
const supabase = require('../config/db');
const Good = require('../models/Good');

class GoodService {
  // 获取用户的所有物品
  async getAllGoods(userId, filters = {}) {
    try {
      let query = supabase
        .from('goods')
        .select('*')
        .eq('user_id', userId)
        .order('expiry_date', { ascending: true });

      // 应用过滤器
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data.map(item => Good.fromDatabaseObject(item).toApiResponse());
    } catch (error) {
      throw new Error(`获取物品列表失败: ${error.message}`);
    }
  }

  // 根据ID获取单个物品
  async getGoodById(id, userId) {
    try {
      const { data, error } = await supabase
        .from('goods')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('物品不存在');
      }

      return Good.fromDatabaseObject(data).toApiResponse();
    } catch (error) {
      throw new Error(`获取物品失败: ${error.message}`);
    }
  }

  // 创建新物品
  async createGood(goodData, userId) {
    try {
      const good = new Good({
        ...goodData,
        userId
      });

      // 验证数据
      const validation = good.validate();
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const { data, error } = await supabase
        .from('goods')
        .insert(good.toDatabaseObject())
        .select()
        .single();

      if (error) {
        throw error;
      }

      return Good.fromDatabaseObject(data).toApiResponse();
    } catch (error) {
      throw new Error(`创建物品失败: ${error.message}`);
    }
  }

  // 更新物品
  async updateGood(id, goodData, userId) {
    try {
      // 先检查物品是否存在且属于用户
      const existingGood = await this.getGoodById(id, userId);
      if (!existingGood) {
        throw new Error('物品不存在');
      }

      const updateData = { ...goodData };
      delete updateData.id;
      delete updateData.user_id;
      delete updateData.created_at;
      delete updateData.updated_at;

      const { data, error } = await supabase
        .from('goods')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return Good.fromDatabaseObject(data).toApiResponse();
    } catch (error) {
      throw new Error(`更新物品失败: ${error.message}`);
    }
  }

  // 删除物品
  async deleteGood(id, userId) {
    try {
      const { error } = await supabase
        .from('goods')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      throw new Error(`删除物品失败: ${error.message}`);
    }
  }

  // 获取物品统计信息
  async getGoodStats(userId) {
    try {
      const { data, error } = await supabase
        .from('goods')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      const goods = data.map(item => Good.fromDatabaseObject(item));
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const stats = {
        total: goods.length,
        expired: goods.filter(g => g.getDaysRemaining() === 0).length,
        expiringSoon: goods.filter(g => {
          const days = g.getDaysRemaining();
          return days > 0 && days <= 3;
        }).length,
        expiringWeek: goods.filter(g => {
          const days = g.getDaysRemaining();
          return days > 3 && days <= 7;
        }).length,
        fresh: goods.filter(g => g.getDaysRemaining() > 7).length
      };

      return stats;
    } catch (error) {
      throw new Error(`获取统计信息失败: ${error.message}`);
    }
  }

  // 获取即将过期的物品
  async getExpiringGoods(userId, days = 7) {
    try {
      const { data, error } = await supabase
        .from('goods')
        .select('*')
        .eq('user_id', userId)
        .gte('expiry_date', new Date().toISOString().split('T')[0])
        .lte('expiry_date', new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('expiry_date', { ascending: true });

      if (error) {
        throw error;
      }

      return data.map(item => Good.fromDatabaseObject(item).toApiResponse());
    } catch (error) {
      throw new Error(`获取即将过期物品失败: ${error.message}`);
    }
  }
}

module.exports = new GoodService();