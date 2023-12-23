import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { DistrictPage } from './pages/DistrictPage';
import { AreaPage } from './pages/AreaPage';
import MainLayout from './layouts/MainLayout';
import { LoginPage } from './pages/LoginPage';

import { Breadcrumb, Layout, Menu, theme } from 'antd';

import { DesktopOutlined, PieChartOutlined, UserOutlined } from '@ant-design/icons';

import './modal.css';
import './App.css';
import { MeterPage } from './pages/MeterPage';
const { Header, Content, Footer, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<MainLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/district/:districtName" element={<DistrictPage />} />
        <Route path="/area/:localSubstationId" element={<AreaPage />} />
        <Route path="/meter/:meterId" element={<MeterPage />} />
      </Route>
      {/* <Route path="/district/:districtName" element={<DistrictPage />} />
  <Route path="/area/:areaId" element={<AreaPage />} />
  <Route path="/meter/:meterId" element={<MeterPage />} /> */}
    </Routes>
  );
}

export default App;
