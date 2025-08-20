import { useState, useEffect, useCallback } from 'react';
import { goodsApi, type Good } from '../services/api';

// 物品管理Hook
export const useGoods = () => {
  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取所有物品
  const fetchGoods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await goodsApi.getAllGoods();
      setGoods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取物品失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 添加新物品
  const addGood = useCallback(async (newGood: Omit<Good, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const createdGood = await goodsApi.createGood(newGood);
      setGoods(prev => [...prev, createdGood]);
      return createdGood;
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加物品失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新物品
  const updateGood = useCallback(async (id: number, updates: Partial<Omit<Good, 'id' | 'created_at' | 'updated_at'>>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedGood = await goodsApi.updateGood(id, updates);
      setGoods(prev => prev.map(good => good.id === id ? updatedGood : good));
      return updatedGood;
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新物品失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 删除物品
  const deleteGood = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await goodsApi.deleteGood(id);
      setGoods(prev => prev.filter(good => good.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除物品失败');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 搜索物品
  const searchGoods = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await goodsApi.searchGoods(query);
      setGoods(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : '搜索物品失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 按分类筛选
  const filterByCategory = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await goodsApi.getGoodsByCategory(category);
      setGoods(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : '筛选物品失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化加载
  useEffect(() => {
    fetchGoods();
  }, [fetchGoods]);

  return {
    goods,
    loading,
    error,
    fetchGoods,
    addGood,
    updateGood,
    deleteGood,
    searchGoods,
    filterByCategory,
  };
};

// 单个物品管理Hook
export const useGood = (id: number) => {
  const [good, setGood] = useState<Good | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGood = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await goodsApi.getGoodById(id);
      setGood(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取物品详情失败');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchGood();
    }
  }, [id, fetchGood]);

  return {
    good,
    loading,
    error,
    refetch: fetchGood,
  };
};