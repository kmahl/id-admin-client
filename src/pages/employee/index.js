import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { withRouter } from "react-router";
/* components */
import { Icon, Input, Button, Spin, Table, Modal, Form, DatePicker, Select, Checkbox } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Title from '../../components/title';
import Notification from '../../components/notification';
import { colors, ColorRow } from '../../components/colorSelector';

/* data */
import { TOKEN } from '../../query';
import { GET_EMPLOYEES, CREATE_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE } from '../../query/employee';
import { getSubsidiaryId } from '../../query/subsidiary';

/* Time */
import moment from 'moment';
import 'moment-timezone';
/* config */
import { columns } from './tableConfig';
import { GET_SERVICES } from '../../query/service';

const { confirm } = Modal;

/* employee COMPONENT */
const employee = ({ history }) => {
  const { data: { token }, client, loading: loadingToken, error: errorToken } = useQuery(TOKEN);
  const { subsidiaryId } = getSubsidiaryId();

  const { loading, error, data } = useQuery(GET_EMPLOYEES);
  const { loading: loadingService, error: errorService, data: dataService } = useQuery(GET_SERVICES);

  const [spinning, setSpin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Nuevo empleado');
  const [newEmployee, setNewEmployee] = useState(true);

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });
  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
  });

  const [form] = Form.useForm();
  const { validateFields, setFieldsValue, resetFields } = form;

  useEffect(() => {
    if (!token) {
      history.push('/login');
    }
  }, []);

  /* TODO: dejar el spinner fullscreen */
  if (loading || loadingService || loadingToken) return <div><Spin spinning={true}></Spin></div>;
  if (error) Notification(error.message, 'error');
  if (errorService) Notification(errorService.message, 'error');
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

  const saveEmployee = (e) => {
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
          if (newEmployee) {
            response = await createEmployee({ variables });
            Notification(`Empleado ${response.data.createEmployee.name} guardado correctamente`, 'success');
          } else {
            response = await updateEmployee({ variables });
            Notification(`Empleado ${response.data.updateEmployee.name} actualizado correctamente`, 'success');

          }
          resetFields();
          setShowModal(false);
        } catch (error) {

          Notification(error.message, 'error');
        }
      });
    return setSpin(false);
  };

  const createNewEmployee = () => {
    setShowModal(true);
    setNewEmployee(true);
    setModalTitle('Nuevo empleado');
  };

  const editData = (data) => {
    setShowModal(true);
    setNewEmployee(false);
    setModalTitle('Editar empleado');
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
      color: data.color,
      birth_date,
      services: data.services.map(service => service.id),
    });
  };

  const deleteData = (item) => {
    confirm({
      title: `Quieres borrar el empleado: ${item.name}?`,
      icon: <ExclamationCircleOutlined />,
      content: '',
      async onOk() {
        try {
          const employee = await deleteEmployee({ variables: { id: item.id } });
          Notification(`Empleado ${employee.data.deleteEmployee.name} Eliminado`, 'warning');
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

  function onChange(checkedValues) {
    console.log('checked = ', checkedValues);
  }

  return (
    <div className="employee-section">
      <Spin spinning={spinning} >
        <div className="table-header employee-header">
          <Title title="Lista de empleados"></Title>
          <Button type="primary" onClick={createNewEmployee}>Nuevo <PlusOutlined /></Button>
        </div>
        <Table /* rowSelection={rowSelection} */ dataSource={data && data.allEmployees} columns={columns(editData, deleteData)} rowKey={record => record.id} />

        <Modal
          title={modalTitle}
          visible={showModal}
          onOk={(e) => { saveEmployee(e); }}
          okText="Guardar"
          cancelText="Cancelar"
          onCancel={closeModal}
          width="50%"
        >
          <Form
            onFinish={saveEmployee}
            form={form}
            layout="vertical"
            initialValues={{ prefix: '54' }}
          >
            <div className="group">
              {/* name */}
              <Form.Item
                label="Nombre completo"
                name="name"
                rules={[{ required: true, message: 'Completa el campo', whitespace: true }]}
              >
                <Input disabled={!newEmployee} />
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
                <Input />
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
              {/* birthdate */}
              <Form.Item
                label="Cumpleaños"
                name="birth_date"
                rules={[{ required: true, message: 'Completa el campo' }]}
              >
                <DatePicker format="DD/MM/YYYY" />
              </Form.Item>
              {/* Color */}
              <Form.Item
                name="color"
                label="Color"
                style={{ width: '70%' }}
                rules={[{ required: true, message: 'Completa el campo', whitespace: true }]}
              >
                <Select className="color-selector">
                  {colors.map(color =>
                    <Select.Option key={color.value} value={color.value}>
                      <ColorRow color={color} />
                    </Select.Option>)}
                </Select >
              </Form.Item>
            </div>
            <div className="group">
              {/* state */}
              <Form.Item
                name="state"
                label="Provincia"
              >
                <Input />
              </Form.Item>
              {/* ciudad */}
              <Form.Item
                name="city"
                label="Localidad/Barrio"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="group">
              {/* address */}
              <Form.Item
                label="Dirección"
                name="address"
                rules={[{ required: true, message: 'Completa el campo', whitespace: true }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="group">
              {/* services */}
              <Form.Item
                label="Agrega o quita los servicios que realiza el profesional"
                name="services"
              >
                <Checkbox.Group
                  options={dataService && dataService.services.map(service => ({
                    label: service.name,
                    value: service.id
                  }))}
                  onChange={onChange} />
              </Form.Item>
            </div>
            <Form.Item>
              <Button onClick={saveEmployee} htmlType="submit" style={{ display: 'none' }}></Button>
            </Form.Item>
          </Form>
        </Modal>
      </Spin>

    </div >
  );
};

export default withRouter(employee);