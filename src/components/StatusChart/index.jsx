import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function StatusChart({ id }) {
  const { isLoading, error, data } = useQuery('status', async () => {
    return (await axios.get(`http://127.0.0.1:5000/monitor/status/${id}`)).data;
  });
  console.log(data);
  return (
    <BarChart
      width={900}
      height={400}
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5
      }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="recordCount.2xx" stackId="2xx" name="2xx" fill="#7884d8" />
      <Bar dataKey="recordCount.3xx" stackId="3xx" name="3xx" fill="#82ca1d" />
      <Bar dataKey="recordCount.4xx" stackId="4xx" name="4xx" fill="#6881d8" />
      <Bar dataKey="recordCount.5xx" stackId="5xx" name="5xx" fill="#82ca9d" />
    </BarChart>
  );
}
