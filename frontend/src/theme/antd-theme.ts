import type { ThemeConfig } from 'antd';

// 根据UI.md设计的Ant Design主题配置
const antdTheme: ThemeConfig = {
  token: {
    // 主色调 - 暖绿色
    colorPrimary: '#8EC560',
    colorSuccess: '#8EC560',
    
    // 中性色
    colorBgContainer: '#FFFDF7',  // 米白色背景
    colorText: '#333333',         // 深灰色文字
    colorTextSecondary: '#666666', // 次要文字
    
    // 边框和分割线
    colorBorder: '#E8E8E8',
    colorSplit: '#F0F0F0',
    
    // 圆角
    borderRadius: 12,
    borderRadiusLG: 12,
    borderRadiusSM: 8,
    
    // 字体
    fontFamily: '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 20,
    
    // 间距
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    margin: 16,
    marginLG: 24,
    marginSM: 8,
    
    // 阴影
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.12)',
  },
  components: {
    Card: {
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      headerBg: '#FFFDF7',
    },
    Button: {
      borderRadius: 24,
      colorPrimary: '#8EC560',
      algorithm: true,
    },
    Tag: {
      borderRadius: 8,
    },
    Typography: {
      titleMarginTop: 0,
      titleMarginBottom: 8,
    },
  },
};

export default antdTheme;