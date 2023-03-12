import { useParams } from 'react-router-dom';
import userAtom from '../recoil/user';
import { useRecoilValue } from 'recoil';

export default function HotelPage() {
  const { hotelId } = useParams();
  const { hotelAmenities } = useParams();
  const user = useRecoilValue(userAtom);

  return (
    <div>
      <h1>Hotel Information</h1>
      <div id="hotel info">
        <img src="https://as2.ftcdn.net/v2/jpg/00/09/21/15/1000_F_9211505_d4hxfNtPeTfgt7AeGmoO7u79P2hwxkoQ.jpg" alt="Example hotel 1" width="650px" height="550px"></img>
        <p>
          Location: {}<br/>
          Amenities: {hotelAmenities}{/*Idealy should be an array of amenities for each hotel*/}
        </p>
        <div id="room info">
          <p>
            Room layout: {} {/*If the user has not specified amount of people list all availible styles*/}<br/>
            Price per night: ${} {/*List along with room layout*/}<br/>
            Availability: {}
          </p>
        </div>
      </div>
      {user ? (
        <form action="/booking/:id" method="post">
          <input type="submit" value="Book now"/>
        </form>
      ) : (
        <a href='/auth'>Sign in</a>
      )}
      <pre>hotelId: {hotelId} </pre>
    </div>
  );
}
