import React, { useEffect, useState } from "react";
import { Button, Form, Input, DatePicker, Modal, message } from "antd";
import axios from '../axios';
import { UserOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from "dayjs";

const EditUser = ({ showModal, closeModal, userId }) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchSingleUser = async () => {
            try {
                const response = await axios.get('/users/' + userId);
                setUser(response.data.user);
                form.setFieldsValue({
                    ...response.data.user,
                    dob: response.data.user.dob ? dayjs(response.data.user.dob) : null,
                });
                console.log("response.data.user", response.data.user);
            } catch (error) {
                message.error('Failed to fetch user');
            }
        };

        fetchSingleUser();
    }, [userId, form]);

    const handleDateChange = (date, dateString) => {
        setUser({ ...user, dob: dateString });
    };

    const handleOk = async () => {
        setConfirmLoading(true);
        try {
            // Update user
            await axios.put(`/users/${userId}`, user);
            message.success('User updated successfully');
            closeModal();
        } catch (error) {
            message.error('Failed to save user');
        } finally {
            setConfirmLoading(false);
        }
    };

    const onFinish = (values) => {
        const updatedUser = {
            ...values,
            dob: user.dob
        };
        setUser(updatedUser);
        handleOk();
    };

    if (!user) {
        return null;
    }

    return (
        <Modal
            title='Edit User'
            open={showModal}
            centered
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={closeModal}
            footer={[
                <Button key='cancel' onClick={closeModal}>
                    Cancel
                </Button>,
                <Button
                    key='submit'
                    type='primary'
                    htmlType='submit'
                    loading={confirmLoading}
                    onClick={() => form.submit()}>
                    Submit
                </Button>
            ]}
        >
            <Form
                form={form}
                name='editUser'
                style={{ padding: "2vmax", width: "100%" }}
                onFinish={onFinish}
                initialValues={{
                    name: user.name,
                    email: user.email,
                    dob: user.dob ? dayjs(user.dob) : null
                }}
            >
                <Form.Item
                    name='name'
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    rules={[
                        {
                            required: true,
                            message: "Enter User Name!"
                        },
                        {
                            min: 2,
                            max: 100,
                            message: "User Name must be minimum of 2 characters."
                        }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined style={{ marginRight: "10px" }} />}
                        placeholder='Enter your name'
                    />
                </Form.Item>
                <Form.Item
                    name='email'
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    rules={[
                        {
                            required: true,
                            type: "email",
                            message: "The input is not valid E-mail!"
                        }
                    ]}
                >
                    <Input
                        prefix={<MailOutlined style={{ marginRight: "10px" }} />}
                        placeholder='Enter your email address'
                    />
                </Form.Item>
                <Form.Item
                    name="dob"
                    value={user.dob}
                    onChange={(e) => setUser({ ...user, dob: e.target.value })}
                    rules={[
                        {
                            required: true,
                            message: 'Please select your date of birth!',
                        },
                    ]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder="Select your date of birth"
                        format="YYYY-MM-DD"
                        suffixIcon={<CalendarOutlined />}
                        onChange={handleDateChange}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditUser;
