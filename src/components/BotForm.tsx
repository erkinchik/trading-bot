import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Form, Input, InputNumber, Space } from 'antd';
import { BotCreateRequest, BotUpdateRequest } from '../types/apiTypes';

type BotFormValues = BotCreateRequest | BotUpdateRequest;

interface BotFormProps {
    onSubmit: (data: BotFormValues) => void;
    initialValues: BotFormValues;
    isEditMode?: boolean;
    isSubmitting?: boolean;
}

export const BotForm: React.FC<BotFormProps> = ({onSubmit, initialValues, isEditMode = false, isSubmitting = false}) => {
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<BotFormValues>({
        defaultValues: initialValues
    });

    const validatePositive = (value: number) => value > 0 || 'Must be greater than 0';
    const validateGridLength = (value: number) =>
        (value > 0 && value < 100) || 'Must be between 0 and 100';

    return (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Form.Item
                label="Bot Name"
                validateStatus={errors.name ? 'error' : ''}
                help={errors.name?.message}
            >
                <Controller
                    name="name"
                    control={control}
                    rules={{
                        required: 'Name is required',
                        minLength: {
                            value: 3,
                            message: 'Name must be at least 3 characters'
                        }
                    }}
                    render={({ field }) => (
                        <Input
                            placeholder="Enter bot name"
                            {...field}
                        />
                    )}
                />
            </Form.Item>

            <Form.Item
                label="Trading Pair"
                validateStatus={errors.symbol ? 'error' : ''}
                help={errors.symbol?.message}
            >
                <Controller
                    name="symbol"
                    control={control}
                    rules={{
                        required: 'Symbol is required',
                        minLength: {
                            value: 4,
                            message: 'Symbol must be at least 4 characters'
                        },
                        pattern: {
                            value: /^[A-Z]{6,8}$/,
                            message: 'Should be like BTCUSDT (6-8 uppercase letters)'
                        }
                    }}
                    render={({ field }) => (
                        <Input
                            placeholder="e.g., BTCUSDT"
                            {...field}
                        />
                    )}
                />
            </Form.Item>

            <Space style={{ width: '100%' }}>
                <Form.Item
                    label="Deposit (USDT)"
                    validateStatus={errors.deposit ? 'error' : ''}
                    help={errors.deposit?.message}
                    style={{ flex: 1 }}
                >
                    <Controller
                        name="deposit"
                        control={control}
                        rules={{
                            required: 'Deposit is required',
                            validate: validatePositive
                        }}
                        render={({ field }) => (
                            <InputNumber
                                min={1}
                                step={100}
                                style={{ width: '100%' }}
                                {...field}
                                onChange={(value) => field.onChange(value)}
                                value={field.value}
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label="Profit Target (%)"
                    validateStatus={errors.profit_percentage ? 'error' : ''}
                    help={errors.profit_percentage?.message}
                    style={{ flex: 1 }}
                >
                    <Controller
                        name="profit_percentage"
                        control={control}
                        rules={{
                            required: 'Profit target is required',
                            validate: validatePositive
                        }}
                        render={({ field }) => (
                            <InputNumber
                                min={0.01}
                                step={0.1}
                                style={{ width: '100%' }}
                                {...field}
                                onChange={(value) => field.onChange(value)}
                                value={field.value}
                            />
                        )}
                    />
                </Form.Item>
            </Space>

            <Space style={{ width: '100%' }}>
                <Form.Item
                    label="Number of Orders"
                    validateStatus={errors.num_orders ? 'error' : ''}
                    help={errors.num_orders?.message}
                    style={{ flex: 1 }}
                >
                    <Controller
                        name="num_orders"
                        control={control}
                        rules={{
                            required: 'Number of orders is required',
                            validate: (value) =>
                                (Number.isInteger(value) && value > 0) ||
                                'Must be a positive integer'
                        }}
                        render={({ field }) => (
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                {...field}
                                onChange={(value) => field.onChange(value)}
                                value={field.value}
                            />
                        )}
                    />
                </Form.Item>

                <Form.Item
                    label="Grid Size (%)"
                    validateStatus={errors.grid_length ? 'error' : ''}
                    help={errors.grid_length?.message}
                    style={{ flex: 1 }}
                >
                    <Controller
                        name="grid_length"
                        control={control}
                        rules={{
                            required: 'Grid size is required',
                            validate: validateGridLength
                        }}
                        render={({ field }) => (
                            <InputNumber
                                min={0.1}
                                max={99.9}
                                step={0.5}
                                style={{ width: '100%' }}
                                {...field}
                                onChange={(value) => field.onChange(value)}
                                value={field.value}
                            />
                        )}
                    />
                </Form.Item>
            </Space>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    block
                >
                    {isEditMode ? 'Update Bot' : 'Create Bot'}
                </Button>
            </Form.Item>
        </Form>
    );
};
