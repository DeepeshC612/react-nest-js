import React from "react";
import {
  LogoutOutlined,
  UserOutlined,
  DropboxOutlined,
  ProfileOutlined
} from "@ant-design/icons";
import { Layout, Menu, notification } from "antd";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
const { Sider } = Layout;

const SideBar = () => {
  const userData = useSelector((state) => state?.auth?.userData);
  const navigate = useNavigate();
  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();

  const handelProduct = () => {
    navigate("/");
  };
  const handleLogout = () => {
    localStorage.clear();
    openNotification({ message: "Logout", type: "success" });
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };
  const handelMyOrder = () => {
    navigate("/my-order")
  }
  const handelMyProfile = () => {
    navigate("/profile")
  }
  let sideBar = []
  if (userData?.role === "admin") {
    sideBar = [
      { icon: DropboxOutlined, label: "Products", onClick: handelProduct, path: "/" },
      { icon: UserOutlined, label: "Admin profile", onClick: handelMyProfile, path: "/profile" },
      { icon: LogoutOutlined, label: "Logout", onClick: handleLogout, path: "/login" },
    ];
  } else {
    sideBar = [
      { icon: DropboxOutlined, label: "Product", onClick: handelProduct, path: "/" },
      { icon: UserOutlined, label: "My profile", onClick: handelMyProfile, path: "/profile" },
      { icon: ProfileOutlined, label: "My order", onClick: handelMyOrder, path: "/my-order" },
      { icon: LogoutOutlined, label: "Logout", onClick: handleLogout, path: "/login" },
    ];
  }
  const sideBarItems = sideBar.map((item, index) => ({
    key: item.path,
    icon: React.createElement(item.icon),
    label: item.label,
    onClick: item?.onClick,
  }));
  const openNotification = (data) => {
    api.open({
      type: data?.type,
      message: data?.message,
    });
  };
  return (
    <Layout>
     {contextHolder}
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          className="logo"
          style={{
            height: "50px",
            marginTop: "16px",
            marginLeft: "3px",
            marginRight: "3px",
            marginBottom: "16px",
            borderRadius: "5px",
            background: "rgba(255, 255, 255, 0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/profile")}>
            <img
              src={userData?.profilePic}
              alt="profilePic"
              style={{
                borderRadius: "50%",
                height: "40px",
                width: "40px",
                objectFit: "cover",
                marginLeft: "3px",
                marginRight: "5px",
              }}
            ></img>
            <p
              style={{
                fontWeight: "bold",
                marginTop: "12px",
                color: "white",
              }}
            >
              {userData?.name}
            </p>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[location.pathname]}
          items={sideBarItems}
        />
      </Sider>
    </Layout>
  );
};
export default SideBar;
