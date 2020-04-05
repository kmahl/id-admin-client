import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { withRouter } from "react-router";

/* components */
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import esLocale from '@fullcalendar/core/locales/es';
import { Modal, Form, Input, Select, Spin, TimePicker, DatePicker } from 'antd';
import Notification from '../../components/notification';

/* DATA */
import { GET_EMPLOYEES, GET_EMPLOYEE } from '../../query/employee';
import { getToken } from '../../query';
import { GET_CLIENTS } from '../../query/client';

/* Time */
import moment from 'moment';
import { timeBlock } from '../service/tableConfig';


const Booking = ({ history }) => {
  const { token } = getToken();
  const calendarComponentRef = React.createRef();

  const { loading: loadingEmployees, error: errorEmployees, data: dataEmployees } = useQuery(GET_EMPLOYEES);
  const [getEmployee, { loading: loadingEmployee, error: errorEmployee, data: employeeData }] = useLazyQuery(GET_EMPLOYEE);
  const { loading: loadingClients, error: errorClients, data: dataClients } = useQuery(GET_CLIENTS);

  const [spinning, setSpin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Nuevo empleado');

  const [form] = Form.useForm();
  const { validateFields, setFieldsValue, resetFields } = form;

  useEffect(() => {
    if (!token) {
      history.push('/login');
    }
  }, []);

  useEffect(() => {
    // if (employeeData?.employee?.services.length > 0) {
    setFieldsValue({
      service: employeeData?.employee?.services[0]?.name || '',
      duration: employeeData?.employee?.services[0]?.duration.toString() || ''
    });

    //  }
  }, [employeeData]);

  /* TODO: dejar el spinner fullscreen */
  if (loadingEmployees || loadingClients) return <div><Spin spinning={true}></Spin></div>;
  if (errorEmployee) Notification(errorEmployee.message, 'error');
  if (errorClients) Notification(errorClients.message, 'error');
  if (errorEmployees) Notification(errorEmployees.message, 'error');


  const closeModal = e => {
    setShowModal(false);
    resetFields();
  };

  const events = [
    {
      start: '1900-01-01',
      end: moment().format("YYYY-MM-DD"),
      rendering: 'background',
      overlap: false,
      color: '#eee',
    },
    {
      id: 'a',
      title: 'Corte',
      start: moment().format(),
      end: moment().add(30 * 60 * 1000).format(),
      color: '#333',
      extendedProps: {
        nas: '2',
        test: 3323,
      }
    }
  ];
  // Funcion para controlar las acciones de los días
  const dateClick = date => {
    // Instancia de api
    const calendarApi = calendarComponentRef.current.getApi();
    // Bloqueo para días pasados
    if (date.date < moment().subtract(1, "days")) {
      return false;
    }
    // modal para agregar días
    if (calendarApi.view.type === 'timeGridDay') {
      console.log('\n', '===============================================', '\n');
      console.log('date');
      console.log(date);
      console.log('\n', '===============================================', '\n');
      const start = moment(date.date).isValid() ? moment(date.date, 'DD/MM/YYYY HH:mm') : null;
      const time = moment(date.date).format("HH:mm");
      console.log('\n', '===============================================', '\n');
      console.log('time');
      console.log(time);
      console.log('\n', '===============================================', '\n');
      setShowModal(true);
      setFieldsValue({
        employee: dataEmployees.allEmployees[0].name,
        start,
        time: start,
      });

      handleChangeEmployee(dataEmployees.allEmployees[0].id);
    } else {
      calendarApi.changeView('timeGridDay', date.dateStr);
    }
  };

  const eventClick = eventInfo => {
    console.log('\n', '===============================================', '\n');
    console.log('eventInfo.event');
    console.log(eventInfo.event);
    console.log('\n', '===============================================', '\n');
    setShowModal(true);
    // ACA SETEAR LOS QUE TRAE YA EL EVENTO
    setFieldsValue({
      employee: dataEmployees.allEmployees[0].name
    });
  };

  const handleChangeEmployee = (value) => {
    getEmployee({ variables: { id: value } });
  };

  const handleChangeService = (value) => {
    const duration = (employeeData?.employee?.services.find(serv => value === serv.id)).duration || '';
    setFieldsValue({
      duration: duration.toString(),
    });
    console.log('\n', '===============================================', '\n');
    console.log('duration');
    console.log(duration);
    console.log('\n', '===============================================', '\n');
  };

  const saveBooking = (e, isNew) => {
    e.preventDefault();
    setSpin(true);
    validateFields()
      .then(async (err, values) => {
        try {
          console.log('\n', '===============================================', '\n');
          console.log('values');
          console.log(values);
          console.log('\n', '===============================================', '\n');
          const variables = {
            ...values,

            start: (values.start && values.start.format('YYYY-MM-DD')) || null,

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
        } catch (error) {
          Notification(error.message, 'error');
        }
      });
    return setSpin(false);
  };

  return (<div className='booking-calendar'>
    <FullCalendar
      defaultView="dayGridMonth"
      locale={esLocale}
      aspectRatio="2.2"
      allDay="false"
      ref={calendarComponentRef}
      header={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek', // timeGridWeek
      }}
      allDaySlot={false}
      slotLabelFormat={e => `${e.date.hour}:${e.date.minute <= 9 ? `0${e.date.minute}` : e.date.minute}`}

      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      dateClick={dateClick}
      events={events}
      eventClick={eventClick}
    />
    <Modal
      title={modalTitle}
      visible={showModal}
      onOk={(e) => saveBooking(e, true)}
      okText="Guardar"
      cancelText="Cancelar"
      onCancel={closeModal}
      width="50%"
    >
      <Form
      /* onFinish={saveEmployee} */
      >
        <div className="group">

          {/* client */}
          <Form.Item
            label="Cliente"
            name="client"
            rules={[{ required: true, message: 'Completa el campo', whitespace: true }]}
          >
            <Select
              onChange={handleChangeEmployee}
            >
              {dataClients.clients.map(client => <Select.Option key={client.id} value={client.id}>{client.name}</Select.Option>)}
            </Select>
          </Form.Item>

          {/* employees */}
          <Form.Item
            label="Profesional"
            name="employee"
            rules={[{ required: true, message: 'Completa el campo', whitespace: true }]}
          >
            {dataEmployees.allEmployees ?
              <Select
                onChange={handleChangeEmployee}
              >
                {dataEmployees.allEmployees.map(employee => <Select.Option key={employee.id} value={employee.id}>{employee.name}</Select.Option>)}
              </Select> : <span className="alert-empty">Agrege Profesionales <a onClick={() => history.push('./employee')}>Aqui!</a></span>}
          </Form.Item>

        </div>
        <div className="group">
          {/* service */}
          <Form.Item
            label="Servicio"
            name="service"
            rules={[{ required: true, message: 'Completa el campo', whitespace: true }]}
          >
            <Select
              onChange={handleChangeService}
            >
              {employeeData?.employee?.services.map(employee => <Select.Option key={employee.id} value={employee.id}>{employee.name}</Select.Option>)}
            </Select>
          </Form.Item>

          {/* duration */}
          <Form.Item
            label="Duración (hhmm)"
            name="duration"
            rules={[{ required: true, message: 'Completa el campo', whitespace: true }]}
          >
            <Select disabled>
              {timeBlock.map(time => <Select.Option key={time.value} value={time.value}>{time.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </div>
        <div className="group">
          {/* Fecha */}
          <Form.Item
            label="Fecha"
            name="start"
            rules={[{ required: true, message: 'Completa el campo' }]}
          >
            <DatePicker showToday={false} showTime={{ format: 'HH:mm', minuteStep: 30, defaultValue: moment('00:00:00', 'HH:mm') }} format="DD/MM/YYYY HH:mm" />
          </Form.Item>

          {/* Hora */}
          <Form.Item
            label="Hora"
            name="time"
            rules={[{ required: true, message: 'Completa el campo' }]}
          >
            <TimePicker minuteStep={30} format='HH:mm' />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  </div>)
    ;
};

export default withRouter(Booking);