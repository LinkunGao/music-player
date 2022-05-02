<template>
  <div ref="root" class="rootDiv">
    <div class="input-box">
      <span class="play_song">Choose music </span>
      <input type="file" id="load-file" @change="loadFile" multiple />
    </div>
    <div class="stage" ref="stage"></div>
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
import { onMounted, ref } from "vue";
import { fileListTypeInt } from "../type/index";
import anime from "animejs/lib/anime.es.js";

let selected = ref<string>("");
let stage = ref<HTMLDivElement | null>(null);
let root = ref<HTMLDivElement | null>(null);
let stageDivEl: HTMLDivElement;
let rootEl: HTMLDivElement;

onMounted(() => {
  stageDivEl = stage.value as HTMLDivElement;
  rootEl = root.value as HTMLDivElement;
});

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
  requestAnimationFrame(getMusicData);
  const audioInfoArray: Uint8Array = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(audioInfoArray);
};

// 初始化stage div
let initDiv = (num: number, r: number) => {
  setTimeout(() => {
    const winWidth = rootEl.clientWidth;
    const winHeight = rootEl.clientHeight;
    const avd = 360 / num;
    const ahd = (avd * Math.PI) / 180;
    for (let i = 0; i < num; i++) {
      let divEl: HTMLDivElement = document.createElement("div");
      divEl.style.width = "10px";
      divEl.style.height = "3px";
      divEl.style.background = "red";
      divEl.style.position = "absolute";
      stageDivEl.append(divEl);
      anime({
        targets: divEl,
        translateX: [winWidth / 2, winWidth / 2 + Math.sin(ahd * i) * r],
        translateY: [winHeight / 2, winHeight / 2 + Math.cos(ahd * i) * r],
        rotate: [-(avd * i)],
        loop: false,
        duration: 1000,
      });
    }
  }, 100);
};
initDiv(60, 100);
</script>

<style scoped>
.rootDiv {
  height: 100vh;
}
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
.el {
  width: 10px;
  height: 3px;
  background: red;
}
</style>
