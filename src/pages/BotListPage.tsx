import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Layout, Modal, Space, Table, Tag, Typography } from 'antd';
import { PlusOutlined, LineChartOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';
import { createBot, fetchBots, updateBot } from '../api';
import { useAuth } from '../context/AuthContext';
import { BotCreateRequest, BotData, BotUpdateRequest } from '../types/apiTypes';
import { BotForm } from "../components/BotForm";

const { Content } = Layout;
const { Title } = Typography;

export const BotListPage: React.FC = () => {
    const navigate = useNavigate();
    const { logout, token } = useAuth();
    const [bots, setBots] = useState<BotData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [currentBot, setCurrentBot] = useState<BotData | null>(null);

    useEffect(() => {
        const loadBots = async () => {
            try {
                setLoading(true);
                const data = await fetchBots(token);
                setBots(data);
            } catch (err) {
                console.error('Failed to load bots:', err);
                setError('Failed to load bots');
            } finally {
                setLoading(false);
            }
        };
        loadBots();
    }, [token]);

    const handleCreateSubmit = async (formData: BotCreateRequest) => {
        try {
            setFormSubmitting(true);
            await createBot(formData, token);
            const updatedBots = await fetchBots(token);
            setBots(updatedBots);
            setIsCreateModalOpen(false);
            setError('');
        } catch (err) {
            console.error('Failed to create bot:', err);
            setError('Failed to create bot');
        } finally {
            setFormSubmitting(false);
        }
    };

    const handleEditSubmit = async (formData: BotUpdateRequest) => {
        if (!currentBot) return;

        try {
            setFormSubmitting(true);
            const updateData = { ...formData, id: currentBot.id };
            await updateBot(updateData, token);
            const updatedBots = await fetchBots(token);
            setBots(updatedBots);
            setIsEditModalOpen(false);
            setError('');
        } catch (err) {
            console.error('Failed to update bot:', err);
            setError('Failed to update bot');
        } finally {
            setFormSubmitting(false);
        }
    };

    const showCreateModal = () => {
        setIsCreateModalOpen(true);
        setError('');
    };

    const showEditModal = (bot: BotData) => {
        setCurrentBot(bot);
        setIsEditModalOpen(true);
        setError('');
    };

    const handleCreateCancel = () => {
        setIsCreateModalOpen(false);
        setError('');
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setCurrentBot(null);
        setError('');
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = status === 'ACTIVE' ? 'green' :
                    status === 'PAUSE' ? 'orange' : 'red';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
        },
        {
            title: 'Deposit',
            dataIndex: 'deposit',
            key: 'deposit',
            render: (deposit: number) => `$${deposit.toFixed(2)}`
        },
        {
            title: 'Profit Target',
            dataIndex: 'profit_percentage',
            key: 'profit_percentage',
            render: (percentage: number) => `${percentage}%`
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: BotData) => (
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showEditModal(record)}
                    >
                        Edit
                    </Button>
            )
        }
    ];

    return (
        <>
            <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                            <Title level={2} style={{ margin: 0 }}>Trading Bots</Title>
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={showCreateModal}
                                >
                                    New Bot
                                </Button>
                                <Button
                                    icon={<LineChartOutlined />}
                                    onClick={() => navigate('/stats')}
                                >
                                    View Stats
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

                        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

                        <Table
                            dataSource={bots}
                            columns={columns}
                            loading={loading}
                            rowKey="id"
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </Content>
            </Layout>

            <Modal
                title="Create New Bot"
                open={isCreateModalOpen}
                onCancel={handleCreateCancel}
                footer={null}
            >
                {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
                <BotForm
                    onSubmit={handleCreateSubmit}
                    isSubmitting={formSubmitting}
                    initialValues={{
                        name: '',
                        symbol: 'BTCUSDT',
                        deposit: 1000,
                        profit_percentage: 0.5,
                        num_orders: 10,
                        grid_length: 5
                    }}
                />
            </Modal>

            <Modal
                title={`Edit Bot: ${currentBot?.name || ''}`}
                open={isEditModalOpen}
                onCancel={handleEditCancel}
                footer={null}
            >
                {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
                {currentBot && (
                    <BotForm
                        // @ts-ignore
                        onSubmit={handleEditSubmit}
                        isSubmitting={formSubmitting}
                        isEditMode={true}
                        initialValues={{
                            name: currentBot.name,
                            symbol: currentBot.symbol,
                            deposit: currentBot.deposit,
                            profit_percentage: currentBot.profit_percentage,
                            num_orders: currentBot.num_orders,
                            grid_length: currentBot.grid_length
                        }}
                    />
                )}
            </Modal>
        </>
    );
};
