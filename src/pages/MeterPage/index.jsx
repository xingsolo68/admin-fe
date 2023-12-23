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
export const MeterPage = () => {
  const { meterId } = useParams();
  console.log(meterId);
  const options = [
    { label: 'Day', value: 'day' },
    { label: 'Month', value: 'month' }
  ];
  const [option, setOption] = useState('day');

  const { isLoading, error, data, refetch } = useQuery(
    ['meterConsumption', meterId, option],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_READ_SERVICE_URL}/meter/${meterId}/energy-consumption`,
        { params: { timeRange: option } }
      );
      if (option === 'month') {
        const transformedData = Object.entries(response.data.data).map(([timestamp, quantity]) => ({
          timestamp,
          quantity
        }));
        return transformedData;
      } else {
        const transformData = response.data.data.map(({ quantity, reportDate }) => ({
          quantity,
          reportDate: reportDate.split('T')[0]
        }));
        return transformData;
      }
    },
    { cacheTime: 0 }
  );

  const { data: totalEnergyConsumption } = useQuery(
    ['totalMeterConsumption', meterId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_READ_SERVICE_URL}/meter/${meterId}/total-energy-consumption`
      );
      return response.data;
    },
    { cacheTime: 0 }
  );

  useEffect(() => {
    // This effect runs when the component mounts
    refetch();
  }, []);

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

      <Title level={2}>Total energy consumption: {totalEnergyConsumption} kWh</Title>
      <Title level={2}>Total price: {totalEnergyConsumption * 0.08} USD</Title>
    </>
  );
};
