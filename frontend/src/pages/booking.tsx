import React from 'react';
import { useParams } from 'react-router-dom';

function Booking() {
  const { bookingid } = useParams();

  return (
    <div>
      <h1>Booking</h1>
      <pre>bookingId: {bookingid} </pre>
    </div>
  );
}

export default Booking;
