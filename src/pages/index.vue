<template>
  <div>
    <div class="input-box">
      <span class="play_song">Choose music </span>
      <input type="file" id="load-file" @change="loadFile" multiple />
    </div>
    <div class="stage"></div>
    <ul id="fileList">
      <li
        v-for="(item, index) in fileList"
        :key="index"
        @click="paly(item.file)"
      >
        <span class="num">{{ item.num }}</span>
        <span class="song" :class="selected === item.name ? 'selected' : ''">{{
          item.name
        }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { fileListTypeInt } from "../type/index";

let selected = ref<string>("");

let fileList = ref<Array<fileListTypeInt>>([]);
let loadFile = (e: Event) => {
  const input = e.target as HTMLInputElement;
  let files = input.files;
  if (files) {
    console.log(files.length);

    for (let index = 0; index < files.length; index++) {
      const file: File = files[index];
      let flag: boolean = false;
      for (let i = 0; i < fileList.value.length; i++) {
        if (file.name === fileList.value[i].name) {
          console.log("repeat!!!!");
          flag = true;
          break;
        }
      }
      if (!flag) {
        const file_ty: fileListTypeInt = {
          num: fileList.value.length + 1,
          name: file.name,
          file: file,
        };
        fileList.value.push(file_ty);
      }
    }
  }
};

//  music play
let audioCtx: AudioContext = new window.AudioContext();
let audioBufferSourceNode: AudioBufferSourceNode | null = null;
let analyser: AnalyserNode = audioCtx.createAnalyser();
let paly = (file: File) => {
  selected.value = file.name;
  let fr: FileReader = new FileReader();
  fr.onload = (e) => {
    audioCtx.decodeAudioData(e.target?.result).then((buffer) => {
      if (audioBufferSourceNode != null) {
        audioBufferSourceNode.stop();
      }
      audioBufferSourceNode = null;
      audioBufferSourceNode = audioCtx.createBufferSource();
      audioBufferSourceNode.buffer = buffer;
      audioBufferSourceNode.connect(audioCtx.destination);
      audioBufferSourceNode.connect(analyser);
      audioBufferSourceNode.loop = true;
      audioBufferSourceNode.start(0);
    });
    getMusicData();
  };
  fr.readAsArrayBuffer(file);
};

// 加载音乐波形分析器
let getMusicData = () => {
  const audioInfoArray: Uint8Array = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(audioInfoArray);
  console.log(audioInfoArray);
};
</script>

<style scoped>
.input-box {
  width: 150px;
  background: #31c27c;
  border: 1px solid #31c27c;
  margin: 20px auto;
  color: #fff;
  border-radius: 2px;
  line-height: 30px;
  text-align: center;
  position: relative;
}
.play_song {
  width: 152px;
  line-height: 30px;
  position: absolute;
  left: 50%;
  margin-left: -76px;
}
#load-file {
  width: 150px;
  opacity: 0;
  cursor: pointer;
}
#fileList {
  background: #eee;
  width: 300px;
  margin: 0 auto;
  list-style: none;
  max-height: 170px;
  overflow-y: auto;
  padding: 0;
}
#fileList li {
  line-height: 24px;
  padding: 5px 0px;
  overflow: hidden;
}
.num {
  color: #999;
  float: left;
  width: 36px;
  text-align: center;
}
.song {
  color: #000;
  float: left;
}
.song:hover {
  cursor: pointer;
}
.selected {
  color: #31c27c;
}
</style>
