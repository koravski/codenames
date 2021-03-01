import React, { useState } from "react";
import {
  useChat,
  useSendChat,
  useSelfPlayer,
  usePushTurn,
} from "../hooks/game";
import classnames from "classnames";
import ChatMessage from "./ChatMessage";
import { EmojiConvertor } from "emoji-js";
import { useTranslation } from "react-i18next";

const emoji = new EmojiConvertor();
emoji.replace_mode = "unified";
emoji.allow_native = true;

const Chat = () => {
  const chat = useChat();
  const selfPlayer = useSelfPlayer();
  const sendChat = useSendChat();
  const pushTurn = usePushTurn();
  const [message, setMessage] = useState("");
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setMessage(emoji.replace_colons(e.currentTarget.value));
  };
  const { t } = useTranslation();

  const send = (hint: boolean = false) => {
    if (message.trim()) {
      if (hint) {
        pushTurn({
          type: "hint",
          hint: message.trim(),
          from: selfPlayer.id,
        });
      } else {
        sendChat({
          playerId: selfPlayer.id,
          type: "message",
          timestamp: Date.now(),
          message,
        });
      }
      setMessage("");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      send();
    }
  };

  return (
    <div className="border rounded bg-gray-200 w-full h-full flex flex-col text-gray-800 p-1 shadow-md">
      <div className="overflow-y-scroll flex-grow mb-1 border bg-white rounded leading-normal text-sm flex flex-col-reverse">
        {/* we reverse the chat and add a flex-col-reverse to keep the scroll down by default */}
        {chat.map((id) => <ChatMessage key={id} id={id} />).reverse()}
      </div>
      <div className="flex">
        <input
          inputMode="text"
          autoComplete="off"
          className={classnames("flex-grow text-input text-sm", {
            "bg-gray-100": !selfPlayer,
            "bg-white": selfPlayer,
          })}
          type="text"
          placeholder={
            !selfPlayer
              ? t("placeholder-join", "join game to start chatting")
              : ""
          }
          disabled={!selfPlayer}
          value={message}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <button
          className="flex items-center justify-center w-10 h-10 cursor-pointer hover:text-blue-700 focus:outline-none"
          onClick={() => send()}
        >
          <SendIcon className="w-4 h-4" />
        </button>
        {selfPlayer && selfPlayer.spymaster && (
          <button
            className="rounded border-2 hover:bg-gray-100 border-gray-400 flex items-center text-xs whitespace-pre-wrap font-bold justify-center w-20 h-10 cursor-pointer hover:text-blue-700 focus:outline-none"
            onClick={() => send(true)}
          >
            {t("give-hint", "give hint")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Chat;

const SendIcon = (props) => (
  <svg
    {...props}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 448 448"
    fill="currentColor"
  >
    <polygon points="0.213,32 0,181.333 320,224 0,266.667 0.213,416 448,224" />
  </svg>
);
