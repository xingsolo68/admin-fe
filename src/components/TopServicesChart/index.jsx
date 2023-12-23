import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

function TopServicesChart({ limit }) {
  const { data } = useQuery('top-services', async () => {
    return (
      await axios.get('http://127.0.0.1:5000/services/popular', {
        params: {
          limit
        }
      })
    ).data;
  });

  console.log(data);

  return (
    <BarChart
      width={900}
      height={400}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="serviceName" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="recordCount" fill="#8884d8" />
    </BarChart>
  );
}

export default TopServicesChart;
