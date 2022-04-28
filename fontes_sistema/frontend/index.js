function play_video(obj_video) {
  obj_video.play();
};

function tela_inteira(obj_video) {
  obj_video.requestFullscreen();
};

function onclick_play_video(nome_arquivo_video) {
    const obj_video = document.getElementById("id_video");
    obj_video.src = "/videos/" + nome_arquivo_video;
    play_video(obj_video);
}

function onclick_tela_inteira() {
    const obj_video = document.getElementById("id_video")
    tela_inteira(obj_video);
};
