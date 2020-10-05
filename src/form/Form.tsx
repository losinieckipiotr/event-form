import React from "react";

export default function Form() {
  return (
    <form onSubmit={() => { alert("submit") }}>
      <p>
        <label>First name</label>
        <br/>
        <input type="text"></input>
      </p>
      <p>
        <label>Last name</label>
        <br/>
        <input type="text"></input>
      </p>
      <p>
        <label>Email</label>
        <br/>
        <input type="text"></input>
      </p>
      <p>
        <label>Date</label>
        <br/>
        <input type="date"></input>
      </p>
      <button type="submit">Submit</button>
    </form>
  );
}
