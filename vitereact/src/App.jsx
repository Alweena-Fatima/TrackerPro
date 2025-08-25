
function App() {
  let valu = 5;
  const addval = () => {
    valu++;
    console.log("add val", { valu })
  }

  return (
    <>
      <h1> hello and Alweena</h1>
      <h2> Counter value : {valu}</h2>
      <button className="add" onClick={addval}>Add Value</button>
      <br></br>
      <button> Remove value </button>

    </>
  )
}

export default App
