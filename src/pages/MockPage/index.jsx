import { React } from 'react';
import { Button, Layout, Typography, theme } from 'antd';
import { MockRequestTable } from '../../components/MockRequestTable';
import { Link } from 'react-router-dom';

export function MockPage() {
  const {
    token: { colorBgContainer }
  } = theme.useToken();
  return (
    <Layout style={{ colorBgContainer }}>
      <Link to="/form">
        <Button>
          <Typography level={3}>Create new mock request</Typography>
        </Button>
      </Link>
      <MockRequestTable />
    </Layout>
  );
}
