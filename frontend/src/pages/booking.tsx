import { useParams } from 'react-router-dom';

export default function BookingPage() {
  const { bookingid } = useParams();

  return (
    <div>
      <h1>Booking</h1>
      <pre>bookingId: {bookingid} </pre>
    </div>
  );
}
