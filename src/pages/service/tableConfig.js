import React from 'react';
import { Icon, Divider } from 'antd';
import Moment from 'react-moment';
import 'moment-timezone';

const timeBlock = [
  {
    value: '30',
    name: '30m'
  },
  {
    value: '60',
    name: '1h'
  },
  {
    value: '90',
    name: '1h30m'
  },
  {
    value: '120',
    name: '2h'
  },
  {
    value: '150',
    name: '2h30m'
  },
];

const columns = (editService, deleteService) => {

  return [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'id'
    },
    {
      title: 'Costo',
      dataIndex: 'cost',
      render: (text) => (`$ ${text}`)
    },
    {
      title: 'Duración',
      dataIndex: 'duration',
      render: (text, record) => ((timeBlock.find(z => z.value === text.toString())).name)
    },
    {
      title: 'Profesionales',
      dataIndex: 'employees',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={(e) => editService(record)} title="Editar"><Icon type="edit" theme="filled" /></a>
          <Divider type="vertical" />
          <a onClick={(e) => deleteService(record)} title="Eliminar"><Icon type="delete" theme="filled" /></a>
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
  timeBlock,
  rowSelection,
};