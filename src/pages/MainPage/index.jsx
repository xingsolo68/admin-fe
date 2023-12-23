import React from 'react';
import { Typography, theme, PageHeader } from 'antd';
import { useQuery } from 'react-query';
import axios from 'axios';
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

const { Title, Paragraph, Text, Link } = Typography;

export function MainPage() {
  const { isLoading, error, data } = useQuery('districtTotalConsumption', async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_READ_SERVICE_URL}/district/total-energy-consumption`
    );
    const transformedData = Object.entries(response.data).map(([districtNumber, quantity]) => ({
      name: `District ${districtNumber}`,
      quantity
    }));

    return transformedData;
  });

  const { data: dataDistribution } = useQuery('hourDistribution', async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_READ_SERVICE_URL}/district/distribution`
    );
    const transformedData = Object.entries(response.data).map(([hour, quantity]) => ({
      name: `${hour}:00`,
      quantity
    }));

    return transformedData;
  });

  const electricPrice = [
    { month: 1, price: '0.078' },
    { month: 2, price: '0.078' },
    { month: 3, price: '0.079' },
    { month: 4, price: '0.081' },
    { month: 5, price: '0.082' },
    { month: 6, price: '0.078' },
    { month: 7, price: '0.076' },
    { month: 8, price: '0.073' },
    { month: 9, price: '0.074' },
    { month: 10, price: '0.075' },
    { month: 11, price: '0.076' },
    { month: 12, price: '0.077' }
  ];

  return (
    <>
      <Title>Homepage</Title>
      <Title level={2}>Total energy consumption of each district</Title>
      <BarChart width={1250} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantity" fill="#8884d8" />
      </BarChart>
      <Title level={2}>Hourly distribution of energy consumption </Title>
      <BarChart width={1250} height={250} data={dataDistribution}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantity" fill="#8884d8" barSize={30} />
      </BarChart>

      <Title level={2}>Monthly electricity price</Title>
      <LineChart
        width={1250}
        height={250}
        data={electricPrice}
        margin={
          {
            // top: 5,
            // right: 5,
            // left: 5,
            // bottom: 5,
          }
        }>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis domain={[0.07, 'auto']} />
        <Label value="USD" position="insideTopLeft" angle={-90} style={{ textAnchor: 'middle' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
      </LineChart>
    </>
  );
}
