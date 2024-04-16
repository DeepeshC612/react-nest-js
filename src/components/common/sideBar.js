import React from "react";
import {
  LogoutOutlined,
  UserOutlined,
  DropboxOutlined,
} from "@ant-design/icons";
import { Layout, Menu, notification } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const { Sider } = Layout;

const SideBar = () => {
  const userData = useSelector((state) => state?.auth?.userData);
  const navigate = useNavigate();
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
  let sideBar = [
    { icon: DropboxOutlined, label: "Product", onClick: handelProduct },
    { icon: UserOutlined, label: "My order" },
    { icon: LogoutOutlined, label: "Logout", onClick: handleLogout },
  ];
  const sideBarItems = sideBar.map((item, index) => ({
    key: String(index + 1),
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
          <div style={{ display: "flex", alignItems: "center" }}>
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
          items={sideBarItems}
        />
      </Sider>
    </Layout>
  );
};
export default SideBar;
