import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button, Card, Form, Input, Layout, Typography, Alert } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';
import {AxiosError} from "axios";

const { Content } = Layout;
const { Title } = Typography;

type LoginFormValues = {
    username: string;
    password: string;
};

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('')
    const { login } = useAuth();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormValues>({
        defaultValues: {
            username: '',
            password: ''
        }
    });

    const onSubmit = async (values: LoginFormValues) => {
        try {
            const tokenData = await loginUser(values);
            login(tokenData.access_token);
            navigate('/');
        } catch (err) {
           const error = err as AxiosError<{message: string}>
            if (error.response) {
                if (error.response.data && typeof error.response.data === 'object') {
                    const responseData = error.response.data as { message?: string };

                    if (responseData.message) {
                        setError(responseData.message);
                    } else {
                        setError(`Server error: ${error.response.status}`);
                    }
                }
            }
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Content style={{ maxWidth: 400, width: '100%' }}>
                <Card style={{marginTop: 120}}>
                    <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Bot Dashboard</Title>

                    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                        <Form.Item
                            label="Username"
                            validateStatus={errors.username ? 'error' : ''}
                            help={errors.username?.message}
                        >
                            <Controller
                                name="username"
                                control={control}
                                rules={{
                                    required: 'Username is required',
                                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                                }}
                                render={({ field }) => (
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Enter your username"
                                        {...field}
                                    />
                                )}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            validateStatus={errors.password ? 'error' : ''}
                            help={errors.password?.message}
                        >
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                }}
                                render={({ field }) => (
                                    <Input.Password
                                        prefix={<LockOutlined />}
                                        placeholder="Enter your password"
                                        {...field}
                                    />
                                )}
                            />
                        </Form.Item>

                        {error && (
                            <Form.Item>
                                <Alert
                                    message={error}
                                    type="error"
                                    showIcon
                                    style={{ marginBottom: 16 }}
                                />
                            </Form.Item>
                        )}

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting}
                                block
                            >
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </Layout>
    );
};
