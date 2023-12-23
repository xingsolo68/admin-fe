import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';

export function VisualizePage() {
  const { Content, Sider } = Layout;
  const [isGeneralActive, setIsGeneralActive] = useState(true);

  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const sideItems = [
    { name: 'Home', link: '/visualize/home' },
    { name: 'Services', link: '/visualize/service' }
  ].map((val, index) => {
    const key = String(index + 1);
    return {
      key: key,
      label: (
        <NavLink to={val.link}>
          <span>{val.name}</span>
        </NavLink>
      )
    };
  });
  return (
    <Layout
      style={{
        background: colorBgContainer
      }}>
      <Sider
        mode="inline"
        width={200}
        style={{
          background: colorBgContainer,
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0
        }}>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          style={{
            height: '100%'
          }}
          items={sideItems}
          onClick={(e) => {
            console.log(e);
            if (e.key === '1') {
              setIsGeneralActive(true);
            } else {
              setIsGeneralActive(false);
            }
            console.log(isGeneralActive);
          }}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: 200
        }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280
          }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
