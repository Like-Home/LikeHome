import React from 'react';
import { useParams } from 'react-router-dom';

function Booking() {
  const { id } = useParams();

  return (
    <div>
      <h1>Booking</h1>
      <pre>bookingId: {id}</pre>
    </div>
  );
}

export default Booking;
