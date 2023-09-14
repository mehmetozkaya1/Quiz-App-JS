// Question class'ı nın oluşturulması
function Question(question, options, true_answer) {
    this.question = question,
    this.options = options,
    this.true_answer = true_answer
};

// Ses efektleri
let error_sound = new Audio("sounds/error.mp3");
let correct_sound = new Audio("sounds/correct.mp3");
let background_music = new Audio("sounds/music.mp3");
background_music.volume = 0.2;

// Soru listesi
let questions = [
    question1 = new Question("Aşağıdakilerden hangisi Türkiye'nin başkentidir?",{A : "İstanbul", B : "Ankara", C : "İzmir", D : "Bursa"},"B"),
    question2 = new Question("Kalsiyum elementinin atom numarası kaçtır?",{A : "15", B : "20", C : "25", D : "30"},"B"),
    question3 = new Question("x = |x + 8| denklem sistemini sağlayan x değerleri nelerdir?",{A : "{0}", B : "{0,1}", C : "{0,3}", D : "{0,8}"},"A"),
    question4 = new Question("Türkiye'nin en yüksek dağı aşağıdakilerden hangisidir?",{A : "Süphan Dağı", B : "Ağrı Dağı", C : "Erciyes Dağı", D : "Hasan Dağı"},"B")
];

// Quiz class'ı oluşturuyoruz.
function Quiz(questions){
    this.questions = questions,
    this.question_index = 0,
    this.correct_answer = 0,
    this.time = 14
}

// Soruları otomatik olarak alıp getirecek metot.
Quiz.prototype.soruGetir = function(){
    return questions[quiz.question_index];
} 

// Soruları otomatik olarak alıp gösterecek metot.
Quiz.prototype.soruGoster = function(soru){
    // Soru metninin gösterilmesi
    if(quiz.question_index < 4){
        document.querySelector(".question_text").innerHTML = `<span>${quiz.question_index + 1}-)${soru.question}</span>`;

        let options = "";
        // Soru cevap seçeneklerinin gösterilmesi
        for(var opt_keys of Object.keys(soru.options)){
            options += `<div class="option"><div class="space">
            <span><b>${opt_keys}</b></span> : ${soru.options[opt_keys]}</div></div>`;
        }

        document.querySelector(".option_list").innerHTML = options;

        // seçeneklere tıklanıldığında verilen fonksiyonu çalıştıran attribute ekleme işlemi
        var optionss = document.querySelectorAll(".option"); // Tüm seçenek divlerini seçtik.

        for(var opt of optionss){
            opt.setAttribute("onclick","secenekSecildi()");
        }

        quiz.soruSayisiGoster();
    }
}

// Badge içerisinde kaçıncı soruda olduğumuzu gösterecek olan metot.
Quiz.prototype.soruSayisiGoster = function(){
    document.querySelector(".question_number span").textContent = `${quiz.question_index + 1}/${quiz.questions.length}`;
}

var counter;

// Geri sayımı Başlatacak olan fonksiyon
Quiz.prototype.startTimer = function(){ 
    quiz.time = 15;
    counter = setInterval(geriSayim, 1000);

    function geriSayim(){
        document.querySelector(".timer_text").textContent = "Kalan Süre";
        document.querySelector(".timer_second").textContent = quiz.time;
        quiz.time -= 1;
    
        if(quiz.time < 0){
            clearInterval(counter);
            document.querySelector(".timer_text").innerHTML = "Süre Doldu!";
            document.querySelector(".option_list").classList.add("disabled");

            var option_list = document.querySelector(".option_list").children;

            var cevap = quiz.soruGetir().true_answer;

            for(let option of option_list){
                if(option.querySelector("span b").textContent === cevap){
                    option.classList.add("correct");
                    error_sound.play();
                }
            }

            document.querySelector(".btn_next").classList.add("show_btn");
        }
    }
}

var counterLine;

Quiz.prototype.timerLine = function(){
    var line_width = 0;
    counterLine = setInterval(wideLine, 100);

    function wideLine(){
        document.querySelector(".timer_stick").style.width = `${line_width}` + "px";
        line_width += 4.1;

        if(line_width > 650){
            clearInterval(counterLine);
        }
    }
}

let quiz = new Quiz(questions);

// Herhangi bir seçeceğe tıklanıldığında geriye tıklanılan seçeneğin cevabını alan fonksiyon

function secenekSecildi(){
    var soru = quiz.soruGetir();
    var verilen_cevap;
    document.querySelector(".btn_next").classList.add("show_btn");
    document.querySelector(".option_list").onclick = e => {
        verilen_cevap = e.target.querySelector("span b").textContent;

        if(soru.true_answer === verilen_cevap){
            quiz.correct_answer += 1;
            e.target.classList.add("correct");
            e.target.insertAdjacentHTML("beforeend",'<div class="icon"><i class="fas fa-check"></i></div>');
            correct_sound.play();
        } else{
            e.target.classList.add("incorrect");
            e.target.insertAdjacentHTML("beforeend",'<div class="icon"><i class="fas fa-times"></i></div>');
            error_sound.play();
        }

        document.querySelector(".option_list").classList.add("disabled");
        clearInterval(counter);
        clearInterval(counterLine);
    }
}

// Start Quiz butonu click event'i
btn_start = document.querySelector(".btn_start");
btn_start.addEventListener("click",function(){
    background_music.play();
    document.querySelector(".btn_start").classList.remove("show");
    document.querySelector(".quiz_card").classList.add("show_card");
    quiz.soruGoster(quiz.soruGetir());
    quiz.startTimer();
    quiz.timerLine();
});

// Sonraki Soru Butonu click event'i
btn_next = document.querySelector(".btn_next");
btn_next.addEventListener("click",function(){
    clearInterval(counter);
    clearInterval(counterLine);
    quiz.startTimer();
    quiz.timerLine();
    document.querySelector(".btn_next").classList.remove("show_btn");
    quiz.question_index += 1;
    quiz.soruGoster(quiz.soruGetir());
    document.querySelector(".option_list").classList.remove("disabled");
    console.log(quiz.correct_answer);

    if(quiz.question_index == quiz.questions.length - 1){
       document.querySelector(".btn_next").innerHTML = "Quiz'i Bitir";
    } else if(quiz.question_index == quiz.questions.length){
        document.querySelector(".quiz_card").classList.remove("show_card");
        document.querySelector(".btn_start_box").classList.remove("show");
        document.querySelector(".results").classList.add("show_results");
        document.querySelector(".result_text").innerHTML = `${quiz.questions.length} soru içerisinden ${quiz.correct_answer} tanesine doğru cevap verdiniz.`
    }
});

// Quiz'i bitir butonuna basıldığında sayfayı yeniler.
btn_quit = document.querySelector(".btn_quit");

btn_quit.addEventListener("click", function(){
    window.location.reload();
});

btn_replay = document.querySelector(".btn_replay");

btn_replay.addEventListener("click", function(){
    clearInterval(counter);
    clearInterval(counterLine);
    quiz.question_index = 0;
    quiz.correct_answer = 0;
    btn_start.click();
    document.querySelector(".results").classList.remove("show_results");
});