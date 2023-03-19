import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import reactLogo from '../assets/react.svg';

import userAtom from '../recoil/user';

export default function HomePage() {
  const [count, setCount] = useState(0);
  const user = useRecoilValue(userAtom);

  return (
    <>
      <main className="card push-center" style={{ marginTop: 200, maxWidth: 900 }}>
        <div style={{ margin: '20px 100px' }}>
          <h1 className="text-center">Every hotel, simple pricing.</h1>
          <p>
            {
              "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            }
          </p>
        </div>

        {/* Vite test components. Remove me! */}
        <div className="text-center">
          <div>
            <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
              <img src="/vite.svg" className="logo" alt="Vite logo" />
            </a>
            <a href="https://reactjs.org" target="_blank" rel="noreferrer">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <button onClick={() => setCount((state) => state + 1)}>count is {count}</button>
          {user && (
            <div className="card">
              <h2>Logged in as {user.email}</h2>
            </div>
          )}
          <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
        </div>
      </main>
    </>
  );
}
