import React from 'react';
import { Table } from 'antd';
import { useQuery } from 'react-query';
import axios from 'axios';

const UnusedServicesTable = ({ hourRange }) => {
  const { data, isLoading } = useQuery('unused-services', async () => {
    return (
      await axios.get('http://127.0.0.1:5000/services/unused', {
        params: {
          hourRange
        }
      })
    ).data;
  });

  let convertedData = [];
  if (!isLoading) {
    convertedData = data?.map((record) => {
      return {
        ...record,
        ts: new Date(record?.ts).toUTCString()
      };
    });
  }

  const columns = [
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
    },
    {
      title: 'Last used',
      dataIndex: 'ts',
      key: 'ts',
      align: 'left'
    }
  ];
  return (
    <>
      <Table loading={isLoading} dataSource={convertedData} columns={columns}></Table>
    </>
  );
};

export default UnusedServicesTable;
