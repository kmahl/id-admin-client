import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { withRouter } from "react-router";
/* components */
import { Input, Button, Spin, Table, Modal, Form, DatePicker, Select, notification } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';

import Title from '../../components/title';
import Notification from '../../components/notification';

/* data */
import { TOKEN } from '../../query';
import { GET_CLIENTS, CREATE_CLIENT, UPDATE_CLIENT, DELETE_CLIENT } from '../../query/client';
import { getSubsidiaryId } from '../../query/subsidiary';

/* Time */
import moment from 'moment';
import 'moment-timezone';
/* config */
import { columns } from './tableConfig';

const { confirm } = Modal;

/* CLIENT COMPONENT */
const Client = ({ history }) => {
  const { data: { token }, client, loading: loadingToken, error: errorToken } = useQuery(TOKEN);
  const { subsidiaryId } = getSubsidiaryId();

  const { loading, error, data } = useQuery(GET_CLIENTS);

  const [spinning, setSpin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Nuevo cliente');
  const [newClient, setNewClient] = useState(true);

  const [createClient] = useMutation(CREATE_CLIENT, {
    refetchQueries: [{ query: GET_CLIENTS }],
  });
  const [updateClient] = useMutation(UPDATE_CLIENT, {
    refetchQueries: [{ query: GET_CLIENTS }],
  });
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    refetchQueries: [{ query: GET_CLIENTS }],
  });
  const [form] = Form.useForm();

  const { validateFields, setFieldsValue, resetFields } = form;

  useEffect(() => {
    if (!token) {
      history.push('/login');
    }
  }, []);

  /* TODO: dejar el spinner fullscreen */
  if (loading || loadingToken) return <div><Spin spinning={true}></Spin></div>;
  if (error) Notification(error.message, 'error');
  if (errorToken) Notification(errorToken.message, 'error');

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

  const saveClient = (e) => {
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
            birth_date: (values.birth_date && values.birth_date.format('YYYY-MM-DD')) || null,
            country: "Argentina",
            subsidiaryId,
          };
          let response;
          if (newClient) {
            response = await createClient({ variables });
            Notification(`Cliente ${response.data.createClient.name} guardado correctamente`, 'success');
          } else {
            response = await updateClient({ variables });
            Notification(`Cliente ${response.data.updateClient.name} actualizado correctamente`, 'success');

          }
          resetFields();
          setShowModal(false);
        } catch (error) {
          Notification(error.message, 'error');
        }
      });
    return setSpin(false);
  };

  const createNewClient = () => {
    setShowModal(true);
    setNewClient(true);
    setModalTitle('Nuevo cliente');
  };

  const editData = (data) => {
    setShowModal(true);
    setNewClient(false);
    setModalTitle('Editar cliente');
    const date = new Date(parseInt(data.birth_date));
    const birth_date = moment.utc(date).isValid() ? moment.utc(date, 'DD/MM/YYYY') : null;
    setFieldsValue({
      prefix: data.phone ? data.phone.slice(1, 3) : '54',
      name: data.name,
      email: data.email,
      phone: data.phone ? data.phone.slice(3, data.phone.length) : '',
      state: data.state,
      city: data.city,
      address: data.address,
      subsidiaryId,
      birth_date
    });
  };

  const deleteData = (item) => {
    confirm({
      title: `Quieres borrar el cliente: ${item.name}?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      async onOk() {
        try {
          const client = await deleteClient({ variables: { id: item.id } });
          Notification(`Cliente ${client.data.deleteClient.name} Eliminado`, 'warning');
        } catch (error) {
          Notification(error.message, 'error');
        };
      },
      onCancel() { },
    });
  };

  const closeModal = e => {
    setShowModal(false);
    resetFields();
  };


  return (
    <div className="client-section">
      <Spin spinning={spinning} >
        <div className="table-header client-header">
          <Title title="Lista de clientes"></Title>
          <Button type="primary" onClick={createNewClient}>Nuevo <PlusOutlined /></Button>
        </div>
        <Table /* rowSelection={rowSelection} */ dataSource={data && data.clients} columns={columns(editData, deleteData)} rowKey={record => record.id} />

        <Modal
          title={modalTitle}
          visible={showModal}
          onOk={(e) => { saveClient(e); }}
          okText="Guardar"
          cancelText="Cancelar"
          onCancel={closeModal}
          width="50%"
        >
          <Form
            form={form}
            onFinish={saveClient}
            layout="vertical"
            initialValues={{ prefix: '54' }}
          >
            <div className="group">
              {/* name */}
              <Form.Item
                label="Nombre completo"
                name="name"
                rules={[{ required: true, message: 'Completa el campo!', whitespace: true }]}
              >
                <Input />
              </Form.Item>

              {/* email */}
              <Form.Item
                label="Correo"
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <Input disabled={!newClient} />
              </Form.Item>
            </div>
            <div className="group">
              {/* phone */}
              <Form.Item
                label="Teléfono"
                name={'phone'}
              >
                <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
              </Form.Item>

              {/* birthdate */}
              <Form.Item
                name="birth_date"
                label="Cumpleaños"
              >
                <DatePicker format="DD/MM/YYYY" />
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
              <Button onClick={saveClient} htmlType="submit" style={{ display: 'none' }}></Button>
            </Form.Item>
          </Form>
        </Modal>
      </Spin>

    </div >
  );
};

export default withRouter(Client);