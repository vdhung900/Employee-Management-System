import {useState, useEffect} from "react";
import {Form, Input, Checkbox, Space, Divider, message, Alert, Typography} from "antd";
import {
    UserOutlined,
    LockOutlined,
    GoogleOutlined,
    MailOutlined,
    LoginOutlined,
} from "@ant-design/icons";
import {useNavigate, useLocation} from "react-router-dom";
import {login, isAuthenticated, isAdmin} from "../../utils/auth";
import ThreeDButton from "../../components/3d/ThreeDButton";
import ThreeDContainer from "../../components/3d/ThreeDContainer";
import "../../components/3d/ThreeDStyles.css";
import Loading from "../../components/loading/Loading";
import {MESSAGE} from "../../constants/Message";
import {API_URL} from "../../config";
import AuthService from "../../services/AuthService";
import {jwtDecode} from "jwt-decode";
import EmployeeProfile from "../../services/EmployeeProfile";
import {useLoading} from "../../contexts/LoadingContext";

const {Title, Text} = Typography;

const Login = () => {
    const [formData, setFormData] = useState({username: "", password: ""});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        if (isAuthenticated()) {
            const role = localStorage.getItem("role");

            let redirectTo = "/employee/dashboard";
            if (role === "admin") redirectTo = "/admin/dashboard";
            else if (role === "hr") redirectTo = "/employee/dashboard";
            else if (role === "manager") redirectTo = "/employee/dashboard";

            navigate(redirectTo, {replace: true});
        }
    }, [navigate]);

    const handleLogin = async (values) => {
        showLoading();
        setError("");
        try {
            const response = await AuthService.login(formData);
            if (response.success) {
                const data = response.data;
                login(data);
                await loadDataEmployee(data.user.employeeId)
                message.success(MESSAGE.LOGIN_SUCCESS);
                const role = localStorage.getItem("role");
                if (!role) {
                    message.error("Không tìm thấy vai trò người dùng. Vui lòng đăng nhập lại.");
                    return;
                }
                let redirectTo = "/employee/dashboard";
                if (role === "admin") redirectTo = "/admin/dashboard";
                else if (role === "hr") redirectTo = "/employee/dashboard";
                else if (role === "manager") redirectTo = "/employee/dashboard";

                setTimeout(() => {
                    navigate(redirectTo, {replace: true});
                }, 100);
            } else {
                setError(response.message || "Đăng nhập thất bại");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
        } finally {
            hideLoading();
        }
    };

    const loadDataEmployee = async (employeeId) => {
        try {
            const response = await EmployeeProfile.getEmployeeProfile(employeeId);
            if (response.success) {
                const employeeData = response.data;
                localStorage.setItem("employee", JSON.stringify(employeeData));
            }
        } catch (e) {
            message.error("Không thể tải dữ liệu nhân viên. Vui lòng thử lại sau.");
        }
    }

    const handleGoogleLogin = () => {
        message.info("Đăng nhập Google sẽ được triển khai ở đây");
    };

    const handleOtpLogin = () => {
        message.info("Đăng nhập OTP sẽ được triển khai ở đây");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1976d2 0%, #90caf9 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {loading && <Loading text="Đang đăng nhập..." color="#1976d2"/>}

            {/* Background patterns */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
          radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.05) 75%, transparent 75%, transparent)
        `,
                    backgroundSize: "100% 100%, 100% 100%, 60px 60px",
                    opacity: 0.5,
                }}
            />

            {/* Animated circles */}
            <div
                style={{
                    position: "absolute",
                    width: "300px",
                    height: "300px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                    top: "-150px",
                    left: "-150px",
                    animation: "float 8s ease-in-out infinite",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                    bottom: "-100px",
                    right: "-100px",
                    animation: "float 6s ease-in-out infinite",
                }}
            />

            <style>
                {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}
            </style>

            <ThreeDContainer
                glassEffect={true}
                style={{
                    maxWidth: "420px",
                    width: "90%",
                    margin: "20px",
                    padding: "40px",
                    position: "relative",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "30px",
                        position: "relative",
                    }}
                >
                    <div className="pulse-animation" style={{marginBottom: "16px"}}>
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                margin: "0 auto",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #1976d2, #90caf9)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
                            }}
                        >
                            <UserOutlined style={{fontSize: "36px", color: "white"}}/>
                        </div>
                    </div>
                    <Title
                        level={2}
                        className="enhanced-title"
                        style={{margin: "0 0 8px 0", fontSize: "28px", color: "#1976d2"}}
                    >
                        Đăng nhập
                    </Title>
                    <Text style={{color: "#666", display: "block", fontSize: "16px"}}>
                        Hệ thống Quản lý Chấm công
                    </Text>
                </div>

                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        style={{
                            marginBottom: "24px",
                            boxShadow: "0 4px 12px rgba(255, 77, 79, 0.1)",
                            borderRadius: "8px",
                            border: "1px solid #ffccc7",
                        }}
                    />
                )}

                <div style={{position: "relative", zIndex: 1}}>
                    <Form
                        name="login"
                        initialValues={{remember: true}}
                        onFinish={handleLogin}
                        size="large"
                        layout="vertical"
                    >
                        <Form.Item
                            name="username"
                            rules={[{required: true, message: "Vui lòng nhập tên đăng nhập!"}]}
                        >
                            <Input
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                prefix={<UserOutlined style={{color: "#1976d2"}}/>}
                                placeholder="Tên đăng nhập (admin hoặc employee)"
                                className="neumorphic-input"
                                style={{
                                    borderRadius: "8px",
                                    padding: "12px 16px",
                                    height: "auto",
                                    fontSize: "15px",
                                    border: "1px solid #e8e8e8",
                                    transition: "all 0.3s",
                                    background: "rgba(255, 255, 255, 0.9)",
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{required: true, message: "Vui lòng nhập mật khẩu!"}]}
                        >
                            <Input.Password
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                prefix={<LockOutlined style={{color: "#1976d2"}}/>}
                                placeholder="Mật khẩu (1)"
                                className="neumorphic-input"
                                style={{
                                    borderRadius: "8px",
                                    padding: "12px 16px",
                                    height: "auto",
                                    fontSize: "15px",
                                    border: "1px solid #e8e8e8",
                                    transition: "all 0.3s",
                                    background: "rgba(255, 255, 255, 0.9)",
                                }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Space size="middle" style={{width: "100%", justifyContent: "space-between"}}>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                                </Form.Item>
                                <a
                                    href="#"
                                    style={{
                                        color: "#1976d2",
                                        textDecoration: "none",
                                        fontWeight: "500",
                                    }}
                                >
                                    Quên mật khẩu?
                                </a>
                            </Space>
                        </Form.Item>

                        <Form.Item>
                            <button
                                type="submit"
                                className="btn-green-theme"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    height: "46px",
                                    fontSize: "16px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    background: "linear-gradient(135deg, #1976d2, #90caf9)",
                                    border: "none",
                                    color: "white",
                                    fontWeight: "600",
                                    transition: "all 0.3s",
                                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                                }}
                            >
                                {!loading && (
                                    <>
                                        <LoginOutlined/> Đăng nhập
                                    </>
                                )}
                            </button>
                        </Form.Item>

                        <Divider plain style={{fontSize: "14px", color: "#666"}}>
                            Hoặc đăng nhập bằng
                        </Divider>

                        <div style={{display: "flex", justifyContent: "center", gap: "16px"}}>
                            <button
                                onClick={handleGoogleLogin}
                                style={{
                                    padding: "8px 16px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    background: "rgba(255, 255, 255, 0.9)",
                                    border: "1px solid #e8e8e8",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    boxShadow: "0 2px 0 rgba(0,0,0,0.02)",
                                    transition: "all 0.3s",
                                    color: "#666",
                                }}
                            >
                                <GoogleOutlined style={{color: "#ea4335"}}/>
                                <span>Google</span>
                            </button>
                            <button
                                onClick={handleOtpLogin}
                                style={{
                                    padding: "8px 16px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    background: "rgba(255, 255, 255, 0.9)",
                                    border: "1px solid #e8e8e8",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    boxShadow: "0 2px 0 rgba(0,0,0,0.02)",
                                    transition: "all 0.3s",
                                    color: "#666",
                                }}
                            >
                                <MailOutlined style={{color: "#1976d2"}}/>
                                <span>Email OTP</span>
                            </button>
                        </div>
                    </Form>
                </div>
            </ThreeDContainer>
        </div>
    );
};

export default Login;
