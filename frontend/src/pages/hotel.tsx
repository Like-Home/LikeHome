import { useParams } from 'react-router-dom';

export default function HotelPage() {
  const { hotelId } = useParams();

  return (
    <div>
      <h1>Hotel Information</h1>
      <pre>hotelId: {hotelId} </pre>
    </div>
  );
}
