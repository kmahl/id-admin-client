import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { withRouter } from "react-router";

/* components */
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import esLocale from '@fullcalendar/core/locales/es';
import { Modal, Form, Select, Spin, DatePicker } from 'antd';
import Notification from '../../components/notification';

/* DATA */
import { GET_BOOKINGS, CREATE_BOOKING, UPDATE_BOOKING, DELETE_BOOKING } from '../../query/booking';
import { GET_EMPLOYEES, GET_EMPLOYEE } from '../../query/employee';
import { TOKEN, CURRENT_USER } from '../../query';
import { GET_CLIENTS } from '../../query/client';
import { GET_SUBSIDIARY_ID } from '../../query/subsidiary';

/* Time */
import moment from 'moment';
import { timeBlock } from '../service/tableConfig';

const formatEvents = (events = []) => {
  const _events = events.map(event => {
    return ({
      id: event.id,
      title: `${event.client.name}, ${event.service.name} con ${event.employee.name}`,
      start: moment(event.start, "x").format("YYYY-MM-DD HH:mm"),
      end: moment(event.start, "x").add(event.duration * 60 * 1000).format("YYYY-MM-DD HH:mm"),
      color: event.employee.color,
      extendedProps: {
        ...event
      }
    });
  });
  _events.push({
    start: '1900-01-01',
    end: moment().format("YYYY-MM-DD"),
    rendering: 'background',
    overlap: false,
    color: '#eee',
  });

  return _events;
};

