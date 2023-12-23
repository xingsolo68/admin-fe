import React from 'react';
import { useParams } from 'react-router-dom';
import { StatusChart } from '../../components/StatusChart';
import { MonitorChart } from '../../components/MonitorChart';
import { PredictChart } from '../../components/PredictChart';

export function ServicePage() {
  const { id } = useParams();

  return (
    <div className="">
      <StatusChart id={id} />
      <MonitorChart id={id} />
      <PredictChart id={id} />
    </div>
  );
}
