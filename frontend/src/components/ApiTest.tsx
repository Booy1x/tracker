import React, { useState } from 'react';
import { goodsApi } from '../services/api';
import type { Good } from '../types';

const ApiTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [goods, setGoods] = useState<Good[]>([]);

  const testGetAllGoods = async () => {
    setLoading(true);
    try {
      const data = await goodsApi.getAllGoods();
      setGoods(data);
      setResult(`成功获取 ${data.length} 条物品记录`);
    } catch (error) {
      setResult(`获取失败: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateGood = async () => {
    setLoading(true);
    try {
      const newGood = {
        name: '测试水果',
        category: '水果',
        quantity: 5,
        unit: '个',
        expiry_date: '2024-12-31',
        location: '冰箱',
        notes: 'API测试创建',
      };
      const created = await goodsApi.createGood(newGood);
      setResult(`创建成功: ${created.name} (ID: ${created.id})`);
      await testGetAllGoods(); // 重新获取列表
    } catch (error) {
      setResult(`创建失败: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testSearchGoods = async () => {
    setLoading(true);
    try {
      const results = await goodsApi.searchGoods('测试');
      setGoods(results);
      setResult(`搜索到 ${results.length} 条包含"测试"的物品`);
    } catch (error) {
      setResult(`搜索失败: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>API服务测试组件</h3>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={testGetAllGoods}
          disabled={loading}
          style={{ marginRight: '10px' }}
        >
          获取所有物品
        </button>
        <button
          onClick={testCreateGood}
          disabled={loading}
          style={{ marginRight: '10px' }}
        >
          创建测试物品
        </button>
        <button onClick={testSearchGoods} disabled={loading}>
          搜索测试物品
        </button>
      </div>

      {loading && <p>加载中...</p>}
      {result && (
        <p>
          <strong>结果:</strong> {result}
        </p>
      )}

      {goods.length > 0 && (
        <div>
          <h4>物品列表:</h4>
          <ul>
            {goods.map((good) => (
              <li key={good.id}>
                {good.name} - {good.category} - {good.quantity}
                {good.unit} - {good.location}
                {good.notes && <span> ({good.notes})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
