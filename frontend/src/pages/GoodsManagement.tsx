import { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Button,
  Space,
  Alert,
  message,
  FloatButton,
} from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import GoodList from '../components/GoodList';
import AddGoodForm from '../components/AddGoodForm';
import { goodsApi } from '../services/api';
import type { Good as ApiGood } from '../types/api.types';
import type { Good, CreateGoodRequest } from '../types/good';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function GoodsManagement() {
  const [goods, setGoods] = useState<Good[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // 转换API数据到本地类型
  const convertApiGoodToLocal = (apiGood: ApiGood): Good => {
    const daysRemaining = Math.ceil(
      (new Date(apiGood.expiry_date).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return {
      id: apiGood.id!.toString(),
      name: apiGood.name,
      purchaseDate:
        apiGood.purchase_date || new Date().toISOString().split('T')[0],
      expiryDate: apiGood.expiry_date,
      quantity: apiGood.quantity,
      unit: apiGood.unit,
      notes: apiGood.notes,
      category: apiGood.category,
      location: apiGood.location,
      createdAt: apiGood.created_at || new Date().toISOString(),
      updatedAt: apiGood.updated_at || new Date().toISOString(),
      daysRemaining: Math.max(daysRemaining, 0),
      status:
        daysRemaining <= 0
          ? 'expired'
          : daysRemaining <= 3
            ? 'expiring_soon'
            : daysRemaining <= 7
              ? 'expiring_week'
              : 'fresh',
    };
  };

  // 加载物品列表
  const loadGoods = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiGoods = await goodsApi.getAllGoods();
      const localGoods = apiGoods.map(convertApiGoodToLocal);
      setGoods(localGoods);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载物品失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理添加新物品
  const handleAddGood = async (newGoodData: CreateGoodRequest) => {
    try {
      const newApiGood = await goodsApi.createGood({
        name: newGoodData.name,
        category: newGoodData.category || '其他',
        quantity: newGoodData.quantity,
        unit: newGoodData.unit,
        purchase_date: newGoodData.purchaseDate,
        expiry_date: newGoodData.expiryDate,
        location: newGoodData.location || '默认位置',
        notes: newGoodData.notes,
      });

      const newLocalGood = convertApiGoodToLocal(newApiGood);
      setGoods((prevGoods) => [newLocalGood, ...prevGoods]);
      setShowAddForm(false);
      setError(null);
      message.success('物品添加成功！');
    } catch (err) {
      setError(err instanceof Error ? err.message : '添加物品失败');
      throw err;
    }
  };

  // 处理删除物品
  const handleDeleteGood = async (id: string) => {
    try {
      await goodsApi.deleteGood(id);
      setGoods((prevGoods) => prevGoods.filter((good) => good.id !== id));
      setError(null);
      message.success('物品删除成功！');
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除物品失败');
    }
  };

  // 初始加载
  useEffect(() => {
    loadGoods();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#FFFDF7' }}>
      <Header
        style={{
          backgroundColor: '#FFFDF7',
          padding: '16px 24px',
          borderBottom: '1px solid #f0f0f0',
          height: 'auto',
          lineHeight: 'normal',
        }}
      >
        <div
          style={{
            maxWidth: '100%',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div>
            <Title
              level={1}
              style={{
                margin: 0,
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: 'bold',
                color: '#333333',
                lineHeight: 1.2,
              }}
            >
              保鲜鲜
            </Title>
            <Text
              type="secondary"
              style={{ fontSize: 'clamp(14px, 2vw, 16px)' }}
            >
              智能保质期管理，让新鲜更持久
            </Text>
          </div>
          <Space wrap>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={loadGoods}
              loading={loading}
            >
              刷新
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowAddForm(true)}
              size="large"
              style={{ borderRadius: 24 }}
            >
              添加物品
            </Button>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '16px' }}>
        <div
          style={{
            maxWidth: '100%',
            margin: '0 auto',
            padding: '0 8px',
          }}
        >
          {error && (
            <Alert
              message="操作失败"
              description={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 24 }}
              action={
                <Button size="small" onClick={loadGoods}>
                  重试
                </Button>
              }
            />
          )}

          {showAddForm ? (
            <div
              style={{
                maxWidth: '100%',
                margin: '0 auto',
                padding: '0 8px',
              }}
            >
              <Title
                level={2}
                style={{
                  marginBottom: 24,
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  textAlign: 'center',
                }}
              >
                添加新物品
              </Title>
              <AddGoodForm
                onSubmit={handleAddGood}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          ) : (
            <div>
              <Title
                level={2}
                style={{
                  marginBottom: 24,
                  textAlign: 'center',
                  fontSize: 'clamp(20px, 3vw, 28px)',
                }}
              >
                我的物品 ({goods.length})
              </Title>
              <GoodList
                goods={goods}
                loading={loading}
                onDelete={handleDeleteGood}
              />
            </div>
          )}
        </div>
      </Content>

      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => setShowAddForm(true)}
        tooltip="添加物品"
      />
    </Layout>
  );
}
