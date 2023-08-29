import { ChangeEvent, useState } from "react";

function App() {

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    // Add your submit logic here
    console.log("Submitted!");
    console.log(inputValue);
  };

  return (
    <div className="flex flex-row gap-4">
      <input
        type="text"
        className="border p-4 outline-none rounded-xl"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );

}

export default App;