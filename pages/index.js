"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");

  useEffect(() => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending POST request to /api/data with name:", name, "and species:", species);
    const response = await fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, species }),
    });
    console.log("Response status:", response.status);
    if (response.ok) {
      const newData = await response.json();
      console.log("Response data:", newData);
      setData([...data, newData.data]);
      setName("");
      setSpecies("");
      fetch("/api/data")
        .then((response) => response.json())
        .then((data) => setData(data));
      alert(newData.message);
    } else {
      console.error("Failed to submit data");
    }
  };

  return (
    <div>
      <h1>Dados do MongoDB</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add new item"
        />
        <input
          type="text"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          placeholder="Add species"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name} - {item.species}</li>
        ))}
      </ul>
    </div>
  );
}