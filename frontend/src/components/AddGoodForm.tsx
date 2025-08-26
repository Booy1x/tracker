import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Card,
  Typography,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { CreateGoodRequest } from '../types/good';
import { COMMON_CATEGORIES } from '../types/good';

const { Title } = Typography;
const { TextArea } = Input;

interface AddGoodFormProps {
  onSubmit: (data: CreateGoodRequest) => void;
  onCancel?: () => void;
}

export default function AddGoodForm({ onSubmit, onCancel }: AddGoodFormProps) {
  const [form] = Form.useForm();

  const handleFormSubmit = (values: any) => {
    const purchaseDate = values.purchaseDate.format('YYYY-MM-DD');
    const expiryDate = values.purchaseDate
      .clone()
      .add(values.shelfLifeDays, 'days')
      .format('YYYY-MM-DD');

    // 处理分类字段，确保是字符串
    const category = Array.isArray(values.category)
      ? values.category[0] || '其他'
      : values.category || '其他';

    const submitData: CreateGoodRequest = {
      name: values.name,
      category: category,
      purchaseDate,
      expiryDate,
      notes: values.notes,
    };

    onSubmit(submitData);
    form.resetFields();
  };

  return (
    <Card
      style={{
        maxWidth: '100%',
        margin: '0 auto',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Title level={3} style={{ marginBottom: 24, textAlign: 'center' }}>
        添加新物品
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          category: ['其他'],
          shelfLifeDays: 7,
        }}
      >
        <Form.Item
          label="物品名称"
          name="name"
          rules={[{ required: true, message: '请输入物品名称' }]}
        >
          <Input placeholder="例如：牛奶、鸡蛋、面包" size="large" />
        </Form.Item>

        <Form.Item
          label="分类"
          name="category"
          rules={[{ required: true, message: '请选择或输入分类' }]}
        >
          <Select
            placeholder="请选择或输入分类"
            size="large"
            showSearch
            mode="tags"
            tokenSeparators={[',']}
            options={COMMON_CATEGORIES.map((category) => ({
              label: category,
              value: category,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="购买日期"
          name="purchaseDate"
          rules={[{ required: true, message: '请选择购买日期' }]}
        >
          <DatePicker style={{ width: '100%' }} size="large" />
        </Form.Item>

        <Form.Item
          label="保质期（天）"
          name="shelfLifeDays"
          rules={[{ required: true, message: '请输入保质期' }]}
        >
          <Input type="number" min={1} placeholder="天数" size="large" />
        </Form.Item>

        <Form.Item label="备注" name="notes">
          <TextArea
            rows={3}
            placeholder="添加备注信息..."
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'center' }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              size="large"
              style={{ borderRadius: 24 }}
            >
              添加物品
            </Button>
            {onCancel && (
              <Button
                onClick={onCancel}
                size="large"
                style={{ borderRadius: 24 }}
              >
                取消
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
