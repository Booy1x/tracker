import React from 'react';
import { Card, Empty, Spin, Tag, Typography, Button, Space } from 'antd';
import {
  DeleteOutlined,
  ShoppingOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { Good } from '../types/good';
import {
  GOOD_STATUS_CONFIG,
  formatDate,
  formatDaysRemaining,
} from '../types/good';

const { Title, Text, Paragraph } = Typography;

interface GoodListProps {
  goods: Good[];
  loading?: boolean;
  onDelete?: (id: string) => void;
}

const GoodList: React.FC<GoodListProps> = ({ goods, loading, onDelete }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 16px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (goods.length === 0) {
    return (
      <Empty
        image={<ShoppingOutlined style={{ fontSize: 64, color: '#8EC560' }} />}
        description={
          <div>
            <Title level={4} style={{ color: '#333', marginBottom: 8 }}>
              暂无物品
            </Title>
            <Text type="secondary">添加第一个物品，开始管理您的食品保鲜</Text>
          </div>
        }
        style={{ padding: '40px 16px' }}
      />
    );
  }

  return (
    <div style={{ padding: '8px', width: '100%', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {goods.map((good) => {
          const statusConfig = GOOD_STATUS_CONFIG[good.status];

          return (
            <Card
              key={good.id}
              hoverable
              styles={{
                body: { padding: '16px' },
              }}
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                marginBottom: 16,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 2px 8px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1, minWidth: 150 }}>
                  <Title
                    level={3}
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: 'clamp(16px, 3vw, 20px)',
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {good.name}
                  </Title>

                  <Space
                    size="small"
                    style={{ marginBottom: 8, flexWrap: 'wrap' }}
                  >
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      {good.category}
                    </Text>
                    <Text type="secondary">•</Text>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      {good.quantity}
                      {good.unit}
                    </Text>
                  </Space>

                  {good.notes && (
                    <Paragraph
                      ellipsis={{ rows: 2, expandable: false }}
                      style={{ fontSize: 14, color: '#666', marginBottom: 8 }}
                    >
                      {good.notes}
                    </Paragraph>
                  )}

                  <Space
                    size="middle"
                    style={{ marginTop: 12, flexWrap: 'wrap' }}
                  >
                    <Space size="small">
                      <CalendarOutlined
                        style={{ color: '#999', fontSize: 12 }}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        购买: {formatDate(good.purchaseDate)}
                      </Text>
                    </Space>
                    <Space size="small">
                      <CalendarOutlined
                        style={{ color: '#999', fontSize: 12 }}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        过期: {formatDate(good.expiryDate)}
                      </Text>
                    </Space>
                  </Space>
                </div>

                <div
                  style={{
                    textAlign: 'right',
                    minWidth: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '8px',
                  }}
                >
                  <Tag
                    color={
                      statusConfig.color === '#52c41a'
                        ? 'success'
                        : statusConfig.color === '#faad14'
                          ? 'warning'
                          : statusConfig.color === '#ff4d4f'
                            ? 'error'
                            : 'default'
                    }
                    style={{ margin: 0, fontSize: 12 }}
                  >
                    {statusConfig.icon} {statusConfig.label}
                  </Tag>

                  <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>
                    {formatDaysRemaining(good.daysRemaining)}
                  </div>
                </div>

                {onDelete && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    shape="circle"
                    size="large"
                    style={{ alignSelf: 'center' }}
                    onClick={() => {
                      if (window.confirm('确定要删除这个物品吗？')) {
                        onDelete(good.id);
                      }
                    }}
                  />
                )}
              </div>
            </Card>
          );
        })}
      </Space>
    </div>
  );
};

export default GoodList;
