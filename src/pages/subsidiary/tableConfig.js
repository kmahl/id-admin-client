import React from 'react';
import { Divider } from 'antd';
import { EditFilled, DeleteFilled} from '@ant-design/icons';
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
          <a onClick={(e) => editSubsidiary(record)} title="Editar"><EditFilled /></a>
          {/*         <Divider type="vertical" />
        <a onClick={(e) => deleteSubsiduary(record)} title="Eliminar"><DeleteFilled /></a> */}
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