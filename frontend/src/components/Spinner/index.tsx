import './styles.scss';

const MEME_WAITING_MESSAGES = [
  'Exploring the world for you... while you sit comfortably on your couch in your pajamas.',
  'Please wait... our travel gurus are brainstorming the best ideas for your next adventure. No pressure.',
  'Loading... our virtual tour guides are dusting off their maps and getting ready to take you on a journey.',
  "Pack your bags... virtually. Our app will make it feel like you're already on vacation.",
  'Please wait... our team is working hard to make sure your next trip is even better than the last one. No pressure again.',
  'Loading... our app is like a GPS for your dream vacation. You just have to sit back and enjoy the ride.',
  'Get ready... to be amazed by all the incredible places you can go. Who says you need a plane ticket to travel?',
  'Please wait... our app is calculating the perfect travel itinerary based on your interests, budget, and willingness to try new foods.',
  "Loading... our travel experts are working hard to make sure you don't end up in a hotel next to a construction site or a noisy karaoke bar.",
  'Ready to go... on a digital adventure of a lifetime. No passport required.',
  "Please wait... our app is like a personal travel assistant. We won't make you coffee, but we'll plan the perfect trip for you.",
  'Loading... our team of explorers is venturing into the unknown to bring you the best travel recommendations. They may come back with a few souvenirs.',
  "Get your sunscreen ready... or your umbrella, depending on where you're going. Our app has got you covered.",
  // "Booking your dream hotel... or at least, a decent one.",
  // "Loading... we're finding you a bed that hasn't been slept in yet.",
  // "Please wait... our reservation robots are working their magic.",
  // "Booking your stay... so you don't have to sleep in your car.",
  // "Loading... our hamsters are running as fast as they can on their hotel booking wheel.",
  // "Hold tight... we're building you a temporary home away from home.",
  // "Almost there... just a few more seconds until you can stop pretending you're camping.",
  // "Your dream hotel is being hand-picked by our expert sloths. They work slowly, but they have great taste.",
  // "Just a sec... our booking gnomes are double-checking that there are no monsters under the bed.",
  // "Please wait... we're searching high and low for the best deal so you don't have to sell a kidney.",
  // "Loading... our booking elves are sprinkling a little extra magic on your reservation.",
  // "We're on it... making sure your hotel room is just as clean as the pictures on the website.",
  // "Booking your hotel room... because sleeping in the lobby isn't as fun as it sounds.",
  // "Hold tight... we're finding you a bed that's even comfier than your own.",
  // "Please wait... our booking wizards are busy conjuring up the perfect hotel room for you.",
];

function getRandomMemeWaitingMessage() {
  const randomIndex = Math.floor(Math.random() * MEME_WAITING_MESSAGES.length);
  return MEME_WAITING_MESSAGES[randomIndex];
}

function Spinner() {
  const memeWaitingMessage = getRandomMemeWaitingMessage();
  return (
    <div className="spinner-container">
      <div className="spinner">
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </div>
      <p>{memeWaitingMessage}</p>
    </div>
  );
}

export default Spinner;
