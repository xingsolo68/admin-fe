import {
  Form,
  Checkbox,
  Input,
  InputNumber,
  Button,
  Typography,
  message,
  Select,
  Divider,
  Space
} from 'antd';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import JSONPretty from 'react-json-pretty';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useMockRequestData } from '../../hooks/useMockRequestData';
import { chain, isEmpty, map, toArray, values } from 'lodash';

export function MockRequestForm() {
  const { id: mockRequestID } = useParams();
  const { isLoading, data: mockRequestData, isError } = useMockRequestData(mockRequestID);
  console.log(mockRequestData);

  const HTTPVERBS = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const {
    isLoading: serviceLoading,
    error: serviceError,
    data: serviceData
  } = useQuery('services', async () => {
    return (await axios.get('http://127.0.0.1:5000/services')).data;
  });

  const {
    isLoading: routeLoading,
    error: routeError,
    data: routeData
  } = useQuery('routes', async () => {
    return (await axios.get('http://127.0.0.1:5000/routes')).data;
  });

  const [messageApi, messageContext] = message.useMessage();
  const { control, handleSubmit, reset, watch, setValue } = useForm({});
  const { TextArea } = Input;
  const { Text, Title } = Typography;
  const {
    fields: headerFields,
    append: headerAppend,
    remove: headerRemove
  } = useFieldArray({
    control,
    name: 'metadata.headers'
  });
  const {
    fields: queryFields,
    append: queryAppend,
    remove: queryRemove
  } = useFieldArray({
    control,
    name: 'metadata.queries'
  });

  const [shouldRenderJsonBox, setShouldRenderJsonBox] = useState(false);
  const serviceField = watch('info.serviceId');
  const watchIsJsonBody = watch('metadata.isJsonBody');
  const watchIsDisplay = watch('metadata.isDisplay');
  const watchTextbox = watch('metadata.body');
  const watchMethod = watch('info.method');
  const watchIsRepetitive = watch('metadata.distribution.isRepetitive');
  const watchDistType = watch('info.distType');

  const eligibleRoutes = routeData?.filter((route) => route.serviceId === serviceField)?.[0] || [];
  const eligiblePaths = eligibleRoutes?.['paths'] || [];
  const eligibleMethods =
    eligibleRoutes?.['methods']?.map((method) => method.toUpperCase()) || HTTPVERBS;

  const checkJsonConstraints = (data) => {
    let canParse = true;
    try {
      JSON.stringify(JSON.parse(data));
    } catch (e) {
      canParse = false;
    }
    return canParse;
  };

  useEffect(() => {
    if (mockRequestID) {
      reset({
        ...mockRequestData,
        metadata: {
          ...mockRequestData?.metadata,
          headers: map(mockRequestData?.metadata?.headers, (value, key) => ({ key, value })),
          queries: map(mockRequestData?.metadata?.queries, (value, key) => ({ key, value }))
        }
      });
    }
  }, [mockRequestData, mockRequestID, reset]);

  useEffect(() => {
    const shouldShow = watchIsJsonBody && watchIsDisplay;
    const canParse = checkJsonConstraints(watchTextbox);
    if (shouldShow && !canParse) {
      messageApi.error('Bad json format');
      setValue('isDisplay', false);
    } else if (!watchIsJsonBody && watchIsDisplay) {
      messageApi.warning('Only support prettifying JSON');
      setValue('isDisplay', false);
    }
    setShouldRenderJsonBox(shouldShow && canParse);
  }, [watchIsJsonBody, watchIsDisplay]);

  const createTitle = (input, level = 3) => (
    <Typography>
      <Title level={level}>{input}</Title>
    </Typography>
  );
  const createText = (input, level = 3) => (
    <Typography style={{ marginBottom: 4 }}>
      <Text level={level}>{input}</Text>
    </Typography>
  );

  const onSubmit = async (data) => {
    const unravel = (input, keyName, valueName, initial = {}) => {
      if (isEmpty(input)) return null;
      return input.reduce((acc, item) => {
        acc[item?.[keyName]] = item?.[valueName];
        return acc;
      }, initial);
    };

    const newData = {
      ...data
    };

    newData['metadata']['headers'] = chain(newData['metadata']['headers'])
      .keyBy('key')
      .mapValues('value')
      .value();
    newData['metadata']['queries'] = chain(newData['metadata']['queries'])
      .keyBy('key')
      .mapValues('value')
      .value();
    newData['metadata']['paramString'] = newData['metadata']['paramString']
      ? newData['metadata']['paramString']
      : '/';

    console.log('metadata');

    const canParse = checkJsonConstraints(newData['metadata']['body']);
    if (watchIsJsonBody) {
      if (canParse) {
        newData['metadata']['body'] = JSON.parse(newData['metadata']['body']);
      } else {
        messageApi.error('Bad JSON format, unable to process');
        return;
      }
    }
    try {
      let response;
      if (mockRequestID) {
        response = await axios.put(`http://127.0.0.1:5000/mock/${mockRequestID}`, newData);
      } else {
        response = await axios.post('http://127.0.0.1:5000/mock', newData);
      }

      console.log(response);

      console.log('Submitting data to server:', newData);
      messageApi.success('Mock request successfully created');
    } catch (error) {
      console.log('===============================Error', error);
    }
  };

  return (
    <>
      {messageContext}
      <Form
        id="mockRequestForm"
        onFinish={handleSubmit(onSubmit)}
        style={{ marginRight: 128, marginLeft: 16 }}>
        {createTitle('Request info')}
        {createText('Name of mock request')}
        <Form.Item>
          <Controller
            name="info.name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input value={value} onChange={onChange} placeholder="Name of mock request"></Input>
            )}
          />
        </Form.Item>
        {createText('Service')}
        <Form.Item>
          <Controller
            name="info.serviceId"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, value } }) => (
              <Select
                loading={serviceLoading}
                value={value}
                onChange={onChange}
                options={
                  serviceLoading
                    ? []
                    : serviceData.map((service) => {
                        return { value: service.id, label: `${service.name} (${service.id})` };
                      })
                }
              />
            )}
          />
        </Form.Item>
        {createText('Service path')}
        <Form.Item>
          <Controller
            name="info.route"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, value } }) => (
              <Select
                loading={routeLoading}
                disabled={!serviceField}
                value={value}
                onChange={onChange}
                options={
                  !serviceField
                    ? []
                    : eligiblePaths.map((path) => {
                        return { label: path, value: path };
                      })
                }
              />
            )}
          />
        </Form.Item>
        {createText('Method')}
        <Form.Item>
          <Controller
            name="info.method"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, value } }) => (
              <Select
                loading={routeLoading}
                disabled={!serviceField}
                value={value}
                onChange={onChange}
                options={
                  !serviceField
                    ? []
                    : eligibleMethods.map((method) => {
                        return { label: method, value: method };
                      })
                }
              />
            )}
          />
        </Form.Item>
        {createText('Query string')}
        <Form.Item>
          {queryFields.map((item, index) => {
            return (
              <li key={item.id} style={{ margin: '4px 0' }}>
                <Space.Compact style={{ width: 360 }}>
                  <Controller
                    name={`metadata.queries.${index}.key`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        style={{ width: '50%' }}
                        value={value}
                        onChange={onChange}
                        placeholder="Key"
                        required={true}
                      />
                    )}
                  />
                  <Controller
                    name={`metadata.queries.${index}.value`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        style={{ width: '50%' }}
                        value={value}
                        onChange={onChange}
                        placeholder="Value"
                        required={true}
                      />
                    )}
                  />
                </Space.Compact>
                <Button
                  type="primary"
                  onClick={() => queryRemove(index)}
                  style={{ marginLeft: 10 }}>
                  Delete
                </Button>
              </li>
            );
          })}

          <Button
            type="primary"
            onClick={() => {
              queryAppend({ key: '', value: '' });
            }}>
            Append
          </Button>
        </Form.Item>

        {createText('Request path')}
        <Form.Item>
          <Controller
            name="metadata.paramString"
            defaultValue="/"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                // style={{ width: '50%' }}
                value={value}
                onChange={onChange}
                placeholder="/something"
              />
            )}
          />
        </Form.Item>
        <Divider></Divider>
        {createTitle('Distribution style')}
        {createText('Dist. type')}
        <Form.Item>
          <Controller
            defaultValue="even"
            control={control}
            rules={{
              required: true
            }}
            render={({ field: { onChange, value } }) => (
              <Select
                value={value}
                onChange={onChange}
                options={[
                  { label: 'Even', value: 'even' },
                  { label: 'Gauss', value: 'gauss' }
                ]}
              />
            )}
            name="info.distType"
          />
        </Form.Item>
        {watchDistType === 'even' && (
          <Form.Item label={createText('No. of requests')} name="noOfRequest">
            <Controller
              defaultValue={1}
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, value } }) => (
                <InputNumber value={value} onChange={onChange} />
              )}
              name="metadata.distribution.noOfRequest"
            />
          </Form.Item>
        )}
        {watchDistType === 'gauss' && (
          <Form.Item label={createText('Mean')} name="mean">
            <Controller
              defaultValue={1}
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, value } }) => (
                <InputNumber value={value} onChange={onChange} />
              )}
              name="metadata.distribution.mean"
            />
          </Form.Item>
        )}

        {watchDistType === 'gauss' && (
          <Form.Item label={createText('Standard deviation')} name="stddev">
            <Controller
              defaultValue={1}
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, value } }) => (
                <InputNumber value={value} onChange={onChange} />
              )}
              name="metadata.distribution.stddev"
            />
          </Form.Item>
        )}

        {watchDistType === 'even' && (
          <Form.Item
            label={createText('Is repetitive?')}
            name="metadata.distribution.isRepetitive"
            valuePropName="checked">
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox checked={value} defaultChecked={false} onChange={onChange} />
              )}
              name="metadata.distribution.isRepetitive"
            />
          </Form.Item>
        )}

        <Form.Item label={createText('Interval (milisecond)')} name="interval">
          <Controller
            defaultValue={2000}
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputNumber
                disabled={!watchIsRepetitive && watchDistType === 'even'}
                min={0}
                value={value}
                onChange={onChange}
              />
            )}
            name="metadata.distribution.interval"
          />
        </Form.Item>

        {watchDistType === 'even' && (
          <Form.Item label={createText('Request interval (milisecond)')} name="requestInterval">
            <Controller
              defaultValue={2001}
              control={control}
              render={({ field: { onChange, value } }) => (
                <InputNumber value={value} onChange={onChange} />
              )}
              name="metadata.distribution.requestInterval"
            />
          </Form.Item>
        )}

        {watchDistType === 'gauss' && (
          <Form.Item label={createText('Max range')} name="maxRange">
            <Controller
              defaultValue={0}
              control={control}
              render={({ field: { onChange, value } }) => (
                <InputNumber value={value} onChange={onChange} />
              )}
              name="metadata.distribution.maxRange"
            />
          </Form.Item>
        )}
        <Divider></Divider>
        {createTitle('Headers')}
        <Form.Item>
          {headerFields.map((item, index) => {
            return (
              <li key={item.id} style={{ margin: '4px 0' }}>
                <Space.Compact style={{ width: 360 }}>
                  <Controller
                    name={`metadata.headers.${index}.key`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        style={{ width: '50%' }}
                        value={value}
                        onChange={onChange}
                        placeholder="Key"
                        required={true}
                      />
                    )}
                  />
                  <Controller
                    name={`metadata.headers.${index}.value`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        style={{ width: '50%' }}
                        value={value}
                        onChange={onChange}
                        placeholder="Value"
                        required={true}
                      />
                    )}
                  />
                </Space.Compact>
                <Button
                  type="primary"
                  onClick={() => headerRemove(index)}
                  style={{ marginLeft: 10 }}>
                  Delete
                </Button>
              </li>
            );
          })}

          <Button
            type="primary"
            onClick={() => {
              headerAppend({ key: '', value: '' });
            }}>
            Append
          </Button>
        </Form.Item>
        <Divider></Divider>
        {createTitle('Body')}
        <Form.Item>
          <Controller
            name="metadata.body"
            control={control}
            render={({ field: { onChange, value } }) =>
              shouldRenderJsonBox ? (
                <JSONPretty
                  style={{ maxHeight: '196px', overflow: 'auto' }}
                  data={value}
                  space={4}
                />
              ) : (
                <TextArea
                  style={{ width: '40%', margin: '0 8px' }}
                  onChange={onChange}
                  showCount={true}
                  disabled={['GET', 'HEAD'].includes(watchMethod)}
                  maxLength={6000}
                  autoSize={{ minRows: 3, maxRows: 12 }}
                  value={value}
                  size="large"
                />
              )
            }
          />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                disabled={['GET', 'HEAD'].includes(watchMethod)}
                checked={value}
                defaultChecked={false}
                onChange={onChange}>
                Is JSON data?
              </Checkbox>
            )}
            name="metadata.isJsonBody"
          />
          <Controller
            control={control}
            name="metadata.isDisplay"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                disabled={['GET', 'HEAD'].includes(watchMethod)}
                checked={value}
                defaultChecked={false}
                onChange={onChange}>
                Display content (JSON only)
              </Checkbox>
            )}
          />
        </Form.Item>
        <Divider></Divider>
        <Form.Item>
          <Button id="mockRequestForm" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
