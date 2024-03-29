import { useState } from "react";
import "./style/style.css";
import { wait } from "@testing-library/user-event/dist/utils";

function Home() {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [prompt, setPrompt] = useState("");
  const [jresult, setJresult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue) {
      setError("Please enter a prompt!");
      setPrompt("");
      setResult("");
      setJresult("");
    }

    try {
      const res = await fetch("/api/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputValue }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
      } else {
        throw new Error("An error occured");
      }
    } catch (err) {
      console.log(err);
      setResult("");
      setError("An error occured while submitting the form");
    }
  };

  return (
    <div className="container">
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="row form-group mt-2">
          <div className="col-sm-10 ">
            <div className="form-floating">
              <textarea
                className="form-control custom-input"
                id="floatingInput"
                placeholder="Enter a prompt"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <label htmlFor="floatingInput">Input</label>
            </div>
          </div>
          <div className="col-sm-2">
            <button type="submit" className=" btn btn-primary custom-btn">
              Submit
            </button>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {prompt && <div className="alert alert-secondary mt-3">{prompt}</div>}
      {result && <div className="alert alert-success mt-3">{result}</div>}
      {result && (
        <pre className="alert alert-info mt-3">
          <code>{jresult}</code>
        </pre>
      )}
    </div>
  );
}

export default Home;
