import React from 'react';
import { XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { useQuery } from 'react-query';
import axios from 'axios';

export const PredictChart = ({ id }) => {
  const { isLoading, data } = useQuery('predict', async () => {
    return (await axios.get(`http://127.0.0.1:5000/predict/${id}`)).data;
  });
  let start = data?.predict_range?.['current'] - data?.predict_range?.['per_day'] * 30;
  if (start < data?.predict_range?.['start']) {
    start = data?.predict_range?.['start'];
  }
  const end = data?.predict_range?.['current'] + 1 * data?.predict_range?.['per_day'];
  const limitedData = data?.data?.filter((point) => point?.ts >= start && point?.ts <= end);

  limitedData?.forEach((point) => {
    point['ts_iso'] = new Date(point['ts']).toLocaleString();
    return point;
  });
  return (
    <>
      {!isLoading && (
        <AreaChart width={900} height={400} data={limitedData}>
          <XAxis dataKey="ts_iso" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" name="Real-time" dataKey="latency" stroke="#8884d8" dot={''} />
          <Area
            type="basis"
            name="Linear predict"
            dataKey="latency_linear"
            stroke="#82ca9d"
            dot={''}
            fillOpacity={0}
          />
          <Area
            type="natural"
            name="Random forest"
            dataKey="latency_random_forest"
            stroke="#82ca9d"
            dot={''}
            fillOpacity={0}
          />
        </AreaChart>
      )}
    </>
  );
};
