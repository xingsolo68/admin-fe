import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';
import { Typography, theme, Table } from 'antd';
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
import { axiosPrivate } from '../../utils/axiosClient';

const { Title, Paragraph, Text, Link } = Typography;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text, record) => <NavLink to={`/area/${record.id}`}>{text}</NavLink>
  },
  {
    title: 'Total energy consumption',
    dataIndex: 'totalQuantity'
  }
];

export const DistrictPage = () => {
  const { districtName } = useParams();

  const { isLoading, error, data } = useQuery(
    ['districtTotalConsumption', districtName],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_READ_SERVICE_URL}/district/${districtName}/energy-consumption`
      );
      const transformedData = Object.entries(response.data).map(([timestamp, quantity]) => ({
        timestamp,
        quantity
      }));

      return transformedData;
    }
  );

  const { data: areaData } = useQuery(['districtAreaData', districtName], async () => {
    const response = await axiosPrivate.get(
      `${process.env.REACT_APP_READ_SERVICE_URL}/district/${districtName}`
    );
    return response.data;
  });

  return (
    <>
      <Title level={2}>Electricity consumption</Title>
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
        <YAxis domain={[0.07, 'auto']} />
        <Label value="USD" position="insideTopLeft" angle={-90} style={{ textAnchor: 'middle' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
      </LineChart>

      <Title level={2}>All Area</Title>
      <Table columns={columns} dataSource={areaData} />
    </>
  );
};
