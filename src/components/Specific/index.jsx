import { Table } from 'antd';
import React from 'react';

const Specific = () => {
  return <ServiceChartTable />;
};

const ServiceChartTable = () => {
  const data = [{}, {}, {}];
  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      align: 'left'
    },
    {
      title: 'Service ID',
      dataIndex: 'id',
      key: 'id',
      align: 'left'
    },
    {
      title: 'Service name',
      dataIndex: 'name',
      key: 'name',
      align: 'left'
    }
  ];
  return <Table isLoading={false} dataSource={data} columns={columns}></Table>;
};

export default Specific;
