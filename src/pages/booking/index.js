import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router";
/* components */
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import esLocale from '@fullcalendar/core/locales/es';

/* data */
import { getToken } from '../../query';

const Booking = ({ history }) => {
  const { token } = getToken();
  const calendarComponentRef = React.createRef();

  const [spinning, setSpin] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      dateClick={(date) => {
        const calendarApi = calendarComponentRef.current.getApi();
        if (calendarApi.view.type === 'timeGridDay') {
          alert(date);
        } else {
          calendarApi.changeView('timeGridDay', date.dateStr);
        }
      }}
      events={[
        {
          start: '2020-03-10T10:00:00',
          end: '2020-03-10T16:00:00',
          rendering: 'background',
          overlap: false,
        }
      ]}
    />
  </div>)
    ;
};

export default withRouter(Booking);