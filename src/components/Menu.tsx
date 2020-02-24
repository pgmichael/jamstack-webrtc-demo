import * as React from "react";
import * as ReactDOM from "react-dom";
import { Link } from "react-router-dom";

export default function Menu() {
  const [joinableId, setJoinableId] = React.useState("")
  const [creatableId, setCreatableId] = React.useState("")

  return (
    <div className="menu">
      <div className="menu__item">
        <h1>Join Room</h1>
        <input type="text" onChange={(event) => setJoinableId(event.currentTarget.value)} />
        <Link to={{pathname: `/room/${joinableId}`}}>Join</Link>
      </div>
      <div className="menu__item">
        <h1>Create Room</h1>
        <input type="text" onChange={(event) => setCreatableId(event.currentTarget.value)} />
        <Link to={`/host/${creatableId}`}>Create</Link>
      </div>
    </div>
  )
}