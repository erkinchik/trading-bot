import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Button, Card, Layout, Space, Table, Typography} from 'antd';
import { ArrowLeftOutlined, LogoutOutlined } from '@ant-design/icons';

import { fetchStats } from '../api';
import { useAuth } from '../context/AuthContext';
import { BotStatisticData } from '../types/apiTypes';

const { Content } = Layout;
const { Title, Text } = Typography;

const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<BotStatisticData[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout, token} = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStats(token);
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load stats:', err);
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const totalProfit = stats.reduce((sum, item) => sum + item.profit_usdt, 0);
  const totalDeposit = stats.reduce((sum, item) => sum + item.deposit_usdt, 0);
  const totalPercentage = (totalProfit / totalDeposit) * 100;

  const columns = [
    {
      title: 'Bot Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Cycles Completed',
      dataIndex: 'cycles_completed',
      key: 'cycles_completed',
    },
    {
      title: 'Deposit (USDT)',
      dataIndex: 'deposit_usdt',
      key: 'deposit_usdt',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      title: 'Profit (USDT)',
      dataIndex: 'profit_usdt',
      key: 'profit_usdt',
      render: (value: number) => (
          <Text type={value >= 0 ? 'success' : 'danger'}>
            ${value.toFixed(2)}
          </Text>
      )
    },
    {
      title: 'ROI',
      dataIndex: 'profit_percentage',
      key: 'profit_percentage',
      render: (value: number) => (
          <Text type={value >= 0 ? 'success' : 'danger'}>
            {value.toFixed(2)}%
          </Text>
      )
    }
  ];

  return (
      <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <Title level={2} style={{ margin: 0 }}>Bots Statistics</Title>
              <Space>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/')}
                >
                  Back to Bots
                </Button>
                <Button
                    danger
                    icon={<LogoutOutlined />}
                    onClick={logout}
                >
                  Logout
                </Button>
              </Space>
            </div>

            <Table
                dataSource={stats}
                columns={columns}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}>
                        <Text strong>Total</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} />
                      <Table.Summary.Cell index={2} />
                      <Table.Summary.Cell index={3}>
                        <Text strong>${totalDeposit.toFixed(2)}</Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>
                        <Text strong type={totalProfit >= 0 ? 'success' : 'danger'}>
                          ${totalProfit.toFixed(2)}
                        </Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={5}>
                        <Text strong type={totalPercentage >= 0 ? 'success' : 'danger'}>
                          {totalPercentage.toFixed(2)}%
                        </Text>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />
          </Card>
        </Content>
      </Layout>
  );
};

export default StatsPage;
