import React from 'react';
import { Spin } from 'antd';
import {useLoading} from "../../contexts/LoadingContext";


const AppWrapper = ({ children }) => {
    const { isLoading } = useLoading();

    return (
        <>
            {isLoading && (
                <div
                    style={{
                        position: 'fixed',
                        zIndex: 9999,
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Spin tip="Đang xử lý..." size="large" />
                </div>
            )}
            {children}
        </>
    );
};

export default AppWrapper;
