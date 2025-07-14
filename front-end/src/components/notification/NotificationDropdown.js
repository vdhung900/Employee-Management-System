import React from 'react';
import { Badge, List, Avatar, Button, Typography, Empty, Tooltip } from 'antd';
import { BellOutlined, CheckCircleTwoTone } from '@ant-design/icons';

const { Text } = Typography;

const NotificationDropdown = ({ notifications = [], onReadAll, onItemClick, loading }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ minWidth: 340, maxWidth: 400, padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', background: '#fafcff' }}>
        <span style={{ fontWeight: 600, fontSize: 16 }}>
          <BellOutlined style={{ color: '#1976d2', marginRight: 8 }} /> Thông báo
        </span>
        <Tooltip title="Đánh dấu tất cả là đã đọc">
          <Button size="small" type="link" onClick={onReadAll} disabled={unreadCount === 0}>
            Đánh dấu đã đọc tất cả
          </Button>
        </Tooltip>
      </div>
      <div style={{ maxHeight: 350, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <Empty description="Không có thông báo" style={{ margin: '32px 0' }} />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            loading={loading}
            renderItem={item => (
              <List.Item
                style={{
                  background: item.read ? '#fff' : '#e3f2fd',
                  cursor: 'pointer',
                  borderLeft: item.read ? '4px solid transparent' : '4px solid #1976d2',
                  transition: 'background 0.2s',
                  paddingLeft: 12,
                }}
                onClick={() => onItemClick(item)}
              >
                <List.Item.Meta
                  avatar={<Avatar style={{ background: item.read ? '#bdbdbd' : '#1976d2' }} icon={<BellOutlined />} />}
                  title={<Text strong={!item.read}>{item.message}</Text>}
                  description={<span style={{ fontSize: 12, color: '#888' }}>{item.time || ''}</span>}
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown; 