const Booking = ({ history }) => {
  const { data: { token } } = useQuery(TOKEN);
  const { data: user } = useQuery(CURRENT_USER);

  const { data: { subsidiaryId }, loading: loadingSubsidiaryId, error: errorSubsidiaryId } = useQuery(GET_SUBSIDIARY_ID);

  const calendarComponentRef = React.createRef();
  const { loading: loadingBookings, error: errorBookings, data: dataBookings } = useQuery(GET_BOOKINGS);

  const { loading: loadingEmployees, error: errorEmployees, data: dataEmployees } = useQuery(GET_EMPLOYEES);
  const [getEmployee, { loading: loadingEmployee, error: errorEmployee, data: employeeData }] = useLazyQuery(GET_EMPLOYEE);
  const { loading: loadingClients, error: errorClients, data: dataClients } = useQuery(GET_CLIENTS);

  const [spinning, setSpin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Nueva reserva');
  const [bookingId, setBookingId] = useState(null);

  const [createBooking] = useMutation(CREATE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS }],
  });
  const [updateBooking] = useMutation(UPDATE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS }],
  });
  const [deleteBooking] = useMutation(DELETE_BOOKING, {
    refetchQueries: [{ query: GET_BOOKINGS }],
  });

  const [form] = Form.useForm();
  const { validateFields, setFieldsValue, resetFields } = form;


  if (!token) {
    history.push('/login');
  }


  /*   useEffect(() => {
      if (showModal) {
        console.log('\n', '===============================================', '\n');
        console.log('dataEmployees.allEmployees[0].id');
        console.log(dataEmployees.allEmployees[0].id);
        console.log('\n', '===============================================', '\n');
        setFieldsValue({
          employee: dataEmployees.allEmployees[0].id,
        });
      }
    }, [showModal]); */
  useEffect(() => {
    // if (employeeData?.employee?.services.length > 0) {
    setTimeout(function () {
      setFieldsValue({
        serviceId: employeeData?.employee?.services[0]?.id || '',
        duration: employeeData?.employee?.services[0]?.duration.toString() || ''
      });
    }, 0);

    //  }
  }, [employeeData]);

  /* TODO: dejar el spinner fullscreen */
  if (loadingEmployees || loadingClients || loadingBookings || loadingSubsidiaryId || loadingEmployee) return <div><Spin spinning={true}></Spin></div>;
  if (errorEmployee) Notification(errorEmployee.message, 'error');
  if (errorBookings) Notification(errorBookings.message, 'error');
  if (errorClients) Notification(errorClients.message, 'error');
  if (errorEmployees) Notification(errorEmployees.message, 'error');
  if (errorSubsidiaryId) Notification(errorSubsidiaryId.message, 'error');

  const closeModal = e => {
    setShowModal(false);
    resetFields();
  };

  // Funcion para controlar las acciones de los días
  const dateClick = date => {
    // Instancia de api
    const calendarApi = calendarComponentRef.current.getApi();
    // Bloqueo para días pasados
    if (date.date < moment().subtract(1, "days")) {
      return false;
    }
    // modal para agendar evento
    if (calendarApi.view.type === 'timeGridDay') {
      const start = moment(date.date).isValid() ? moment(date.date, 'DD/MM/YYYY HH:mm') : null;
      // const time = moment(date.date).format("HH:mm");
      setShowModal(true);
      setBookingId(null);
      setFieldsValue({
        start
      });
    } else {
      calendarApi.changeView('timeGridDay', date.dateStr);
    }
  };



  const eventClick = eventInfo => {

    setShowModal(true);

    const data = eventInfo.event.extendedProps;

    getEmployee({ variables: { id: data.employee.id } });
    setTimeout(function () {
      setFieldsValue({
        //  start: data.start,
        duration: data.duration.toString(),
        employeeId: data.employee.id,
        clientId: data.client.id,
        serviceId: data.service.id,
        start: moment(data.start, 'x', 'DD/MM/YYYY HH:mm')
      });
    }, 0);
    setBookingId(data.id);
  };

  const handleChangeEmployee = (value) => {
    getEmployee({ variables: { id: value } });
  };

  const handleChangeService = (value) => {
    const duration = (employeeData?.employee?.services.find(serv => value === serv.id)).duration || '';
    setFieldsValue({
      duration: duration.toString(),
    });
  };

  const saveBooking = (e) => {
    e.preventDefault();
    setSpin(true);
    validateFields()
      .then(async (values) => {
        try {
          const variables = {
            ...values,
            duration: parseInt(values.duration),
            // start: (values.start && values.start.format('YYYY-MM-DD')) || null,
            subsidiaryId,
            userId: user && user.currentUser && user.currentUser.id,
          };
          let response;
          if (!bookingId) {
            response = await createBooking({ variables });
            Notification(`Reserva creada correctamente`, 'success');
          } else {
            variables.id = bookingId;
            response = await updateBooking({ variables });
            Notification(`Reserva actualizada correctamente`, 'success');

          }
          resetFields();
          setShowModal(false);
        } catch (error) {
          console.log('\n', '===============================================', '\n');
          console.log('error');
          console.log(error);
          console.log('\n', '===============================================', '\n');
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
      events={formatEvents(dataBookings && dataBookings.bookings)}
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
        form={form}
        onFinish={saveBooking}
        layout="vertical"
      >
        <div className="group">

          {/* client */}
          <Form.Item
            label="Cliente"
            name="clientId"
            rules={[{ required: true, message: 'Completa el campo', whitespace: true }]}
          >
            <Select
            >
              {dataClients && dataClients.clients.map(client => <Select.Option key={client.id} value={client.id}>{client.name}</Select.Option>)}
            </Select>
          </Form.Item>

          {/* employees */}
          <Form.Item
            label="Profesional"
            name="employeeId"
            rules={[{ required: true, message: 'Completa el campo', whitespace: true }]}
          >
            {dataEmployees && dataEmployees.allEmployees ?
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
            name="serviceId"
            rules={[{ required: true, message: 'Completa el campo', whitespace: true }]}
          >
            <Select
              onChange={handleChangeService}
              disabled={!employeeData?.employee?.services}
            >
              {employeeData?.employee?.services.map(service => <Select.Option key={service.id} value={service.id}>{service.name}</Select.Option>)}
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
            label="Fecha y hora"
            name="start"
            rules={[{ required: true, message: 'Completa el campo' }]}
          >
            <DatePicker showToday={false} showTime={{ format: 'HH:mm', minuteStep: 30 }} format="DD/MM/YYYY HH:mm" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  </div>)
    ;
};

export default withRouter(Booking);