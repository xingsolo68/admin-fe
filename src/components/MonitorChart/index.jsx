import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

const GeneralPredict = () => {
  return (
    <>
      <div>GeneralPredict</div>
      <MonitorChart id={'f580878c-7f31-491d-bcdd-0e95b7985aa6'} />
    </>
  );
};

export const MonitorChart = ({ id, hourRange }) => {
  const { isLoading, error, data } = useQuery(['monitor',id, hourRange], async ({ queryKey }) => {
    return (
      await axios.get(
        `http://127.0.0.1:5000/monitor/numOfReq/${queryKey[1]}`,
        { params: { hourRange: queryKey[2] } }
      )
    ).data;
  });

  data?.forEach((point) => {
    point['ts'] = new Date(point['ts']).toLocaleString();
    return point;
  });

  return (
    <>
      <LineChart
        width={900}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 50,
          left: 20,
          bottom: 5
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ts" />
        <YAxis />
        <Tooltip />
        <Legend />
        <ReferenceLine y={100} label="Threshold" stroke="red" />
        <Line type="monotone" dataKey="recordCount" stroke="#ff7300" dot={''} />
      </LineChart>
    </>
  );
};

export default GeneralPredict;
