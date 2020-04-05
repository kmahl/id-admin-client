import React from 'react';
import { Divider } from 'antd';
import { EditFilled, DeleteFilled } from '@ant-design/icons';

import Moment from 'react-moment';
import 'moment-timezone';

const columns = (editEmployee, deleteEmployee) => {

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
      title: 'Color',
      dataIndex: 'color',
      render: color => <div className="color-row" style={{ backgroundColor: color, width: '16px' }}></div >
    },
    {
      title: 'Sucursal',
      dataIndex: ['subsidiary','name'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={(e) => editEmployee(record)} title="Editar"><EditFilled /></a>
          <Divider type="vertical" />
          <a onClick={(e) => deleteEmployee(record)} title="Eliminar"><DeleteFilled /></a>
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