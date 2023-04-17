import SearchBars from '../components/SearchBars';

export default function HomePage() {
  return (
    <>
      <main className="card push-center" style={{ marginTop: 200, maxWidth: 1000 }}>
        <div style={{ margin: '20px 100px' }}>
          <h1 className="text-center">Every hotel, simple pricing.</h1>

          <p>
            {
              "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            }
          </p>
        </div>
        <SearchBars />
      </main>
    </>
  );
}
