
function Test() {
  return <button>Hello</button>
}

const container = document.querySelector('#root')
const root = ReactDOM.createRoot(container)

root.render(<Test/>)
