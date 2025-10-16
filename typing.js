// Typing Test Core Script for Typingsprint Pro

document.addEventListener("DOMContentLoaded", () => {
  const typingArea = document.getElementById("typingArea");
  const inputArea = document.getElementById("inputArea");
  const wpmDisplay = document.getElementById("wpm");
  const accuracyDisplay = document.getElementById("accuracy");
  const errorsDisplay = document.getElementById("errors");
  const timeLeftDisplay = document.getElementById("timeLeft");
  const countdownDisplay = document.getElementById("countdown");

  let timer = null;
  let timeLeft = 0;
  let totalTime = 0;
  let testActive = false;
  let charIndex = 0;
  let errorCount = 0;
  let startTime = null;

  // Detect mode: predefined or custom
  const isPredefinedMode = document.getElementById("lesson") !== null;
  const isCustomMode = document.getElementById("customText") !== null;

  // ==============================
  // LESSONS (for predefined mode)
  // ==============================
  const lessons = {
    easy: "This reading or speaking test begins when you click 'Start'. The text will appear here as the test progresses. You can choose to read silently or speak the words out loud, depending on which skill you'd like to practice or measure.The reading test helps determine how many words per minute (WPM) you can read comfortably and accurately. It's designed to help you improve your reading fluency, focus, and comprehension over time. As you read the passage that appears, try to maintain a steady, natural pace. Once you've finished, click Stop to see your results.If you prefer to test your speaking skills, simply read the text aloud as it appears on the screen. This mode can help you become more confident with pronunciation, pacing, and clarity. Whether you're preparing for presentations, language exams, or simply want to strengthen your verbal fluency, this tool offers a helpful way to track your progress.",
    medium:
      "Reading and typing are two skills that often go hand in hand. If you read quickly, it’s easier to understand instructions, take in new information, and move on to the next task without getting stuck. And when you can type fast, you’re better able to keep up with your thoughts, whether you're writing an essay, taking notes, or answering questions.These skills support each other in everyday tasks. A faster reader can understand what needs to be written or done more quickly, while a faster typist can respond or record ideas without losing track. This combination can save time, reduce frustration, and help you stay focused.Working on both reading and typing speed at the same time can make learning smoother and more efficient. Whether you're studying, working, or just trying to get things done, strong reading and typing skills can make a real difference",
    hard:
      "As the global population continues to grow, the demand for food is increasing, putting immense pressure on agricultural systems around the world. Traditional farming methods, while effective, often come at a cost to the environment, depleting soil, polluting water supplies, and contributing to climate change. To meet the needs of future generations, sustainable agricultural practices are essential.Sustainable agriculture involves practices that protect the environment, preserve natural resources, and maintain the health of ecosystems. This includes techniques such as crop rotation, agroforestry, organic farming, and the use of natural pest control methods. By focusing on long-term ecological health rather than short-term gains, sustainable agriculture aims to balance food production with environmental conservation.One key component of sustainable agriculture is reducing the environmental impact of industrial farming practices. The overuse of chemical fertilizers and pesticides has led to soil degradation and the contamination of water sources. Sustainable practices, such as using compost and organic fertilizers, can help maintain soil fertility and reduce the need for harmful chemicals. Additionally, technologies such as precision agriculture, which uses data to",
  };

  // ==============================
  // START TEST FUNCTION
  // ==============================
  function startTest(selectedText, selectedTime) {
    typingArea.innerHTML = "";
    selectedText.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      typingArea.appendChild(span);
    });

    inputArea.value = "";
    inputArea.disabled = false;
    inputArea.focus();

    charIndex = 0;
    errorCount = 0;
    wpmDisplay.textContent = 0;
    accuracyDisplay.textContent = "100%";
    errorsDisplay.textContent = 0;
    testActive = true;
    startTime = new Date();

    totalTime = selectedTime;
    timeLeft = selectedTime;
    if (timeLeft > 0) {
      startCountdown();
    } else {
      timeLeftDisplay.textContent = "∞";
      countdownDisplay.textContent = "Free Mode";
    }
  }

  // ==============================
  // COUNTDOWN TIMER
  // ==============================
  function startCountdown() {
    clearInterval(timer);
    timeLeftDisplay.textContent = timeLeft;
    countdownDisplay.textContent = `⏳ ${timeLeft}s remaining`;

    timer = setInterval(() => {
      timeLeft--;
      timeLeftDisplay.textContent = timeLeft;
      countdownDisplay.textContent = `⏳ ${timeLeft}s remaining`;

      if (timeLeft <= 0) {
        endTest();
      }
    }, 1000);
  }

  // ==============================
  // HANDLE TYPING INPUT
  // ==============================
  inputArea.addEventListener("input", (e) => {
    if (!testActive) return;

    const characters = typingArea.querySelectorAll("span");
    const inputChars = inputArea.value.split("");

    // Check for Enter key — auto end
    if (inputChars.includes("\n")) {
      endTest();
      return;
    }

    let correctCount = 0;
    errorCount = 0;

    characters.forEach((charSpan, index) => {
      const typedChar = inputChars[index];

      if (typedChar == null) {
        charSpan.classList.remove("correct", "incorrect");
      } else if (typedChar === charSpan.textContent) {
        charSpan.classList.add("correct");
        charSpan.classList.remove("incorrect");
        correctCount++;
      } else {
        charSpan.classList.add("incorrect");
        charSpan.classList.remove("correct");
        errorCount++;
      }
    });

    // Update Stats
    const elapsedMinutes = (new Date() - startTime) / 60000;
    const wordsTyped = inputChars.length / 5;
    const wpm = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;
    const accuracy =
      inputChars.length > 0
        ? Math.max(0, Math.round(((inputChars.length - errorCount) / inputChars.length) * 100))
        : 100;

    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = `${accuracy}%`;
    errorsDisplay.textContent = errorCount;

    // Auto end if finished all characters
    if (inputChars.length === characters.length) {
      endTest();
    }
  });

  // ==============================
  // END TEST
  // ==============================
  function endTest() {
    clearInterval(timer);
    testActive = false;
    inputArea.disabled = true;
    countdownDisplay.textContent = "✅ Test Completed!";
  }

  // ==============================
  // PREDEFINED MODE
  // ==============================
  if (isPredefinedMode) {
    document.getElementById("startTest").addEventListener("click", () => {
      const lessonType = document.getElementById("lesson").value;
      const timeSelect = parseInt(document.getElementById("time").value, 10);
      startTest(lessons[lessonType], timeSelect);
    });
  }

  // ==============================
  // CUSTOM MODE
  // ==============================
  if (isCustomMode) {
    const customTextArea = document.getElementById("customText");
    const loadBtn = document.getElementById("loadCustomText");

    loadBtn.addEventListener("click", () => {
      const userText = customTextArea.value.trim();
      if (userText.length < 10) {
        alert("Please enter at least 10 characters to start the test!");
        return;
      }
      startTest(userText, 0); // Free mode for custom text
    });
  }
});
