import Peer from "peerjs";
import * as React from "react";

export default function PeerList({ peerObject, peerArray, alert }: IPeerListProps) {
  return (
    <div className="peer-list">
      <h3>Peer list:</h3>
      {
        Object.entries(peerObject).map(([peerId, value]) => (
          <div className="peer-list__item" key={peerId}>
            <span className="peer-per-list__id">{peerId}</span>
            <button className="peer-list__alert" onClick={() => alert(peerId)}>🚨</button>
          </div>
        ))
      }
      {peerArray.map(peer => <h4 key={peer}>{peer}</h4>)}
    </div>
  )
}

export interface IPeerListProps {
  peerObject: { [key: string]: Peer.DataConnection }
  peerArray: string[]
  alert: (peerdId: string) => void
}