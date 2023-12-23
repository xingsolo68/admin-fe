import { Table } from 'antd';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id'
  },
  {
    title: 'Name',
    key: 'name',
    render: (_, record) => <Link to={`${record.id}`}>{record.name}</Link>
  },
  {
    title: 'Protocol',
    dataIndex: 'protocol',
    key: 'protocol'
  },
  {
    title: 'Port',
    dataIndex: 'port',
    key: 'port'
  }
];

export function ServiceListPage() {
  const { data, isLoading } = useQuery('services', async () => {
    return (await axios.get('http://127.0.0.1:5000/services')).data;
  });

  if (isLoading) return <div>Loading</div>;

  return <Table columns={columns} dataSource={data} />;
}
