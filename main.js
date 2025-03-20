// Select Elements
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let questionTitle = document.querySelector(".quiz-area ");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".sumbit-button");
let resultsContainer = document.querySelector(".results");
let categoryEle = document.querySelector(".category span");
let countDownEle = document.querySelector(".countdown");
// set Options
let curretnIndex = 0;
let rightAnswers = 0;
let countDownIntr;
let playOneOnly = false;
let storagePlay = window.localStorage.getItem("play-one");

// Check IF the Game Has Play One Time For Disbled
if (storagePlay) {
  playOneOnly = true;
  questionTitle.remove();
  answersArea.remove();
  submitButton.remove();
  bulletsSpanContainer.parentElement.remove();
  const dataFromLocalStorage = JSON.parse(storagePlay);
  resultsContainer.innerHTML = dataFromLocalStorage.score;
}
categoryEle.innerHTML = "&hearts;&hearts;&hearts;امتحان كيميا يا ميراا";
function getQuestions() {
  let myReq = new XMLHttpRequest();

  myReq.onreadystatechange = function () {
    if (this.status === 200 && this.readyState === 4) {
      let questionsObjext = JSON.parse(this.responseText);
      let qCount = questionsObjext.length;

      // Create Bullets + Set Questions Count
      createBullets(qCount);

      // Add Question Data
      addQuestionData(questionsObjext[curretnIndex], qCount);

      // Start Count Down
      countDown(60, qCount);

      // Click On Submit
      submitButton.onclick = function () {
        // Get Right Answer
        let rightAnswer = questionsObjext[curretnIndex].right_answer;

        // Increase Current Index
        curretnIndex++;

        // Check Answer Function
        checkAnswer(rightAnswer, qCount);

        // Remove Previous Question And Answers Area
        questionTitle.innerHTML = "";
        answersArea.innerHTML = "";

        // Add Question Data
        addQuestionData(questionsObjext[curretnIndex], qCount);

        // Handle Bullets Class
        handleBulletsClasses();

        // Start Count Down
        clearInterval(countDownIntr);
        countDown(60, qCount);

        // Show Results
        showResults(qCount);
      };
    }
  };

  myReq.open("GET", "./esay_kemia_questions.json", true);
  myReq.send();
}
if (!playOneOnly) {
  getQuestions();
}

function createBullets(num) {
  countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    // create Bullet
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on";
    }
    // Append Bullets To Main Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (curretnIndex < count) {
    // Create H2 Question Title
    let qTitle = document.createElement("h2");

    // Question Text
    let qTitleText = document.createTextNode(obj.title);

    //   Append The Text
    qTitle.appendChild(qTitleText);

    // Append The H2
    questionTitle.appendChild(qTitle);

    // Add The Ansers
    for (let i = 1; i <= 4; i++) {
      // Create Answer Div
      let aDiv = document.createElement("div");
      aDiv.className = "answer";

      // Create Check Input
      let radioInput = document.createElement("input");
      radioInput.setAttribute("type", "radio");
      radioInput.setAttribute("id", `answer_${i}`);
      radioInput.setAttribute("name", "questions");
      radioInput.dataset.answer = obj[`answer_${i}`];

      i === 1 ? (radioInput.checked = true) : "";

      // Append To Div
      aDiv.appendChild(radioInput);

      // Create Label
      let lable = document.createElement("label");
      let answerQ = document.createTextNode(obj[`answer_${i}`]);
      lable.htmlFor = `answer_${i}`;
      lable.appendChild(answerQ);

      // Append To Div
      aDiv.appendChild(lable);

      // Append To Main Div
      answersArea.appendChild(aDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  // Select All Inputs Radio
  let answers = document.getElementsByName("questions");
  let theChoosenAnswer;

  answers.forEach((input) => {
    if (input.checked === true) {
      let theChoosenAnswer = input.dataset.answer;

      if (theChoosenAnswer === rAnswer) {
        rightAnswers++;
      }
    }
  });
}
function handleBulletsClasses() {
  let allBuletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrOfSpans = Array.from(allBuletsSpans);

  // Loop
  arrOfSpans.forEach((span, i) => {
    if (curretnIndex === i) {
      span.className = "on";
    }
  });
}
function showResults(count) {
  let theResults;
  if (curretnIndex === count) {
    questionTitle.remove();
    answersArea.remove();
    submitButton.remove();
    bulletsSpanContainer.parentElement.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, Correct answers IS ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers IS Right`;
    } else {
      theResults = `<span class="bad">Bad</span>, Correct answers IS ${rightAnswers} From ${count} `;
    }
    resultsContainer.innerHTML = theResults;
    const dataObj = JSON.stringify({
      play: true,
      score: theResults,
    });
    window.localStorage.setItem("play-one", dataObj);
  }
}

function countDown(duretion, count) {
  if (curretnIndex < count) {
    let min, sec;
    countDownIntr = setInterval(() => {
      min = parseInt(duretion / 60);
      sec = parseInt(duretion % 60);

      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;
      countDownEle.innerHTML = `${min}:${sec}`;

      if (--duretion < 0) {
        clearInterval(countDownIntr);
        submitButton.click();
      }
    }, 1000);
  }
}
// localStorage.clear();
