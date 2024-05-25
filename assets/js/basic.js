
var btnStart = document.querySelector('button[name="record"]');
var btnStop = document.querySelector('button[name="stop"]');
var audio = document.querySelector('#audio');
var src_audio = document.querySelector('#src_audio');

src_audio.onpause = (e) => {btnStart.parentElement.style.display = "none";};
src_audio.onplay = (e) => {btnStart.parentElement.style.display = "block";};
btnStop.parentElement.style.display = "none";
btnStart.parentElement.style.display = "none";

btnStart.addEventListener('click', async () => {
    // let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
    let stream = src_audio.captureStream ? await src_audio.captureStream() : await src_audio.mozCaptureStream();

    let mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    let chunks = [];
    mediaRecorder.ondataavailable = (e)=>{
            chunks.push(e.data);
    }
    //function to catch error
    mediaRecorder.onerror = (e)=>{
            alert(e.error);
    }

    mediaRecorder.onstop = (e)=>{
        let blob = new Blob(chunks, { 'type': 'audio/webm; codecs=opus' });
        //create url for audio
        let url = URL.createObjectURL(blob);
        //pass url into audio tag
        audio.src = url;

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'quran_radio.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        }, 1000);
    }
    
    btnStart.parentElement.style.display = "none";
    btnStop.parentElement.style.display = "block";

    btnStop.addEventListener('click',()=>{
        mediaRecorder.stop();
        
        btnStop.parentElement.style.display = "none";
        btnStart.parentElement.style.display = "block";
    })
})
