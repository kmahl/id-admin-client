import React from 'react';
import { Icon, Divider } from 'antd';
import Moment from 'react-moment';
import 'moment-timezone';

const columns = (editClient, deleteClient) => {

  return [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'id'
    },
    {
      title: 'Correo',
      dataIndex: 'email',
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
    },
    {
      title: 'Fecha de Nacimiento',
      dataIndex: 'birth_date',
      render: date => date && parseInt(date) ? <Moment utc format="DD/MM/YYYY">{parseInt(date)}</Moment> : '-',
    },
    {
      title: 'Sucursal',
      dataIndex: 'subsidiary.name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={(e) => editClient(record)} title="Editar"><Icon type="edit" theme="filled" /></a>
          <Divider type="vertical" />
          <a onClick={(e) => deleteClient(record)} title="Eliminar"><Icon type="delete" theme="filled" /></a>
        </span>
      ),
    },
  ];
};

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};

export {
  columns,
  rowSelection,
};