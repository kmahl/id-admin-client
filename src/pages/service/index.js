import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { withRouter } from "react-router";
/* components */
import { Icon, Input, Button, Spin, Table, Modal, Form, Select } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';

import Title from '../../components/title';
import Notification from '../../components/notification';

/* data */
import { TOKEN } from '../../query';
import { GET_SERVICES, CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE } from '../../query/service';
/* config */
import { columns, timeBlock } from './tableConfig';

const { confirm } = Modal;

/* SERVICE COMPONENT */
const Service = ({ history }) => {
  const { data: { token } } = useQuery(TOKEN);

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

  const [form] = Form.useForm();
  const { validateFields, setFieldsValue, resetFields } = form;


  if (!token) {
    history.push('/login');
  }


  /* TODO: dejar el spinner fullscreen */
  if (loadingService) return <div><Spin spinning={true}></Spin></div>;
  if (errorService) Notification(errorService.message, 'error');

  const saveService = (e) => {
    e.preventDefault();
    setSpin(true);
    validateFields()
      .then(async (values) => {
        try {
          let response;
          const variables = {
            ...values,
            cost: parseFloat(values.cost),
            duration: parseInt(values.duration)
          };
          if (newService) {
            response = await createService({ variables });
            Notification(`Servicio ${response.data.createService.name} guardado correctamente`, 'success');
          } else {
            response = await updateService({ variables });
            Notification(`Servicio ${response.data.updateService.name} actualizado correctamente`, 'success');

          }
          resetFields();
          setShowModal(false);
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
          <Button type="primary" onClick={createNewService}>Nuevo <PlusOutlined /></Button>
        </div>
        <Table /* rowSelection={rowSelection} */ dataSource={data && data.services} columns={columns(editData, deleteData)} rowKey={record => record.id} />

        <Modal
          title={modalTitle}
          visible={showModal}
          onOk={(e) => { saveService(e); }}
          okText="Guardar"
          cancelText="Cancelar"
          onCancel={closeModal}
          width="50%"
        >
          <Form
            onFinish={saveService}
            form={form}
            layout="vertical"
          >
            <div className="group">
              {/* name */}
              <Form.Item
                label="Nombre"
                name="name"
                rules={[{ required: true, message: 'Completa el campo!', whitespace: true }]}
              >
                <Input disabled={!newService} />
              </Form.Item>

              {/* cost */}
              <Form.Item
                label="Costo"
                name="cost"
                rules={[{ required: true, message: 'Completa el campo!', whitespace: true }]}
              >
                <Input prefix="$" />

              </Form.Item>
              {/* duration */}
              <Form.Item
                label="Duración (hhmm)"
                name="duration"
                rules={[{ required: true, message: 'Completa el campo', whitespace: true }]}
              >
                <Select>
                  {timeBlock.map(time => <Select.Option key={time.value} value={time.value}>{time.name}</Select.Option>)}
                </Select>
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

export default withRouter(Service);