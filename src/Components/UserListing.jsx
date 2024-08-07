import React, { useEffect, useState } from 'react'
import { Button, message, Popconfirm, Space, Table } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import '../style/header.css';
import AddUser from './AddUser';
import axios from '../axios'
import EditUser from './EditUser';


const UserListing = () => {
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/users');
            setUsers(response.data.users);
        } catch (error) {
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/users/${id}`);
            message.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            message.error('Failed to delete user');
        }
    };

    const columns = [
        {
            title: "User ID",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "User Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "User Email",
            dataIndex: "email",
            key: "email"
        },
        {
            title: "User DOB",
            dataIndex: "dob",
            key: "dob",
            render: (_, record) => {
                return record.dob.split('T')[0];
            }
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size='small'>
                    <Button type='link' onClick={() => {setEditing(true); setEditUser(record.id)}}>
                        Edit
                    </Button>
                    <Popconfirm
                        title='Delete this user?'
                        onConfirm={() => handleDelete(record.id)}
                        okText='Yes'
                        cancelText='No'
                    >
                        <DeleteOutlined style={{ color: "red" }} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            <header className="header">
                <h1>GOQII Assesment</h1>
            </header>

            <div
                className='table-container'
                style={{
                    marginTop: "10vh",
                    textAlign: "center",
                    padding: "50px",
                    marginBottom: "1vh"
                }}>
                <Button
                    type='primary'
                    onClick={() => {
                        setVisible(true);
                    }}
                    style={{ float: "right" }}>
                    Add New User
                </Button>
                <h1>User Listing Table</h1>
                <Table
                    columns={columns}
                    dataSource={users}
                    bordered={true}
                    loading={loading}
                    scrollToFirstRowOnChange={true}
                    pagination={{ pageSize: 4, position: ["bottomCenter"] }}
                />
            </div>

            {visible && (
                <AddUser
                    showModal={visible}
                    closeModal={() => {
                        setVisible(false);
                        fetchUsers(); 
                    }}
                />
            )}
            {editing && (
                <EditUser
                    showModal={editing}
                    userId={editUser}
                    closeModal={() => {
                        setEditing(false);
                        fetchUsers();
                    }}
                    
                />
			)}
        </div>
    );
};

export default UserListing;