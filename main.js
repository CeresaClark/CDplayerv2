const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 9000;
canvas.height = 200;

let audioSource, analyser;


$("#uploadMusic").change(function () {
    $('#progress_bar').css('left', '-100%')
    $('#progress_dot').css('left', '0%')
    const files = this.files;
    const audio = document.getElementById('audio');
    const audioContext = new AudioContext();
    audio.src = URL.createObjectURL(files[0]);
    audio.load();

    audioSource = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount; //fftSize的一半
    const dataArray = new Uint8Array((bufferLength));

    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let x;

    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);

        requestAnimationFrame(animate);
    }

    animate();


    $('#playBtn').on('click', function () {
        audio.play()
        $('.CDrotate,.singerName,.musicName').css('animation-play-state', 'running')
        $('.start').css('clip-path', 'polygon(0 0, 30% 0, 30% 70%, 45% 70%, 45% 30%, 30% 30%, 30% 0, 55% 0, 55% 70%, 70% 70%, 70% 30%, 55% 30%, 55% 0, 100% 0, 100% 100%, 0 100%)')
        $('#allTime').html(timer(audio.duration))
        requestAnimationFrame(function loop() {
            if (!audio.paused && timer(audio.currentTime)) {
                $('#nowTime').html(timer(audio.currentTime));
            }
            requestAnimationFrame(loop);
        });
    })

    $('#pauseBtn').on('click', function () {
        audio.pause()
        $('.CDrotate,.singerName,.musicName').css('animation-play-state', 'paused')
        $('.start').css('clip-path', 'polygon(0 0, 35% 0, 35% 70%, 70% 50%, 35% 30%, 35% 0, 100% 0, 100% 100%, 0 100%)')
    })

    //每秒偵測進度條位置
    setInterval(() => {
        $('#progress_bar').css('left', -100 + (audio.currentTime / audio.duration * 100) + '%')
        $('#progress_dot').css('left', (audio.currentTime / audio.duration * 100) + '%')
    }, 100);


    //調整音樂音量
    $("#audioVolume").on('input', function () {
        audio.volume = $("#audioVolume").val() / 100
    })

    //音樂播完唱片停止
    audio.addEventListener("ended", (event) => {
        $('.CDrotate').css('animation-play-state', 'paused')
    });

});

let color = '#000'

//畫圖用
function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        if (barHeight >= 0 && barHeight < 25.5) {
            barHeight = 25.5
        } else if (barHeight >= 25.5 && barHeight < 51) {
            barHeight = 51
        } else if (barHeight >= 51 && barHeight < 76.5) {
            barHeight = 76.5
        } else if (barHeight >= 76.5 && barHeight < 102) {
            barHeight = 102
        } else if (barHeight >= 102 && barHeight < 127.5) {
            barHeight = 127.5
        } else if (barHeight >= 127.5 && barHeight < 153) {
            barHeight = 153
        } else if (barHeight >= 153 && barHeight < 178.5) {
            barHeight = 178.5
        } else if (barHeight >= 178.5 && barHeight < 204) {
            barHeight = 204
        } else if (barHeight >= 204 && barHeight < 229.5) {
            barHeight = 229.5
        } else if (barHeight >= 229.5 && barHeight <= 255) {
            barHeight = 255
        }

        var grd = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        grd.addColorStop(0, "#cfcfcf00");
        grd.addColorStop(1, color);

        ctx.fillStyle = grd;
        ctx.fillRect(canvas.width - x, canvas.height - barHeight, barWidth, barHeight);

        x = x + barWidth + 15;

    }

}


//上傳CD
$("#uploadImg").change(function () {
    uploadCDImg(this);
    $('#CDImg').show()
});

//上傳Logo
$("#uploadLogo").change(function () {
    uploadlogoImg(this);
    $('.logowrap').show()
});

//輸入代表色
$("#uploadColor").change(function () {
    uploadColor($("#uploadColor").val());
});

