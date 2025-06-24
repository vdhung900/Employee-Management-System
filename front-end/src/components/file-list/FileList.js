import React, { useState, useEffect } from 'react';
import { Upload, List, Button, Spin, message, Typography, Popconfirm, Space } from 'antd';
import {UploadOutlined, DeleteOutlined, DownloadOutlined, FileOutlined} from '@ant-design/icons';
import FileService from "../../services/FileService";

const { Text } = Typography;

export default function UploadFileComponent({files = [], uploadFileSuccess, isSingle = false}) {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFileList();
    }, [files]);

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
                const newFileList = [...fileList, response.data];
                setFileList(newFileList);
                if(uploadFileSuccess){
                    uploadFileSuccess(newFileList);
                }
            }
        } catch (error) {
            message.error('Lỗi tải file lên');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (key) => {
        setLoading(true);
        try {
            const blob = await FileService.getFile(key)
            if(blob){
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a');
                link.href = url;
                const fileItem = fileList.find(item => item.key === key);
                link.download = fileItem ? fileItem.originalName : 'downloadFile';
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                message.success('Tải file thành công')
            }else{
                message.error('Tải file thất bại')
            }
        } catch (error) {
            message.error('Tải file thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (key) => {
        setLoading(true);
        try {
            const response = await FileService.deleteFile(key)
            if(response.success){
                message.success('Xóa file thành công!');
                const newFileList = fileList.filter(item => item.key !== key);
                setFileList(newFileList);
                if(uploadFileSuccess){
                    uploadFileSuccess(newFileList);
                }
            }
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
                disabled={loading || (isSingle && fileList.length > 0)}
            >
                <Button icon={<UploadOutlined />} size="small" style={{ fontSize: 13, marginBottom: 8 }} loading={loading} disabled={loading || (isSingle && fileList.length > 0)} >
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
                            <Text style={{ fontSize: 13 }}><FileOutlined/> {key.originalName}</Text>
                        </List.Item>
                    )}
                />
            </Spin>
        </div>
    );
}
