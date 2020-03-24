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
import { GET_SERVICES, CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE } from '../../query/service';
/* config */
import { columns, timeBlock } from './tableConfig';


/* SERVICE COMPONENT */
const Service = ({ history, form }) => {
  const { token } = getToken();

  const { loading: loadingService, error: errorService, data } = useQuery(GET_SERVICES);

  const [spinning, setSpin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Nuevo servicio');
  const [newService, setNewService] = useState(true);

  const [createService] = useMutation(CREATE_SERVICE, {
    refetchQueries: [{ query: GET_SERVICES }],
  });
  const [updateService] = useMutation(UPDATE_SERVICE, {
    refetchQueries: [{ query: GET_SERVICES }],
  });
  const [deleteService] = useMutation(DELETE_SERVICE, {
    refetchQueries: [{ query: GET_SERVICES }],
  });

  const { getFieldDecorator, validateFields, setFieldsValue, resetFields } = form;

  useEffect(() => {
    if (!token) {
      history.push('/login');
    }
  }, []);

  /* TODO: dejar el spinner fullscreen */
  if (loadingService) return <div><Spin spinning={true}></Spin></div>;
  if (errorService) Notification(errorService.message, 'error');

  const saveService = (e, isNew) => {
    e.preventDefault();
    setSpin(true);
    validateFields(async (err, values) => {
      try {
        if (!err) {
          let response;
          const variables = {
            ...values,
            cost: parseFloat(values.cost),
            duration: parseInt(values.duration)
          };
          if (isNew) {
            response = await createService({ variables });
            Notification(`Servicio ${response.data.createService.name} guardado correctamente`, 'success');
          } else {
            response = await updateService({ variables });
            Notification(`Servicio ${response.data.updateService.name} actualizado correctamente`, 'success');

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

  const createNewService = () => {
    setShowModal(true);
    setNewService(true);
    setModalTitle('Nuevo servicio');
  };

  const editData = (data) => {
    setShowModal(true);
    setNewService(false);
    setModalTitle('Editar servicio');
    setFieldsValue({
      name: data.name,
      cost: data.cost.toString(),
      duration: data.duration.toString(),
    });
  };

  const deleteData = (item) => {
    confirm({
      title: `Quieres borrar el servicio: ${item.name}?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      async onOk() {
        try {
          const service = await deleteService({ variables: { id: item.id } });
          Notification(`Servicio ${service.data.deleteService.name} Eliminado`, 'warning');
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
    <div className="service-section">
      <Spin spinning={spinning} >
        <div className="table-header service-header">
          <Title title="Lista de Servicios"></Title>
          <Button type="primary" onClick={createNewService}>Nuevo <Icon type="plus" /></Button>
        </div>
        <Table /* rowSelection={rowSelection} */ dataSource={data.services} columns={columns(editData, deleteData)} rowKey={record => record.id} />

        <Modal
          title={modalTitle}
          visible={showModal}
          onOk={(e) => { saveService(e, newService); }}
          okText="Guardar"
          cancelText="Cancelar"
          onCancel={closeModal}
          width="50%"
        >
          <Form onSubmit={saveService}>
            <div className="group">
              {/* name */}
              <Form.Item
                label="Nombre"
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: 'Completa el campo!', whitespace: true }],
                })(<Input />)}
              </Form.Item>
              {/* cost */}
              <Form.Item
                label="Costo"
              >
                {getFieldDecorator('cost', {
                  rules: [{ required: true, message: 'Completa el campo!', whitespace: true }],
                })(<Input prefix="$" />)}
              </Form.Item>
              {/* duration */}
              <Form.Item label="Duración (hhmm)">
                {getFieldDecorator('duration', {
                  rules: [{ required: true, message: 'Completa el campo', whitespace: true }],
                })
                  (<Select>
                    {timeBlock.map(time => <Select.Option key={time.value} value={time.value}>{time.name}</Select.Option>)}
                  </Select>)}
              </Form.Item>
            </div>
            <Form.Item>
              <Button onClick={saveService} htmlType="submit" style={{ display: 'none' }}></Button>
            </Form.Item>
          </Form>
        </Modal>
      </Spin>
    </div >
  );
};

export default Form.create({ name: 'modal-service-form' })(withRouter(Service));