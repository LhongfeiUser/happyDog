import React from 'react';
import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return (
    <AntFooter
      style={{
        textAlign: 'center',
        background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0CC 100%)',
        padding: '24px 50px',
        marginTop: 'auto',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '24px', marginRight: '8px' }}>🐾</span>
        <span style={{ color: '#FF6B35', fontWeight: 'bold', fontSize: '18px' }}>
          宠物服务平台
        </span>
      </div>
      <div style={{ color: '#666', marginBottom: '8px' }}>
        让每一位宠物都能享受到专业、贴心的服务
      </div>
      <div style={{ color: '#999', fontSize: '12px' }}>
        © 2026 宠物服务平台 - 爱宠人士的首选
      </div>
    </AntFooter>
  );
};

export default Footer;
