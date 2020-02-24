import * as React from "react";
import { Link, useParams } from "react-router-dom";
import Peer from "peerjs";
import PeerList from "./PeerList";

export default function Room({ isHost }: IRoomProps) {
  const roomId = useParams<IURLParams>().id.toLocaleLowerCase();
  const prefixedRoomId = `JAMSTACK-WEBRTC-${roomId}`
  const [clientId, setClientId] = React.useState("")

  const [peerObject, setPeerObject] = React.useState<{ [key: string]: Peer.DataConnection }>({});
  const [peerArray, setPeerArray] = React.useState<string[]>([])

  React.useEffect(() => isHost ? initializeRoom() : connectToRoom(), [])

  function initializeRoom() {
    // Create a PeerJS client with the roomId as peerId
    const client = new Peer(prefixedRoomId, { debug: 2 })

    // When connection with PeerJS is opened, update state with clientId
    client.on('open', id => setClientId(id))

    // When client recieves a connection with a peer
    client.on('connection', connection => {

      // When client establishes a connection with a peer
      connection.on('open', () => setPeerObject((prevPeers) => ({ ...prevPeers, [connection.peer]: connection })))

      // When connection from peer is closed, remove connection from peeer object
      connection.on('close', () => setPeerObject((prevPeers) => {
        const newState = { ...prevPeers }
        delete newState[connection.peer]
        return newState
      }))
    })
  }

  // Triggered whenever a new peer is added to the peerObject
  React.useEffect(() => {
    const reducedPeers = Object.keys(peerObject).reduce((acc, key) => {
      acc.push(key)
      return acc
    }, [])

    const dataEvent: IDiscoverEvent = {
      type: 'discovery',
      data: reducedPeers
    }

    // Send peerIds to all peers
    Object.entries(peerObject).forEach(([key, connection]) => connection.send(dataEvent))
  }, [peerObject])

  function connectToRoom() {
    // Create a PeerJS client without a specific peerId
    let client = new Peer({ debug: 2 })

    // When connection with PeerJS is opened, update state with clientId & connect to room host
    client.on('open', id => {
      setClientId(id)
      const connection = client.connect(prefixedRoomId)

      // When a connection with the host is opened
      connection.on('open', () => {

        // When data is recieve from the host, handle the event
        connection.on('data', (data) => handleEvent(data))
      })
    })
  }

  function handleEvent(event: IEvent) {
    switch (event.type) {
      case 'discovery':
        setPeerArray((event as IDiscoverEvent).data);
        break;

      case 'alert':
        alert((event as IAlertEvent).data)
        break;
    }
  }

  function sendAlert(peerId: string) {
    const event: IAlertEvent = { type: 'alert', data: 'ALERT' }
    peerObject[peerId].send(event)
  }

  return (
    <div className="room">
      <h1>Room: {roomId}</h1>
      <h2>You are {isHost ? "the host." : clientId}</h2>
      <PeerList peerObject={peerObject} peerArray={peerArray} alert={sendAlert} />
      <Link to="/">Back to menu</Link>
    </div>
  )
}

export interface IURLParams {
  id: string
}

export interface IRoomProps {
  isHost: boolean
}

export interface IEvent {
  type: string,
}

export interface IDiscoverEvent extends IEvent {
  data: string[]
}

export interface IAlertEvent extends IEvent {
  data: string
}