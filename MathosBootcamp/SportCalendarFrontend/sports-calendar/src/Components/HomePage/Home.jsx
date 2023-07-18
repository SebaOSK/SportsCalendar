import React, { useState, useEffect } from "react";
import EventService from "../../Services/EventService";
import CalendarReact from "react-calendar";
import { differenceInCalendarDays, isSameDay } from "date-fns";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";

function useFetchEventData() {
  const [datesToAddClassTo, setDatesToAddClassTo] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await EventService.getEvents();
        const eventsData = response.data.data;
        const eventStartDates = eventsData.map(
          (event) => new Date(event.startDate)
        );
        setDatesToAddClassTo(eventStartDates);
        setEvents(eventsData);
      } catch (error) {
        console.log("Error fetching event data: ", error);
      }
    };

    fetchData();
  }, []);

  return { datesToAddClassTo, events };
}

function Home({ userInfo }) {
  const { datesToAddClassTo, events } = useFetchEventData();
  const [value, setValue] = useState(new Date());
  const [clickedDateEvents, setClickedDateEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  function tileClassName({ date, view }) {
    if (view === "month") {
      if (datesToAddClassTo.find((dDate) => isSameDay(dDate, date))) {
        return "has-event";
      }
    }
  }

  function onChange(nextValue) {
    setValue(nextValue);
  }

  const onClickDayHandler = (value) => {
    console.log("Clicked day:", value);
    const clickedDate = new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate()
    );
    const clickedDateEvents = events.filter((event) => {
      const eventStartDate = new Date(event.startDate);
      return isSameDay(eventStartDate, clickedDate);
    });
    setClickedDateEvents(clickedDateEvents);
    toggleModal();
  };

  const navigate = useNavigate();

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
    navigate(`/Event/:${eventId}`);
  };

  const handleCreateEventClick = () => {
    navigate(`/EventPost`);
  };

  const canCreateEvent =
    userInfo.role === "Super_admin" || userInfo.role === "Organizer";

  return (
    <div className="calendar-container">
      <CalendarReact
        onChange={onChange}
        value={value}
        tileClassName={tileClassName}
        onClickDay={onClickDayHandler}
      />

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Events</ModalHeader>
        <ModalBody>
          {clickedDateEvents.length > 0 ? (
            <ul>
              {clickedDateEvents.map((event) => (
                <li key={event.id}>
                  <Link
                    to={`/Event/${event.id}`}
                    onClick={() => handleEventClick(event.id)}
                  >
                    {event.name}
                  </Link>
                </li>
              ))}
              {canCreateEvent && (
                <Button onClick={handleCreateEventClick}>Create event</Button>
              )}
            </ul>
          ) : (
            <>
              <p>No events found for this date.</p>
              {canCreateEvent && (
                <Button onClick={handleCreateEventClick}>Create event</Button>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Home;
