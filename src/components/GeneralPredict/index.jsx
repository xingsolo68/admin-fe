import React from 'react';
import TopServicesChart from '../../components/TopServicesChart';
import { MonitorChart } from '../../components/MonitorChart';
import { StatusChart } from '../../components/StatusChart';
import UnusedServicesTable from '../../components/UnusedServicesTable';
import { Controller, useForm } from 'react-hook-form';

import { Typography, Divider, Space, Card, Select } from 'antd';
const { Text, Title } = Typography;

const GeneralPredict = () => {
  const { control, watch } = useForm({});
  const monitorChartHourRange = watch('monitorChartHourRange');

  return (
    <>
      <Title level={4}>General predict</Title>
      <Text>General charts for admin</Text>
      <Divider />
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Card title={<Title level={4}>Predict chart</Title>}>
          <PredictChart />
        </Card>
        <Divider />
        <Card title={<Title level={4}>Top services chart</Title>}>
          <TopServicesChart limit={4} />
        </Card>
        <Divider />

        <Card title={<Title level={4}>Unused services chart</Title>}>
          <UnusedServicesTable hourRange={4} />
        </Card>
        <Divider />
        <Card
          title={
            <>
              <Title level={4}>
                Monitor request threshold
                <Controller
                  name="monitorChartHourRange"
                  control={control}
                  rules={{
                    required: true
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      value={value}
                      onChange={onChange}
                      style={{ marginLeft: 10 }}
                      options={[
                        {
                          value: '2',
                          label: 'Past 2 hours'
                        },
                        {
                          value: '24',
                          label: 'Past 24 hours'
                        },
                        {
                          value: '48',
                          label: 'Past 48 hours'
                        }
                      ]}
                    />
                  )}
                />
              </Title>
            </>
          }>
          <MonitorChart
            hourRange={monitorChartHourRange}
            id={'f580878c-7f31-491d-bcdd-0e95b7985aa6'}
          />
        </Card>
        <Divider />
        <Card title={<Title level={4}>Status chart</Title>}>
          <StatusChart id="f580878c-7f31-491d-bcdd-0e95b7985aa6" />
        </Card>
        <Divider />
      </Space>
    </>
  );
};

export const PredictChart = () => {};

export default GeneralPredict;
