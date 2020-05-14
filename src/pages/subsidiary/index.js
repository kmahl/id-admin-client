import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { withRouter } from "react-router";
/* components */
import { Icon, Input, Button, Spin, Table, Modal, Form, DatePicker, Select, notification } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';

import Title from '../../components/title';
import Notification from '../../components/notification';

/* data */
import { TOKEN } from '../../query';
import { GET_SUBSIDIARIES, CREATE_SUBSIDIARY, UPDATE_SUBSIDIARY, DELETE_SUBSIDIARY } from '../../query/subsidiary';
/* config */
import { columns } from './tableConfig';

const { confirm } = Modal;

/* SUBSIDIARY COMPONENT */
const Subsidiary = ({ history }) => {
  const { data: { token }, client, loading, error } = useQuery(TOKEN);

  const [form] = Form.useForm();

  const { loading: loadingSubsidiary, error: errorSubsidiary, data } = useQuery(GET_SUBSIDIARIES);

  const [spinning, setSpin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Nueva sucursal');
  const [newSubsidiary, setNewSubsidiary] = useState(true);

  const [createSubsidiary] = useMutation(CREATE_SUBSIDIARY, {
    refetchQueries: [{ query: GET_SUBSIDIARIES }],
  });
  const [updateSubsidiary] = useMutation(UPDATE_SUBSIDIARY, {
    refetchQueries: [{ query: GET_SUBSIDIARIES }],
  });
  const [deleteSubsidiary] = useMutation(DELETE_SUBSIDIARY, {
    refetchQueries: [{ query: GET_SUBSIDIARIES }],
  });

  const { validateFields, setFieldsValue, resetFields } = form;


  if (!token) {
    history.push('/login');
  }


  /* TODO: dejar el spinner fullscreen */
  if (loadingSubsidiary) return <div><Spin spinning={true}></Spin></div>;
  if (errorSubsidiary) Notification(errorSubsidiary.message, 'error');

  const prefixSelector = (
    <Form.Item
      name={'prefix'}
      noStyle
    >
      <Select style={{ width: '70' }}>
        <Select.Option value="54">+54</Select.Option>
        <Select.Option value="58">+58</Select.Option>
      </Select>
    </Form.Item>
  );

  const saveSubsidiary = (e) => {
    e.preventDefault();
    setSpin(true);
    validateFields()
      .then(async (values) => {
        try {
          const variables = {
            ...values,
            city: values.city || null,
            state: values.state || null,
            phone: (values.phone && `+${values.prefix}${values.phone}`) || null,
            country: "Argentina",
          };
          let response;
          if (newSubsidiary) {
            response = await createSubsidiary({ variables });
            Notification(`Sucursal ${response.data.createSubsidiary.name} guardado correctamente`, 'success');
          } else {
            response = await updateSubsidiary({ variables });
            Notification(`Sucursal ${response.data.updateSubsidiary.name} actualizado correctamente`, 'success');

          }
          resetFields();
          setShowModal(false);
        } catch (error) {
          Notification(error.message, 'error');
        }
      });
    return setSpin(false);
  };

  const createNewSubsidiary = () => {
    setShowModal(true);
    setNewSubsidiary(true);
    setModalTitle('Nueva sucursal');
  };

  const editData = (data) => {
    setShowModal(true);
    setNewSubsidiary(false);
    setModalTitle('Editar Sucursal');
    setFieldsValue({
      prefix: data.phone ? data.phone.slice(1, 3) : '54',
      name: data.name,
      phone: data.phone ? data.phone.slice(3, data.phone.length) : '',
      state: data.state,
      city: data.city,
      address: data.address,
    });
  };

  const deleteData = (item) => {
    /*     confirm({
          title: `Quieres borrar la  ${item.name}?`,
          icon: <ExclamationCircleOutlined />,
          content: '',
          async onOk() {
            try {
              const subsidiary = await deletesubsidiary({ variables: { id: item.id } });
              Notification(`Usuario ${subsidiary.data.deletesubsidiary.name} Eliminado`, 'warning');
            } catch (error) {
              Notification(error.message, 'error');
            };
          },
          onCancel() { },
        }); */
  };

  const closeModal = e => {
    setShowModal(false);
    resetFields();
  };

  return (
    <div className="subsidiary-section">
      <Spin spinning={spinning} >
        <div className="table-header subsidiary-header">
          <Title title="Lista de Sucursales"></Title>
          <Button type="primary" onClick={createNewSubsidiary}>Nuevo <PlusOutlined /></Button>
        </div>
        <Table /* rowSelection={rowSelection} */ dataSource={data && data.subsidiaries} columns={columns(editData, deleteData)} rowKey={record => record.id} />

        <Modal
          title={modalTitle}
          visible={showModal}
          onOk={(e) => { saveSubsidiary(e); }}
          okText="Guardar"
          cancelText="Cancelar"
          onCancel={closeModal}
          width="50%"
        >
          <Form
            onFinish={saveSubsidiary}
            form={form}
            layout="vertical"
            initialValues={{ prefix: '54' }}
          >
            <div className="group">
              {/* name */}
              <Form.Item
                label="Nombre"
                name="name"
                rules={[{ required: true, message: 'Completa el campo!', whitespace: true }]}
              >
                <Input disabled={!newSubsidiary} />
              </Form.Item>
            </div>
            <div className="group">
              {/* phone */}
              <Form.Item
                label="Teléfono"
                name="phone"
              >
                <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
              </Form.Item>
            </div>
            <div className="group">
              {/* state */}
              <Form.Item
                label="Provincia"
                name="state"
              >
                <Input />
              </Form.Item>
              {/* ciudad */}
              <Form.Item
                label="Localidad/Barrio"
                name="city"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="group">
              {/* address */}
              <Form.Item
                label="Dirección"
                name="address"
                rules={[{ required: true, message: 'Completa el campo!', whitespace: true }]}
              >
                <Input />
              </Form.Item>
            </div>
            <Form.Item>
              <Button onClick={saveSubsidiary} htmlType="submit" style={{ display: 'none' }}></Button>
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </div>
  );
};

export default withRouter(Subsidiary);