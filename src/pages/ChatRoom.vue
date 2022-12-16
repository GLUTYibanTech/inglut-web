<template>
  <div class="q-ma-sm">
    <div class="chat">
      <q-chat-message
        v-for="(dialog, index) in messageList"
        :key="index"
        :name="dialog.nick ?? dialog.chatId.slice(0, 5)"
        :stamp="dialog.time"
        :sent="isMe(dialog.chatId)"
        :bg-color="isMe(dialog.chatId) ? 'amber-7' : 'primary'"
        :text-color="isMe(dialog.chatId) ? 'black' : 'white'"
      >
        <template #avatar>
          <q-avatar
            :color="isMe(dialog.chatId) ? 'orange' : 'primary'"
            text-color="white"
            :class="{
              'q-ml-sm': isMe(dialog.chatId),
              'q-mr-sm': !isMe(dialog.chatId),
            }"
            >{{
              (dialog.nick ?? dialog.chatId).slice(0, 1).toUpperCase()
            }}</q-avatar
          >
        </template>
        <div
          v-for="(item, index) in dialog.dialogs"
          :key="index"
          style="max-width: 50vw; user-select: text"
        >
          <span v-text="item"></span>
        </div>
      </q-chat-message>
      <div ref="chatScroll"></div>
    </div>
    <q-input
      class="fixed bottom q-pb-md"
      v-model="sendText"
      outlined
      maxlength="1000"
    >
      <template v-slot:before>
        <q-avatar color="primary" text-color="white">{{
          (myInfo.nickName ?? myChatId).slice(0, 1).toUpperCase()
        }}</q-avatar>
      </template>

      <template v-slot:append>
        <q-icon
          v-if="sendText !== ''"
          name="close"
          @click="sendText = ''"
          class="cursor-pointer"
        />
      </template>

      <template v-slot:after>
        <q-btn round dense flat icon="send" @click="sendMessage" />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import indexdb from "./../utils/indexdb";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { ref, onMounted } from "vue";
import { getUserInfo } from "../utils/user-manager";
import md5 from "md5";
const chatScroll = ref(null);
const myChatId = ref("");
const messageList = ref([]);
const sendText = ref("");
const myInfo = ref({});
function isMe(chatID) {
  return myChatId.value == chatID;
}
let connection = new HubConnectionBuilder().withUrl("/signalR").build();
function sendMessage() {
  connection.send("SendMessage", sendText.value);
  sendText.value = "";
}
connection.on("ReceiveMessage", (data) => {
  console.log("收到");
  lastMessage = messageList.value[messageList.value.length - 1];
  lastMessage.time = data.time
    .substring("20", ".")
    .slice(5)
    .replace("T", " ")
    .replace(".", "")
    .slice(0, -3);
  if (lastMessage && data.chatId == lastMessage.chatId) {
    lastMessage.dialogs = [...lastMessage.dialogs, data.message];
    messageList.value[messageList.value.length - 1] = lastMessage;
  } else {
    lastMessage = data;
    lastMessage.time = data.time
      .substring("20", ".")
      .slice(5)
      .replace("T", " ")
      .replace(".", "")
      .slice(0, -3);
    lastMessage.dialogs = [data.message];
    messageList.value.push(lastMessage);
  }
  setTimeout(() => {
    try {
      chatScroll.value.scrollIntoView({ behavior: "smooth" });
    } catch ({ e }) {
      console.log(e);
    }
  }, 100);
});
connection.on("AuthRequired", async () => {
  connection.invoke("Auth", await indexdb.getToken());
});
connection.on("ReceiveHistory", async (history) => {
  history.forEach((element) => {
    element.dialogs = [element.message];
    element.time = element.time
      .substring("20", ".")
      .slice(5)
      .replace("T", " ")
      .replace(".", "")
      .slice(0, -3);
    messageList.value.push(element);
  });
  setTimeout(() => {
    try {
      chatScroll.value.scrollIntoView({ behavior: "smooth" });
    } catch ({ e }) {
      console.log(e);
    }
  }, 100);
});
let lastMessage = null;
onMounted(async () => {
  myInfo.value = await getUserInfo();
  myChatId.value = md5(myInfo.value.studentId).toUpperCase();
  await connection.start();
  connection.invoke("GetHistory");
});
</script>

<style scoped>
.bottom {
  width: calc(100% - 15px);
  bottom: 70px;
  z-index: 99;
  background-color: white;
}
.chat {
  height: calc(100vh - 56px - 100px);
  overflow-y: scroll;
  overflow-x: hidden;
}
.chat::-webkit-scrollbar {
  display: none;
}
</style>
