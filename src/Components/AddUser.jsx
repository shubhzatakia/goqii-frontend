import React from 'react'
import { useState } from "react";
import {
	Button,
	Form,
	Input,
    DatePicker,
	Modal,
    message
} from "antd";
import axios from '../axios'

import { UserOutlined, MailOutlined, CalendarOutlined, EyeOutlined, EyeInvisibleOutlined, LockOutlined } from '@ant-design/icons';

const AddUser = ({ showModal, closeModal, user }) => {
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [values, setValues] = useState({
        name: "",
        password: "",
        email: "",
        dob: null
    });

    const handleDateChange = (date, dateString) => {
        setValues({ ...values, dob: dateString });
      };

    const handleOk = async () => {
        setConfirmLoading(true);
        try { 
            // Create new user
            await axios.post('/users', values);
            message.success('User added successfully');

            closeModal();
        } catch (error) {
            message.error('Failed to save user');
        } finally {
            setConfirmLoading(false);
        }
    };

    const onFinish = (values) => {
        setValues(values);
        handleOk();
    };

    return (
        <Modal
            title='Add User'
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
                    onClick={handleOk}>
                    Submit
                </Button>
            ]}
        >
            <Form
                name='addUser'
                style={{ padding: "2vmax", width: "100%" }}
                onFinish={onFinish}
                initialValues={user ? user : {}} // Set initial values if editing
            >
                <Form.Item
                    name='name'
                    value={values.name}
                    onChange={(e) => setValues({ ...values, name: e.target.value })}
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
                    ]}>
                    <Input
                        prefix={<UserOutlined style={{ marginRight: "10px" }} />}
                        placeholder='Enter your name'
                    />
                </Form.Item>
                <Form.Item
                    name='password'
                    value={values.password}
                    onChange={(e) => setValues({ ...values, password: e.target.value })}
                    rules={[
                        {
                            required: true,
                            message: "Enter User Password!"
                        },
                        {
                            min: 5,
                            max: 20,
                            message: "Password must be minimum of 5 characters."
                        }
                    ]}>
                    <Input.Password
                        prefix={<LockOutlined style={{ marginRight: "10px" }} />}
                        placeholder='Enter your password'
                        iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                    />
                </Form.Item>
                <Form.Item
                    name='email'
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                    rules={[
                        {
                            required: true,
                            type: "email",
                            message: "The input is not valid E-mail!"
                        }
                    ]}>
                    <Input
                        prefix={<MailOutlined style={{ marginRight: "10px" }} />}
                        placeholder='Enter your email address'
                    />
                </Form.Item>
                <Form.Item
                    name="dob"
                    
                    rules={[
                        {
                            required: true,
                            message: 'Please select your date of birth!',
                        },
                    ]}
                >
                    <DatePicker
                        onChange={handleDateChange}
                        style={{ width: '100%' }}
                        placeholder="Select your date of birth"
                        format="YYYY-MM-DD"
                        suffixIcon={<CalendarOutlined />}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddUser;