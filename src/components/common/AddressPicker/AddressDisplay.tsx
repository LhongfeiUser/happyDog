import React from 'react';
import { Tooltip } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import type { AddressDisplayProps } from './types';
import { useAddress } from '@/hooks/useAddress';

const AddressDisplay: React.FC<AddressDisplayProps> = ({
  value,
  showIcon = true,
  short = false,
  className,
}) => {
  const { format, formatShort, ensureAddressInfo } = useAddress();

  if (!value) return <span className={className}>—</span>;

  const addrInfo = ensureAddressInfo(value);
  const displayText = short ? formatShort(value) : format(value);

  if (addrInfo?.lng && addrInfo?.lat) {
    return (
      <span className={className}>
        {showIcon && <EnvironmentOutlined style={{ marginRight: 4, color: '#FF6B35' }} />}
        <Tooltip title={`坐标: ${addrInfo.lng.toFixed(6)}, ${addrInfo.lat.toFixed(6)}`}>
          {displayText}
        </Tooltip>
      </span>
    );
  }

  return (
    <span className={className}>
      {showIcon && <EnvironmentOutlined style={{ marginRight: 4, color: '#FF6B35' }} />}
      {displayText}
    </span>
  );
};

export default AddressDisplay;
