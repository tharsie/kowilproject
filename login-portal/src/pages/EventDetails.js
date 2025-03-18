import React, { useState, useEffect } from "react";

const EventDetails = () => {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  // Validation States
  const [eventNameError, setEventNameError] = useState("");
  const [eventDateError, setEventDateError] = useState("");
  const [organizerError, setOrganizerError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const validateForm = () => {
    let valid = true;
    if (!eventName.trim()) {
      setEventNameError("Event name is required!");
      valid = false;
    } else {
      setEventNameError("");
    }
    if (!eventDate.trim()) {
      setEventDateError("Event date is required!");
      valid = false;
    } else {
      setEventDateError("");
    }
    if (!organizer.trim()) {
      setOrganizerError("Organizer name is required!");
      valid = false;
    } else {
      setOrganizerError("");
    }
    return valid;
  };

  const addEvent = async () => {
    if (!validateForm()) return;

    const newEvent = { name: eventName, date: eventDate, organizer };

    try {
      const response = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const data = await response.json();
        setEvents([...events, data.event]);
        resetForm();
      } else {
        console.error("Failed to add event");
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  const editEvent = async () => {
    if (!validateForm()) return;
  
    const updatedEvent = { name: eventName, date: eventDate, organizer };
  
    try {
      const response = await fetch(`http://localhost:3000/api/events/${currentEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvent),
      });
  
      if (response.ok) {
        const updatedEvents = events.map((event) =>
          event.id === currentEvent.id ? { ...event, ...updatedEvent } : event
        );
  
        setEvents(updatedEvents); // Update state with edited event
        resetForm(); // Close modal and reset form
      } else {
        console.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId));
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setEventName(event.name);
    setEventDate(event.date);
    setOrganizer(event.organizer);
    setEditMode(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setEventName("");
    setEventDate("");
    setOrganizer("");
    setEditMode(false);
    setShowModal(false);
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>

      {/* Search Bar */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          className="border p-2 rounded w-2/3"
          placeholder="Search Events"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#FD9400] text-white px-4 py-2 rounded"
        >
          Add Event
        </button>
      </div>

      {/* Event List */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Event Name</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Organizer</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-2">
                No events found.
              </td>
            </tr>
          ) : (
            filteredEvents.map((event) => (
              <tr key={event.id}>
                <td className="border p-2">{event.name}</td>
                <td className="border p-2">{event.date}</td>
                <td className="border p-2">{event.organizer}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  {/*<button
                    onClick={() => deleteEvent(event.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>*/}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal for Adding or Editing Event */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
              onClick={resetForm}
            >
              X
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {editMode ? "Edit Event" : "Add New Event"}
            </h3>

            {/* Form Fields */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Event Name</label>
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              {eventNameError && <p className="text-red-500 text-sm">{eventNameError}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Event Date</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
              {eventDateError && <p className="text-red-500 text-sm">{eventDateError}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Organizer</label>
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
              />
              {organizerError && <p className="text-red-500 text-sm">{organizerError}</p>}
            </div>

            <button
              onClick={editMode ? editEvent : addEvent}
              className="bg-[#FD9400] text-white px-4 py-2 rounded"
            >
              {editMode ? "Save Changes" : "Add Event"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
