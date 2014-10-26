//https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/PlayingandSynthesizingSounds/PlayingandSynthesizingSounds.html
//
//http://stackoverflow.com/questions/12517000/no-sound-on-ios-6-web-audio-api
//
//http://www.html5rocks.com/en/tutorials/webaudio/intro/
//
//http://labs.music.baidu.com/demo/muplayer/doc/api.html
$(function() {
    var snd1 = null,
        snd2 = null,
        snd2buffer = null;
    snd2source = null;

    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    //code goes here
    var $btn1 = $('#btn1'),
        $btn2 = $('#btn2');
    $btn1.on('click tap', function() {
        if (snd1 == null) {
            snd1 = new Audio();
            snd1.src = 'background.mp3';
            snd1.oncanplay = function() {
                this.play();
            };
        } else {
            alert('cached!');
            snd1.currentTime = 0;
            snd1.play();
        }

    });

    $btn2.on('click tap', function() {

        if (snd2 == null) {
            loadAndPlay('background.mp3');
        } else {
            alert('snd2 cached!');
            if (snd2source != null) {
                snd2source.stop(0);
                snd2source = null;
            }
            playSource(snd2buffer);
        }

        function loadAndPlay(url) {
            snd2 = new AudioContext();
            loadDogSound(url);
        }

        function loadDogSound(url) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            // Decode asynchronously
            request.onload = function() {
                snd2.decodeAudioData(request.response, function(buffer) {
                    snd2buffer = buffer;
                    playSource(buffer);
                }, function(err) {
                    alert(JSON.stringify(err));
                });
            };
            request.send();
        }

        function playSource(buffer) {
            snd2source = snd2.createBufferSource(); // creates a sound source
            snd2source.buffer = buffer; // tell the source which sound to play
            snd2source.connect(snd2.destination); // connect the source to the context's destination (the speakers)
            snd2source.start(0); // play the source now
            // note: on older systems, may have to use deprecated noteOn(time);
        }
    });

    // 初始化一个MuPlayer的实例。注意，我们默认使用了_mu全局命名空间。
    var player = new _mu.Player({
        // baseDir是必填初始化参数，指向刚才签出的MuPlayer静态资源目录
        baseDir: '/',
        mode: 'single'
    });

    // 通过add方法添加需要播放的音频，并调用play方法开始播放。
    player.add('1.mp3');
    player.add('2.mp3');
    player.add('3.mp3');

    $('#btn3').on('click tap', function() {
        player.setCur('3.mp3');
        player.play();

        setTimeout(function() {
            player.stop();
        }, 500);
        setTimeout(function() {
            player.setCur('1.mp3');
            player.play();
        }, 1500);

    });


});