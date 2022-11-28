<template>
  <div class="q-ma-sm">
    <!-- avatar="https://cdn.quasar.dev/img/avatar3.jpg" -->
    <div class="chat" ref="chatScroll">
      <q-chat-message
        v-for="(dialog, index) in messageList"
        :key="index"
        :name="
          dialog.nick ? dialog.nick : 'Anonymous' + dialog.chatId.slice(0, 5)
        "
        :text="dialog.dialogs"
        :stamp="
          dialog.time
            .substring('20', '.')
            .slice(5)
            .replace('T', ' ')
            .replace('.', '')
        "
        size="6"
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
              (dialog.nick ? dialog.nick : "Anonymous")
                .slice(0, 1)
                .toUpperCase()
            }}</q-avatar
          >
        </template>
        <!-- icon="face" -->
      </q-chat-message>
    </div>
    <q-input
      class="fixed bottom"
      outlined
      v-model="sendText"
      label="发送内容"
      maxlength="1000"
    >
      <template v-slot:before>
        <q-avatar color="primary" text-color="white">{{
          (myInfo.nickName ? myInfo.nickName : "Anonymous")
            .slice(0, 1)
            .toUpperCase()
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

      <!-- <template v-slot:hint> Field hint </template> -->

      <template v-slot:after>
        <q-btn round dense flat icon="send" @click="sendMessage" />
      </template>
    </q-input>
    <!-- <q-chat-message
      avatar="https://cdn.quasar.dev/img/avatar5.jpg"
      name="Jane"
      :text="[
        'doing fine, how r you?',
        'I just feel like typing a really, really, REALLY long message to annoy you...',
      ]"
      size="6"
      stamp="4 minutes ago"
      text-color="white"
      bg-color="primary"
    >
      <template #avatar>
        <q-avatar
          color="primary"
          text-color="white"
          font-size="30px"
          icon="person_outline"
          class="q-mr-sm"
        />
      </template>
    </q-chat-message> -->
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
let connection = new HubConnectionBuilder().withUrl("/chatHub").build();
function sendMessage() {
  connection.send("SendMessage", sendText.value);
}
// const others = computed(() =>
//   messageList.value.filter((x) => x.chatId != myChatId.value)
// );
// const mine = computed(() =>
//   messageList.value.filter((x) => x.chatId != myChatId.value)
// );
let lastMessage = null;
onMounted(async () => {
  myInfo.value = await getUserInfo();
  myChatId.value = md5(myInfo.value.studentId).toUpperCase();
  // window.chatScroll = chatScroll.value;
  connection.on("ReceiveMessage", (data) => {
    console.log("收到");
    lastMessage = messageList.value[messageList.value.length - 1];
    if (lastMessage && data.chatId == lastMessage.chatId) {
      lastMessage.dialogs = [...lastMessage.dialogs, data.message];
      messageList.value[messageList.value.length - 1] = lastMessage;
    } else {
      lastMessage = data;
      lastMessage.dialogs = [data.message];
      messageList.value.push(lastMessage);
    }
    setTimeout(() => {
      try {
        chatScroll.value.scrollTop = chatScroll.value.scrollHeight;
      } catch ({ e }) {
        console.log(e);
      }
    }, 500);
  });
  connection.on("AuthRequired", async () => {
    connection.invoke("Auth", await indexdb.getToken());
  });

  connection.start();

  window.connection = connection;
});
</script>

<style scoped>
.bottom {
  width: calc(100% - 15px);
  bottom: 80px;
}
.chat {
  height: 78vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.chat::-webkit-scrollbar {
  display: none;
}
</style>
