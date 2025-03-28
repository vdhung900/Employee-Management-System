import React from "react";
import { ListGroup } from "react-bootstrap";
import { useLocation, Link } from "react-router-dom";

const logoStyle = {
  color: "inherit",
  textDecoration: "none",
  display: "block",
  height: "72px",
};

const sideBarStyle = {
  width: "300px",
};

const currentTabStyle = { textDecoration: "underline", fontWeight: "600" };

const Sidebar = () => {
  const location = useLocation();

  const tabs = [
    {
      label: "Quản lý thông tin nhân viên",
      href: "employees",
    },
    {
      label: "Quản lý phòng ban",
      href: "departments",
    },
    {
      label: "Quản lý lương thưởng",
      href: "salaries",
    },
    {
      label: "Quản lý chấm công",
      href: "attendances",
    },
    {
      label: "Quản lý nghỉ phép",
      href: "leaves",
    },
    {
      label: "Báo cáo và thống kê",
      href: "reports",
    },
    {
      label: "Thông báo",
      href: "notifications",
    },
    {
      label: "Lịch sử hoạt động",
      href: "action-histories",
    },
    {
      label: "Sao lưu và khôi phục",
      href: "backups",
    },
  ];

  return (
    <div style={sideBarStyle}>
      <Link to="/home" style={logoStyle}>
        <div id="logo-and-name" className="pt-3">
          <img alt="" src="ems_logo.webp" width="40" height="40" />
          <span className="fw-medium fs-5">Quản Lý Nhân Sự</span>
        </div>
      </Link>

      <ListGroup>
        {tabs.map((tab, index) => (
          <ListGroup.Item
            key={index}
            action
            as={Link}
            to={`/${tab.href.toLowerCase()}`}
            active={location.pathname.endsWith(tab.href)}
          >
            <span
              style={
                location.pathname.endsWith(tab.href) ? currentTabStyle : {}
              }
            >
              {tab.label}
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
