import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams, Link } from 'react-router-dom';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  LineChart,
  Line,
  Label
} from 'recharts';
import axios from 'axios';
import { axiosPrivate } from '../../utils/axiosClient';
import { Typography, theme, Table, Row, Col, Button, Space, Segmented } from 'antd';

const { Title, Paragraph, Text } = Typography;

const columns = [
  {
    title: 'Meter ID',
    dataIndex: 'meterId',
    render: (text, record) => <Link to={`/meter/${text}`}>{text}</Link>
  },
  {
    title: 'First name',
    dataIndex: 'firstName',
    render: (text, record) => <div>{text}</div>
  },
  {
    title: 'Last name',
    dataIndex: 'lastName',
    render: (text, record) => <div>{text}</div>
  },
  {
    title: 'Total energy consumption',
    dataIndex: 'totalQuantity'
  },
  {
    title: 'Average energy consumption',
    dataIndex: 'totalQuantity',
    render: (text, record) => <div>{(text / 30).toFixed(2)}</div>
  }
];

export const AreaPage = () => {
  const { localSubstationId } = useParams();
  const options = [
    { label: 'Month', value: 'month' },
    { label: 'Day', value: 'day' }
  ];
  const [option, setOption] = useState('month');

  const { isLoading, error, data, refetch } = useQuery(
    ['areaConsumption', localSubstationId, option],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_READ_SERVICE_URL}/area/${localSubstationId}/energy-consumption`,
        { params: { timeRange: option } }
      );
      if (option === 'month') {
        const transformedData = Object.entries(response.data).map(([timestamp, quantity]) => ({
          timestamp,
          quantity
        }));
        return transformedData;
      } else {
        const transformData = response.data.map(({ quantity, reportDate }) => ({
          quantity,
          reportDate: reportDate.split('T')[0]
        }));
        return transformData;
      }
    },
    { cacheTime: 0 }
  );

  console.log(error);

  useEffect(() => {
    // This effect runs when the component mounts
    refetch();
  }, []);

  const { data: userData } = useQuery(['areaUsers', localSubstationId], async () => {
    const response = await axiosPrivate.get(
      `${process.env.REACT_APP_READ_SERVICE_URL}/area/${localSubstationId}/users`
    );
    return response.data;
  });

  return (
    <>
      <Title level={2}>Electricity consumption</Title>
      <Space direction="horizontal" size="middle">
        <Row justify={'start'}>
          <Space>
            <Segmented options={options} onChange={(value) => setOption(value)} />
          </Space>
        </Row>
      </Space>
      <LineChart
        width={1250}
        height={250}
        data={data}
        margin={
          {
            // top: 5,
            // right: 5,
            // left: 5,
            // bottom: 5,
          }
        }>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis dataKey="" />
        {/* <Label
          value="reportDate"
          position="insideTopLeft"
          angle={-90}
          style={{ textAnchor: 'middle' }}
        /> */}
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
      </LineChart>
      <Title level={2}>All Users</Title>
      <Table columns={columns} dataSource={userData} />
    </>
  );
};
