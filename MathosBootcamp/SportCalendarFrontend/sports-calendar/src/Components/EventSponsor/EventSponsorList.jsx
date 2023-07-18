import React, { useState, useEffect } from "react";
import {
  ListGroup,
  ListGroupItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import EventSponsorService from "../../Services/EventSponsorService";

function EventSponsorList({ currentEventId, isMainEditClicked }) {
  const [eventSponsors, setEventSponsors] = useState([]);
  const [selectedEventSponsor, setSelectedEventSponsor] = useState(null);
  const [updateFormName, setUpdateFormName] = useState("");
  const [updateFormWebsite, setUpdateFormWebsite] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEventSponsors();
  }, []);

  const fetchEventSponsors = async () => {
    try {
      const response = await EventSponsorService.getEventSponsors({
        eventId: currentEventId,
      });
      const eventSponsorsData = response.data;
      setEventSponsors(eventSponsorsData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteEventSponsor = async () => {
    if (selectedEventSponsor) {
      const eventSponsorId = selectedEventSponsor;
      try {
        await EventSponsorService.removeEventSponsor(eventSponsorId);
        console.log(
          `Event Sponsor with ID ${eventSponsorId} deleted successfully.`
        );
        fetchEventSponsors();
        setSelectedEventSponsor(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleUpdateEventSponsor = async () => {
    if (selectedEventSponsor) {
      const eventSponsorId = selectedEventSponsor;
      const updatedEventSponsor = {
        name: updateFormName,
        website: updateFormWebsite,
      };
      try {
        await EventSponsorService.updateEventSponsor(
          eventSponsorId,
          updatedEventSponsor
        );
        console.log(
          `Event Sponsor with ID ${eventSponsorId} updated successfully.`
        );
        setShowUpdateForm(false);
        setUpdateFormName("");
        setUpdateFormWebsite("");
        fetchEventSponsors();
        setSelectedEventSponsor(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const openUpdateModal = (eventSponsor) => {
    setSelectedEventSponsor(eventSponsor.id);
    setUpdateFormName(eventSponsor.eventId);
    setUpdateFormWebsite(eventSponsor.sponsorId);
    setShowUpdateForm(true);
  };

  const deleteEventSponsor = (eventSponsorId) => {
    setSelectedEventSponsor(eventSponsorId);
    setIsModalOpen(true);
  };

  const renderEventSponsors = () => {
    if (!eventSponsors || eventSponsors.length === 0) {
      return <ListGroupItem>No event sponsors available</ListGroupItem>;
    }

    return eventSponsors.map((eventSponsor) => (
      <ListGroupItem key={eventSponsor.id} className="square border border-2">
        <p>EventId: {eventSponsor.eventId}</p>
        <p>SponsorId: {eventSponsor.sponsorId}</p>
        {isMainEditClicked && (
          <>
            <Button
              onClick={() => openUpdateModal(eventSponsor)}
              className="me-4"
            >
              Update
            </Button>
            <Button
              color="danger"
              onClick={() => deleteEventSponsor(eventSponsor.id)}
            >
              Delete
            </Button>
          </>
        )}
      </ListGroupItem>
    ));
  };

  return (
    <div>
      <ListGroup className="text-center">{renderEventSponsors()}</ListGroup>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader>Delete Event Sponsor</ModalHeader>
        <ModalBody>Are you sure you want to delete this event sponsor?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteEventSponsor}>
            Delete
          </Button>{" "}
          <Button
            color="secondary"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={showUpdateForm}
        toggle={() => setShowUpdateForm(!showUpdateForm)}
      >
        <ModalHeader>Update Event Sponsor</ModalHeader>
        <ModalBody>
          <Input
            type="text"
            placeholder="Name"
            value={updateFormName}
            onChange={(e) => setUpdateFormName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Website"
            value={updateFormWebsite}
            onChange={(e) => setUpdateFormWebsite(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdateEventSponsor}>
            Update
          </Button>{" "}
          <Button
            color="secondary"
            onClick={() => setShowUpdateForm(!showUpdateForm)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default EventSponsorList;
