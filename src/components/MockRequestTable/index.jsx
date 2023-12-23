import { React } from 'react';
import { Table, Space, Typography, Button } from 'antd';
import { useQuery, useMutation } from 'react-query';
import { useQueryClient } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

const { Text } = Typography;
export function MockRequestTable() {
  const queryClient = useQueryClient();
  // react-query
  const { isLoading, data } = useQuery('mockRequestRecords', async () => {
    return await axios
      .get('http://127.0.0.1:5000/mock')
      .then((output) => {
        const newRecords = Object.values(output.data).map((record) => {
          const newRecord = {};
          Object.entries(record).forEach(([key, value]) => {
            let newValue = value;
            if (newValue != null) {
              let valueKeys = Object.keys(newValue);
              if (valueKeys.includes('Valid')) {
                valueKeys.pop('Valid');
                newValue = newValue[valueKeys[0]];
              }
            }
            newRecord[key] = newValue;
          });
          newRecord['key'] = newRecord['id'];
          return newRecord;
        });
        return newRecords;
      })
      .catch((err) => {
        console.log('ERR', err);
      });
  });

  console.log('============================data', data);
  async function handleChangeStatus(status, id) {
    let newStatus;
    switch (status) {
      case 'created':
      case 'stopped':
        newStatus = 'running';
        break;
      case 'running':
        newStatus = 'stopped';
        break;
      default:
        break;
    }

    const response = await axios.patch(
      'http://127.0.0.1:5000/mock/routine/' + id,
      {},
      {
        params: { status: newStatus }
      }
    );

    // -================================= cai cu
    return response?.data;
  }

  const statusMutation = useMutation({
    mutationFn: ({ status, id }) => {
      handleChangeStatus(status, id);
    },
    onSuccess: () => {
      // ✅ refetch the comments list for our blog post
      queryClient.invalidateQueries({ queryKey: ['mockRequestRecords'] });
    }
  });

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (left, right) => left.id < right.id,
      width: '10%',
      align: 'left',
      render: (id) => <Link to={`/form/${id}`}>{id}</Link>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left'
    },
    {
      title: 'Service ID',
      dataIndex: 'serviceId',
      key: 'serviceId',
      align: 'left'
    },
    {
      title: 'Service name',
      dataIndex: 'serviceName',
      key: 'serviceName',
      align: 'left'
    },
    {
      title: 'Route',
      dataIndex: 'route',
      key: 'route',
      align: 'left'
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      align: 'left'
    },
    {
      title: 'Dist. style',
      dataIndex: 'distType',
      key: 'distType',
      align: 'left',
      render: (data) => <Text>{data.toUpperCase()}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'left',
      render: (status, data) => {
        const id = data['id'];
        let actionText;
        switch (status) {
          case 'stopped':
            actionText = 'Run';
            break;
          case 'running':
            actionText = 'Stop';
            break;
          case 'created':
            actionText = 'Run';
            break;
          default:
        }
        return (
          <Space size="middle">
            <Text>{status}</Text>
            <Button
              size="small"
              type="primary"
              onClick={async () => {
                console.log('=== Mutate', status, id);
                await statusMutation.mutateAsync({ status, id });
              }}>
              {actionText}
            </Button>
          </Space>
        );
      }
    }
  ];
  return <Table loading={isLoading} dataSource={data} columns={columns} />;
}
