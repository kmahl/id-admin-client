import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { withRouter } from "react-router";
/* components */
import { Icon, Input, Button, Spin, Table, Modal, Form, DatePicker, Select, notification } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

import Title from '../../components/title';
import Notification from '../../components/notification';

/* data */
import { getToken } from '../../query';
import { GET_CLIENTS, CREATE_CLIENT, UPDATE_CLIENT, DELETE_CLIENT } from '../../query/client';
import { GET_SUBSIDIARY_NAMES } from '../../query/subsidiary';
/* Time */
import moment from 'moment';
import 'moment-timezone';
/* config */
import { columns } from './tableConfig';


/* CLIENT COMPONENT */
const Client = ({ history, form }) => {
  const { token } = getToken();

  const { loading, error, data } = useQuery(GET_CLIENTS);
  const { loading: loadingSubsidiary, error: errorSubsidiary, data: dataSubsidiary } = useQuery(GET_SUBSIDIARY_NAMES);

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

  const { getFieldDecorator, validateFields, setFieldsValue, setFields, resetFields } = form;

  useEffect(() => {
    if (!token) {
      history.push('/login');
    }
  }, []);

  /* TODO: dejar el spinner fullscreen */
  if (loading || loadingSubsidiary) return <div><Spin spinning={true}></Spin></div>;
  if (error) Notification(error.message, 'error');
  if (errorSubsidiary) Notification(errorSubsidiary.message, 'error');

  const prefixSelector = getFieldDecorator('prefix', {
    initialValue: '54',
  })(
    <Select style={{ width: 70 }}>
      <Select.Option value="54">+54</Select.Option>
      <Select.Option value="58">+58</Select.Option>

    </Select>,
  );

  const saveClient = (e, isNew) => {
    e.preventDefault();
    setSpin(true);
    validateFields(async (err, values) => {
      try {
        if (!err) {
          const variables = {
            ...values,
            city: values.city || null,
            state: values.state || null,
            phone: (values.phone && `+${values.prefix}${values.phone}`) || null,
            birth_date: (values.birth_date && values.birth_date.format('YYYY-MM-DD')) || null,
            country: "Argentina",
          };
          let response;
          if (isNew) {
            response = await createClient({ variables });
            Notification(`Cliente ${response.data.createClient.name} guardado correctamente`, 'success');
          } else {
            response = await updateClient({ variables });
            Notification(`Cliente ${response.data.updateClient.name} actualizado correctamente`, 'success');

          }
          resetFields();
          setShowModal(false);
        }
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
      subsidiaryId: data.subsidiary.id,
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
          <Button type="primary" onClick={createNewClient}>Nuevo <Icon type="plus" /></Button>
        </div>
        <Table /* rowSelection={rowSelection} */ dataSource={data.clients} columns={columns(editData, deleteData)} rowKey={record => record.id} />

        <Modal
          title={modalTitle}
          visible={showModal}
          onOk={(e) => { saveClient(e, newClient); }}
          okText="Guardar"
          cancelText="Cancelar"
          onCancel={closeModal}
          width="50%"
        >
          <Form onSubmit={saveClient}>
            <div className="group">
              {/* name */}
              <Form.Item
                label="Nombre completo"
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Completa el campo!', whitespace: true }],
                })(<Input />)}
              </Form.Item>
              {/* email */}
              <Form.Item label="Correo">
                {getFieldDecorator('email', {
                  rules: [
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                    {
                      required: true,
                      message: 'Please input your E-mail!',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </div>
            <div className="group">
              {/* phone */}
              <Form.Item label="Teléfono">
                {getFieldDecorator('phone', {
                })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
              </Form.Item>
              {/* birthdate */}
              <Form.Item label="Cumpleaños">
                {getFieldDecorator('birth_date', {
                })(<DatePicker format="DD/MM/YYYY" />)}
              </Form.Item>
            </div>
            <div className="group">
              {/* state */}
              <Form.Item
                label="Provincia"
              >
                {getFieldDecorator('state')(<Input />)}
              </Form.Item>
              {/* ciudad */}
              <Form.Item
                label="Localidad/Barrio"
              >
                {getFieldDecorator('city', {
                })(<Input />)}
              </Form.Item>
            </div>
            <div className="group">
              {/* address */}
              <Form.Item
                label="Dirección"
              >
                {getFieldDecorator('address', {
                  rules: [{ required: true, message: 'Completa el campo!', whitespace: true }],
                })(<Input />)}
              </Form.Item>
              {/* subsidiary */}
              <Form.Item label="Sucursal">
                {getFieldDecorator('subsidiaryId', {
                  rules: [{ required: true, message: 'Completa el campo!', whitespace: true }],
                })
                  (dataSubsidiary.subsidiaries ?
                    <Select>
                      {dataSubsidiary.subsidiaries.map(subsidiary => <Select.Option key={subsidiary.id} value={subsidiary.id}>{subsidiary.name}</Select.Option>)}
                    </Select> : <span className="alert-empty">Agrege Sucursales <a onClick={() => history.push('./subsidiary')}>Aqui!</a></span>)}
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

export default Form.create({ name: 'modal-client-form' })(withRouter(Client));