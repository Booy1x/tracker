import React from 'react';
import { Card, Empty, Spin, Typography, Button, Space, Row, Col } from 'antd';
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
    <div style={{ padding: '0', width: '100%', margin: '0 auto' }}>
      <Row gutter={[12, 12]} style={{ width: '100%', margin: 0 }}>
        {goods.map((good) => {
          const statusConfig = GOOD_STATUS_CONFIG[good.status];

          return (
            <Col xs={24} sm={12} md={8} lg={6} xl={4} key={good.id}>
              <Card
                hoverable
                styles={{
                  body: { padding: '12px', height: '100%' },
                }}
                style={{
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: statusConfig.bgColor,
                  border: `2px solid ${statusConfig.color}`,
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
                    flexDirection: 'column',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Title
                      level={2}
                      style={{
                        margin: 0,
                        fontSize: 'clamp(16px, 3vw, 20px)',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        textAlign: 'left',
                        color: statusConfig.color,
                        flex: 1,
                        paddingRight: 8,
                      }}
                    >
                      {good.name}
                    </Title>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: statusConfig.color,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        alignSelf: 'center',
                      }}
                    >
                      {formatDaysRemaining(good.daysRemaining)}
                    </div>
                  </div>

                  {good.notes && (
                    <Paragraph
                      ellipsis={{ rows: 2, expandable: false }}
                      style={{ fontSize: 12, color: '#666', marginBottom: 8 }}
                    >
                      {good.notes}
                    </Paragraph>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto',
                    }}
                  >
                    <Space size="small" style={{ alignItems: 'center' }}>
                      <CalendarOutlined style={{ color: '#999', fontSize: 10 }} />
                      <Text type="secondary" style={{ fontSize: 10 }}>
                        过期: {formatDate(good.expiryDate)}
                      </Text>
                    </Space>

                    {onDelete && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        shape="circle"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('确定要删除这个物品吗？')) {
                            onDelete(good.id);
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
      <div style={{ height: '16px' }}></div>
    </div>
  );
};

export default GoodList;
