import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, theme } from 'antd';
import { DesktopOutlined, PieChartOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
const { Header, Content, Footer, Sider } = Layout;

export default function MainLayout({ children }) {
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  function getItem(label, path, icon, children) {
    return {
      path,
      icon,
      children,
      label
    };
  }

  const items = [
    getItem('Home', '/home', <PieChartOutlined />),
    getItem('District', '/district', <UserOutlined />, [
      getItem('District 1', '/district/1'),
      getItem('District 2', '/district/2'),
      getItem('District 3', '/district/3'),
      getItem('District 4', '/district/4'),
      getItem('District 5', '/district/5'),
      getItem('District 6', '/district/6'),
      getItem('District 7', '/district/7'),
      getItem('District 8', '/district/8'),
      getItem('District 9', '/district/9'),
      getItem('District 10', '/district/10'),
      getItem('District 11', '/district/11'),
      getItem('District 12', '/district/12'),
      getItem('District Tan Phu', '/district/tan-phu'),
      getItem('District Tan Binh', '/district/tan-binh'),
      getItem('District Binh Tan', '/district/binh-tan')
    ])
  ];

  const renderMenuItems = (menuItems) => {
    return menuItems.map((item) => (
      <React.Fragment key={item.path}>
        {item.children ? (
          <Menu.SubMenu key={item.path} title={item.label} icon={item.icon}>
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        ) : (
          <Menu.Item key={item.path} icon={item.icon}>
            <NavLink to={item.path}>{item.label}</NavLink>
          </Menu.Item>
        )}
      </React.Fragment>
    ));
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemHeight: 50
          }
        }
      }}>
      <Layout
        style={{
          minHeight: '100vh'
        }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            {renderMenuItems(items)}
          </Menu>
        </Sider>
        <Layout>
          <Content
            style={{
              margin: '0 16px'
            }}>
            <Outlet />
          </Content>
          <Footer
            style={{
              textAlign: 'center'
            }}>
            Ant Design ©2023 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
