import React, { useEffect, useState } from 'react'
import axios from 'axios'

export const Home = () => {
  const [data, setData] = useState(null);
  const [inputData, setInputData] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/example')
    .then(response => {setData(response.data); console.log(response.status)})
    .catch(error => console.error("Error fetching data:", error));

  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/submit', {
      data: inputData,
    })
    .then(response => console.log("Response:", response))
    .catch(error => console.error("Error:", error));
  };

  return (
    <div>
      <h1>React-Django Connection</h1>
      {data ? <p>{data.message}</p> : <p>Loading...</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
        <button type="submit">Submit</button>
    </form>
    </div>
  )
}
