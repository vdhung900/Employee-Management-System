import React from 'react';
import { Result, Button, Row, Col, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FrownOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Col>
                <Result
                    icon={<FrownOutlined style={{ fontSize: 72, color: '#ff4d4f' }} />}
                    status="404"
                    title={<Title level={2}>404 - Không tìm thấy trang</Title>}
                    subTitle={
                        <Text type="secondary">
                            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                        </Text>
                    }
                    extra={
                        <Button type="primary" icon={<HomeOutlined />} onClick={() => navigate('/login')}>
                            Về trang đăng nhập
                        </Button>
                    }
                />
            </Col>
        </Row>
    );
};

export default NotFound;
