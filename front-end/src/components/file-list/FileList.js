import React, { useState, useEffect } from 'react';
import { Upload, List, Button, Spin, message, Typography, Popconfirm, Space } from 'antd';
import { UploadOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import FileService from "../../services/FileService";

const { Text } = Typography;
const API_BASE = 'http://localhost:9123/files';

export default function UploadFileComponent({files = [], uploadFileSuccess}) {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFileList();
    }, []);

    const fetchFileList = () => {
        setLoading(true);
        try {
            setFileList(files || []);
        } catch (error) {
            message.error('Lỗi tải danh sách file');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await FileService.uploadFile(formData)
            if (response.success) {
                message.success('Tải file lên thành công!');
                let file = fileList;
                file.push(response.data)
                setFileList(file);
                if(uploadFileSuccess){
                    uploadFileSuccess(fileList);
                }
            }
        } catch (error) {
            message.error('Lỗi tải file lên');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (key) => {
        window.open(`${API_BASE}/${key}`, '_blank');
    };

    const handleDelete = async (key) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/${key}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Delete failed');
            message.success('Xóa file thành công!');
            await fetchFileList();
        } catch (error) {
            message.error('Lỗi xóa file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 320, padding: 0, background: 'none' }}>
            <Upload
                showUploadList={false}
                customRequest={({ file, onSuccess }) => {
                    handleUpload(file);
                    setTimeout(() => onSuccess && onSuccess('ok'), 0);
                }}
                disabled={loading}
            >
                <Button icon={<UploadOutlined />} size="small" style={{ fontSize: 13, marginBottom: 8 }} loading={loading}>
                    Chọn file
                </Button>
            </Upload>
            <Spin spinning={loading} size="small">
                <List
                    size="small"
                    style={{ marginTop: 4, fontSize: 13 }}
                    dataSource={fileList}
                    locale={{ emptyText: <Text type="secondary" style={{ fontSize: 12 }}>Chưa có file</Text> }}
                    renderItem={key => (
                        <List.Item
                            style={{ padding: '4px 0' }}
                            actions={[
                                <Button
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownload(key.key)}
                                    size="small"
                                    key="download"
                                />,
                                <Popconfirm
                                    title="Xóa file này?"
                                    onConfirm={() => handleDelete(key.key)}
                                    okText="Xóa"
                                    cancelText="Hủy"
                                    key="delete"
                                >
                                    <Button icon={<DeleteOutlined />} danger size="small" />
                                </Popconfirm>
                            ]}
                        >
                            <Text style={{ fontSize: 13 }}>{key.originalName}</Text>
                        </List.Item>
                    )}
                />
            </Spin>
        </div>
    );
}
