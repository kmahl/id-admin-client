import React from 'react';
import { Icon, Divider } from 'antd';
import Moment from 'react-moment';
import 'moment-timezone';

const columns = (editSubsidiary, deleteSubsidiary) => {

  return [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'id'
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
    },
    {
      title: 'Provincia',
      dataIndex: 'state',
    },
    {
      title: 'Localidad',
      dataIndex: 'city',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={(e) => editSubsidiary(record)} title="Editar"><Icon type="edit" theme="filled" /></a>
          {/*         <Divider type="vertical" />
        <a onClick={(e) => deleteSubsiduary(record)} title="Eliminar"><Icon type="delete" theme="filled" /></a> */}
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