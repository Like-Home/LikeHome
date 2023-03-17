import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { bookingById } from '../recoil/bookings/atom';

export default function BookingPage() {
  const { bookingId } = useParams();

  if (!bookingId) {
    return <div>Booking not found!</div>;
  }

  const booking = useRecoilValue(bookingById(bookingId));

  return (
    <div>
      <pre>bookingId: {JSON.stringify(booking, null, 2)} </pre>
    </div>
  );
}