//輸入原唱名字
$("#singerName").change(function () {
    $('.singerName').html($("#singerName").val())
});

//輸入歌名
$("#musicName").change(function () {
    $('.musicName').html($("#musicName").val())
});

//調整CD位置
$("#CDposition").on('input', function () {
    $("#CDImg").css('object-position', $("#CDposition").val() + '%')
    $(".wallpaper").css('background-position', $("#CDposition").val() + '% center')
})

//調整logo上下位置
$("#LogoPositionTop").on('input', function () {
    $("#logoImg").css('top', $("#LogoPositionTop").val() + '%')
})

//調整logo左右位置
$("#LogoPositionLeft").on('input', function () {
    $("#logoImg").css('left', $("#LogoPositionLeft").val() + '%')
})

//調整logo尺寸
$("#LogoPositionSize").on('input', function () {
    $("#logoImg").css('transform', 'scale(' + $("#LogoPositionSize").val() + '%)')
})

//logo陰影樣式
$('#whiteShadow').on('input', function () {
    $("#logoImg").css('filter', 'drop-shadow(0 15px 20px #fff)')
})

$('#blackShadow').on('input', function () {
    $("#logoImg").css('filter', 'drop-shadow(0 15px 20px #000)')
})

$('#noShadow').on('input', function () {
    $("#logoImg").css('filter', 'none')
})

let singerName_wrap, singerName, musicName_wrap, musicName;
//歌手名跑馬燈
$('#singerName').on('change', function () {

    $(".singerName").html($(this).val())

    singerName_wrap = $(".singerName_wrap").width() //容器寬
    singerName = $(".singerName").width()  //內文寬

    if (singerName > singerName_wrap) {
        $(".singerName").css({
            'transform': 'none',
            'animation-duration': (singerName * 0.01) + 's',
            'animation-name': 'marquee_singerName'
        })

        $('head').append(`
            <style>
                @keyframes marquee_singerName {
                    0% {
                        left:0px;
                    }

                    100% {
                        left: -`+ (singerName - singerName_wrap) + `px;
                    }
                }
            </style>
        `)

    } else if (singerName <= singerName_wrap) {
        $(".singerName").css({
            'transform': 'translateX(-50%)',
            'left': '50%',
            'animation-name': 'xx'
        })
    }

})

//歌名跑馬燈
$('#musicName').on('change', function () {

    $(".musicName").html($(this).val())

    musicName_wrap = $(".musicName_wrap").width() //容器寬
    musicName = $(".musicName").width()  //內文寬

    if (musicName > musicName_wrap) {
        $(".musicName").css({
            'transform': 'none',
            'animation-duration': (musicName * 0.01) + 's',
            'animation-name': 'marquee_musicName'
        })

        $('head').append(`
            <style>
                @keyframes marquee_musicName {
                    0% {
                        left:0px;
                    }

                    100% {
                        left: -`+ (musicName - musicName_wrap) + `px;
                    }
                }
            </style>
        `)

    } else if (musicName <= musicName_wrap) {
        $(".musicName").css({
            'transform': 'translateX(-50%)',
            'left': '50%',
            'animation-name': 'xx'
        })
    }

})



function uploadlogoImg(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#logoImg").attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function uploadCDImg(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#CDImg").attr("src", e.target.result);
            $(".wallpaper").css("background-image", 'url(' + e.target.result + ')');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function uploadColor(input) {
    $('.musicName').css('color', input)
    $('.gradient,#progress_bar,.fakeBtns div').css('background-color', input)
    $('.circle,.circle2,.circle3').css({
        'background-color': input + '33'
    })
    color = input
}

function timer(t) {
    let s, m
    m = Math.floor(t / 60)
    s = Math.floor(t % 60)

    m = String(m).padStart(2, '0')
    s = String(s).padStart(2, '0')

    return m + ':' + s

}

