import React from 'react';
import { Card, Tag } from 'antd';

interface RankItem {
  id: string;
  name: string;
  price: number;
  salesCount: number;
}

interface RankListProps {
  data: RankItem[];
  maxItems?: number;
}

export const RankList: React.FC<RankListProps> = ({
  data,
  maxItems = 6,
}) => {
  const displayData = data.slice(0, maxItems);

  return (
    <div className="flex-col gap-4">
      {displayData.map((item, index) => (
        <Card
          key={item.id}
          style={{
            borderRadius: 12,
            border: index < 3 ? '2px solid #FF6B35' : undefined,
          }}
          hoverable
        >
          <div className="flex items-center gap-4">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: index < 3 ? '#FF6B35' : '#d9d9d9',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              {index + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex items-center justify-between">
                <span style={{ fontWeight: 500 }}>{item.name}</span>
                <Tag color="blue">{item.salesCount} 单</Tag>
              </div>
              <div style={{ marginTop: 8 }}>
                <span type="secondary">¥{(item.price / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RankList;
