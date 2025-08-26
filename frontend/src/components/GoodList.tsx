import React from 'react';
import { Card, Empty, Typography, Button, Space, Row, Col, Tag } from 'antd';
import { DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
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
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Card
          loading={true}
          style={{ width: '100%', maxWidth: 300, margin: '0 auto' }}
        >
          <div style={{ height: 120 }} />
        </Card>
      </div>
    );
  }

  if (goods.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 16px' }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无物品，快去添加吧！"
        />
      </div>
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
                  body: {
                    padding: '12px',
                    height: '100%',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                  },
                }}
                style={{
                  borderRadius: 8,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: statusConfig.bgColor,
                  border: `2px solid ${statusConfig.color}`,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(0, 0, 0, 0.1)';
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
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Title
                      level={3}
                      style={{
                        margin: 0,
                        fontSize: 'clamp(16px, 3vw, 20px)',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        textAlign: 'left',
                        color: statusConfig.color,
                        flex: 1,
                        paddingRight: 8,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {good.name}
                    </Title>
                    <Tag
                      color={statusConfig.color}
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        margin: 0,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        alignSelf: 'center',
                        borderRadius: 4,
                        padding: '2px 6px',
                      }}
                    >
                      {formatDaysRemaining(good.daysRemaining)}
                    </Tag>
                  </div>

                  {good.notes && (
                    <Paragraph
                      style={{
                        fontSize: 12,
                        color: '#666',
                        margin: 0,
                        marginTop: 4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                      className="good-notes"
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
                      <CalendarOutlined
                        style={{
                          color:
                            good.daysRemaining <= 0
                              ? '#ff4d4f'
                              : good.daysRemaining <= 7
                                ? '#faad14'
                                : '#52c41a',
                          fontSize: 10,
                        }}
                      />
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
