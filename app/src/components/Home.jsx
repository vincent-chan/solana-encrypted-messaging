import {
  fetchRegistryAccounts,
  fetchChatLogs,
  fetchChatLogsByOwner,
  initializeChat,
  sendMessage,
  fetchChatMessages,
} from "../helpers/encryptedChatApp";
import {
  chatLogs,
  chatMessages,
  registry,
  setChatMessages,
} from "../store/chatapp";
import { For, createSignal, onMount } from "solid-js";
import { convoPartner, setConvoPartner } from "../store/convoPartner";
import { user } from "../store/user";

const test = async () => {
  await fetchRegistryAccounts();
  const chatlogs = await fetchChatLogsByOwner(user().username);
  console.log("chatlogs: ", chatlogs);

  // const chatlogs = await initializeChat("test2", "abc");
  // send message
  // const messageResult = await sendMessage(
  //   "abc",
  //   "test2",
  //   new Date().toUTCString(),
  //   "yo. this is a test message."
  // );
  // console.log("messageResult: ", messageResult);

  // await fetchChatMessages(user().username, "test2");
  // console.log("fetchChatMessages: ", chatMessages);
};

const Home = () => {
  onMount(async () => test());
  return (
    <div class="py-8 px-12 w-full h-full rounded-xl bg-zinc-700 overflow-y-scroll">
      {/* For Chat convo */}
      <label for="convo_partner" class="flex justify-between text-gray-300 ">
        Select convo partner:
      </label>
      <select
        class="mt-1 mb-4 w-full px-3 py-2 rounded cursor-pointer text-black"
        name="convo_partner"
        id="convo_partner"
        onChange={(e) => {
          setConvoPartner(e.currentTarget.value);
          fetchChatMessages(user().username, e.currentTarget.value);
        }}
      >
        <option value="" disabled selected>
          Select convo partner
        </option>
        <For each={registry.users || []}>
          {(x) => (
            <Show when={x.account.username != user().username}>
              <option value={x.account.username}>{x.account.username}</option>
            </Show>
          )}
        </For>
      </select>

      {/* Send message*/}
      <h3 class="text-2xl text-center">Send Messsage</h3>
      <div class="flex justify-between items-center my-4">
        <input class="p-2 rounded-md w-1/2" type="text"></input>
        <button
          class="border-2 rounded-md border-green-400 p-2"
          classList={{ "border-zinc-400 text-zinc-400": convoPartner() === "" }}
          disabled={convoPartner() === ""}
        >
          Send
        </button>
      </div>

      {/* Reads messages*/}
      <div class="flex justify-center items-center space-x-4">
        <h3 class="text-2xl text-center">Messsages</h3>
        <button class="border-2 border-green-400 rounded-md p-2">
          Refresh
        </button>
      </div>
      <div class="flex flex-col justify-start items-start my-4">
        <For each={chatMessages.accounts}>
          {(message, i) => (
            <div class="border p-2">
              <div># {i}</div>
              <div>author: {message.author}</div>
              <div>datetime: {message.timestamp}</div>
              <div>message: {message.encryptedMessage}</div>
              <div>decrypted: {message.message}</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default Home;