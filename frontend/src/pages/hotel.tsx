import React from 'react';
import { useParams } from 'react-router-dom';

function HotelPage() {
  const { hotelId } = useParams();

  return (
    <div>
      <h1>Hotel Information</h1>
      <pre>hotelId: {hotelId}</pre>
    </div>
  );
}

export default HotelPage;
