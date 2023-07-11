import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

let socket: any;
interface IMessage {
  address: string;
  message: string;
}
const Message = ({ gameId }: { gameId: string }) => {
  const { address } = useAccount();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([{ address: "", message: "" }]);

  useEffect(() => {
    socketInitializer();
  }, [address]);

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io();

    socket.on("newIncomingMessage", (msg: IMessage) => {
      setMessages(currentMsg => [...currentMsg, { address: msg.address, message: msg.message }]);
      console.log(messages);
    });
  };

  const sendMessage = async () => {
    socket.emit("createdMessage", { address, message }, gameId);
    setMessages((currentMsg: any) => [...currentMsg, { address: address, message }]);
    setMessage("");
  };
  const joinGameRoom = () => {
    socket.emit("joinGameRoom", gameId);
  };

  const handleKeypress = (e: React.KeyboardEvent) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (message) {
        console.log(message);
        sendMessage();
      }
    }
  };

  useEffect(() => {
    if (socket) {
      joinGameRoom();
    }
  }, [socket]);
  return (
    <main className="gap-4 flex w-full flex-col  items-center md:items-end   h-full">
      <>
        <Address address={address} />

        <div className="flex flex-col justify-end md:max-w-[80%] w-full h-[20rem]  rounded-md shadow-md ">
          <div className="h-full rounded-t-md last:border-b-0 overflow-y-scroll bg-slate-500">
            {messages.map((msg, i) => {
              return (
                <div className="w-full py-1 px-2 border-b border-gray-200" key={i}>
                  {msg.address === address ? "You" : <Address address={msg.address} />} : {msg.message}
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-300 w-full flex rounded-bl-md">
            <input
              type="text"
              placeholder="New message..."
              value={message}
              className=" w-full text-stone-800 outline-none py-2 px-2 rounded-bl-md flex-1"
              onChange={e => setMessage(e.target.value)}
              onKeyUp={handleKeypress}
            />
            <div className="border-l border-gray-300 flex justify-center items-center  rounded-br-md group  transition-all">
              <button
                className=" px-3 h-full btn btn-primary rounded-br-md"
                onClick={() => {
                  sendMessage();
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </>
    </main>
  );
};

export default Message;
