/* =========================================================
   نظام الأذكار
========================================================= */

let currentZekr = 0;
let currentCount = 0;
let zekrList = [];
let zekrCategory = "";


function startAzkar(list, category) {

    zekrList = list;
    zekrCategory = category;

    currentZekr = 0;
    currentCount = 0;

    const card =
        document.getElementById("zekrCard");

    const reset =
        document.getElementById("resetButton");


    if (!card) {
        return;
    }


    renderZekr();


    card.addEventListener(
        "click",
        countZekr
    );


    if (reset) {

        reset.addEventListener(
            "click",
            resetAzkar
        );

    }

}


/* عرض الذكر */

function renderZekr() {

    const item =
        zekrList[currentZekr];


    if (!item) {
        finishAzkar();
        return;
    }


    const text =
        document.getElementById("zekrText");

    const counter =
        document.getElementById("counter");

    const progressText =
        document.getElementById("progressText");

    const progressBar =
        document.getElementById("progressBar");

    const overall =
        document.getElementById("overallProgress");


    text.textContent =
        item.text;


    counter.textContent =
        currentCount +
        " / " +
        item.count;


    progressText.textContent =
        "الذكر " +
        (currentZekr + 1) +
        " من " +
        zekrList.length;


    const percentage =
        Math.round(
            (currentZekr / zekrList.length) *
            100
        );


    progressBar.style.width =
        percentage + "%";


    overall.textContent =
        percentage + "%";
}


/* زيادة العداد */

function countZekr() {

    const item =
        zekrList[currentZekr];


    currentCount++;


    playTapSound();


    const card =
        document.getElementById("zekrCard");


    card.animate(
        [
            {
                transform:
                    "scale(1)"
            },

            {
                transform:
                    "scale(.975)"
            },

            {
                transform:
                    "scale(1)"
            }
        ],
        {
            duration: 140
        }
    );


    renderZekr();


    if (
        currentCount >=
        item.count
    ) {

        setTimeout(
            nextZekr,
            250
        );

    }

}


/* الذكر التالي */

function nextZekr() {

    currentZekr++;

    currentCount = 0;


    if (
        currentZekr >=
        zekrList.length
    ) {

        finishAzkar();

        return;
    }


    renderZekr();

}


/* صوت التكة */

function playTapSound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        const audio =
            new AudioContext();


        const oscillator =
            audio.createOscillator();


        const gain =
            audio.createGain();


        oscillator.type =
            "sine";


        oscillator.frequency.value =
            650;


        gain.gain.setValueAtTime(
            0.08,
            audio.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audio.currentTime + 0.07
        );


        oscillator.connect(gain);

        gain.connect(
            audio.destination
        );


        oscillator.start();

        oscillator.stop(
            audio.currentTime + .07
        );

    }

    catch(error) {

        console.log(
            "Audio unavailable"
        );

    }

}


/* إعادة الأذكار */

function resetAzkar() {

    currentZekr = 0;

    currentCount = 0;

    location.reload();

}


/* الانتهاء */

function finishAzkar() {

    const page =
        document.querySelector(
            ".zekr-page"
        );


    if (!page) {
        return;
    }


    page.innerHTML = `

        <div class="done-screen">

            <div class="done-icon">
                ✨
            </div>

            <div class="done-arabic">
                الحمد لله
            </div>

            <h1>
                تم إتمام الأذكار
            </h1>

            <p>
                تقبل الله منك وكتب لك الأجر
            </p>

            <div class="done-buttons">

                <button
                    onclick="location.reload()"
                >
                    إعادة الأذكار
                </button>

                <button
                    onclick="location.href='azkar.html'"
                >
                    اختيار أذكار أخرى
                </button>

            </div>

        </div>

    `;

}


/* =========================================================
   القرآن الكريم
========================================================= */

const QURAN_API =
    "https://api.alquran.cloud/v1";


let allSurahs = [];


/* تشغيل صفحة القرآن */

async function initQuran() {

    const list =
        document.getElementById(
            "surahList"
        );


    if (!list) {
        return;
    }


    try {

        const response =
            await fetch(
                QURAN_API +
                "/surah"
            );


        const result =
            await response.json();


        allSurahs =
            result.data;


        renderSurahs(
            allSurahs
        );


        const search =
            document.getElementById(
                "searchSurah"
            );


        if (search) {

            search.addEventListener(
                "input",
                function() {

                    const value =
                        this.value
                            .trim()
                            .toLowerCase();


                    const filtered =
                        allSurahs.filter(
                            surah =>

                            surah.name
                                .toLowerCase()
                                .includes(value)

                            ||

                            surah.englishName
                                .toLowerCase()
                                .includes(value)

                        );


                    renderSurahs(
                        filtered
                    );

                }
            );

        }


        const close =
            document.getElementById(
                "closeReader"
            );


        if (close) {

            close.addEventListener(
                "click",
                closeReader
            );

        }

    }

    catch(error) {

        list.innerHTML = `

            <div class="loading">

                تعذر تحميل القرآن الآن.

                <br><br>

                تأكد من اتصال الإنترنت ثم حاول مرة أخرى.

            </div>

        `;

        console.error(error);

    }

}


/* عرض السور */

function renderSurahs(
    surahs
) {

    const list =
        document.getElementById(
            "surahList"
        );


    if (!surahs.length) {

        list.innerHTML = `

            <div class="loading">
                لا توجد سورة بهذا الاسم
            </div>

        `;

        return;
    }


    list.innerHTML =
        surahs.map(
            surah => `

            <article
                class="surah-card"
                onclick="openSurah(${surah.number})"
            >

                <div class="surah-number">
                    ${surah.number}
                </div>

                <div class="surah-name">
                    ${surah.name}
                </div>

                <div class="surah-english">
                    ${surah.englishName}
                </div>

            </article>

        `
        ).join("");

}


/* فتح السورة */

async function openSurah(
    number
) {

    const reader =
        document.getElementById(
            "reader"
        );


    const info =
        document.getElementById(
            "surahInfo"
        );


    const ayahs =
        document.getElementById(
            "ayahs"
        );


    reader.classList.remove(
        "hidden"
    );


    info.innerHTML = `

        <div class="loading">
            جاري تحميل السورة...
        </div>

    `;


    ayahs.innerHTML = "";


    reader.scrollTop = 0;


    try {

        const response =
            await fetch(
                QURAN_API +
                "/surah/" +
                number +
                "/quran-uthmani"
            );


        const result =
            await response.json();


        const surah =
            result.data;


        info.innerHTML = `

            <div class="surah-title">

                <h2>
                    ${surah.name}
                </h2>

                <p>
                    ${surah.englishName}
                    —
                    ${surah.numberOfAyahs}
                    آية
                </p>

            </div>

        `;


        ayahs.innerHTML =
            surah.ayahs
                .map(
                    ayah => `

                    <div class="ayah">

                        ${ayah.text}

                        <span class="ayah-number">
                            ${ayah.numberInSurah}
                        </span>

                    </div>

                `
                )
                .join("");


        localStorage.setItem(
            "lastSurah",
            number
        );

    }

    catch(error) {

        info.innerHTML = `

            <div class="loading">
                حدث خطأ أثناء تحميل السورة.
            </div>

        `;

        console.error(error);

    }

}


/* إغلاق القارئ */

function closeReader() {

    const reader =
        document.getElementById(
            "reader"
        );


    reader.classList.add(
        "hidden"
    );

}