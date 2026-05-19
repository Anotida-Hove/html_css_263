
'use strict';

//  NAVIGATION 

/**
 * Shows the requested page, hides all others, and manages focus.
 * Updates aria-current on nav links (4.1.2).
 * Moves focus to the new page heading (2.4.3 Focus Order).
 * @param {string} id - page suffix, e.g. 'home', 'quiz'
 */
function showPage(id) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.setAttribute('aria-hidden', 'true');
  });

  // Show target page
  const target = document.getElementById('page-' + id);
  if (!target) return;
  target.classList.add('active');
  target.removeAttribute('aria-hidden');

  
  document.querySelectorAll('.nav-link').forEach(l => {
    l.removeAttribute('aria-current');
  });
  document.querySelectorAll(`.nav-link[data-page="${id}"]`).forEach(l => {
    l.setAttribute('aria-current', 'page');
  });

  
  const firstHeading = target.querySelector('h1, h2, h3');
  if (firstHeading) {
    firstHeading.setAttribute('tabindex', '-1');
    firstHeading.focus();
  }

  window.scrollTo(0, 0);

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    closeSidebar();
  }
}

/**
 * Opens the mobile sidebar and updates aria-expanded (4.1.2).
 */
function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const btn = document.getElementById('hamburger');
  sidebar.classList.add('open');
  btn.setAttribute('aria-expanded', 'true');
}

/**
 * Closes the mobile sidebar 
 */
function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const btn = document.getElementById('hamburger');
  sidebar.classList.remove('open');
  btn.setAttribute('aria-expanded', 'false');
}

/**
 * Toggles the mobile sidebar.
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
}

// Close sidebar when clicking main content on mobile
document.getElementById('main').addEventListener('click', () => {
  if (window.innerWidth <= 768) closeSidebar();
});

// 2.1.1 — close sidebar with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSidebar();
});


// OPTION TABS 



/**
 * @param {string} panelId - id of the tab panel to show
 * @param {HTMLElement} btn  - the tab button that was clicked/activated
 */
function showTab(panelId, btn) {
  const tablist = btn.closest('[role="tablist"]');
  const allTabs = tablist ? tablist.querySelectorAll('[role="tab"]') : document.querySelectorAll('.tab-btn');

  // Deactivate all tabs
  allTabs.forEach(t => {
    t.setAttribute('aria-selected', 'false');
    t.setAttribute('tabindex', '-1');
  });

  // Deactivate all panels
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.setAttribute('aria-hidden', 'true');
    p.classList.remove('active');
  });

  // Activate chosen tab
  btn.setAttribute('aria-selected', 'true');
  btn.setAttribute('tabindex', '0');

  // Activate chosen panel
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.setAttribute('aria-hidden', 'false');
    panel.classList.add('active');
  }
}

//  arrow key navigation within tablist
document.addEventListener('keydown', e => {
  const tab = e.target.closest('[role="tab"]');
  if (!tab) return;
  const tablist = tab.closest('[role="tablist"]');
  if (!tablist) return;
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const idx = tabs.indexOf(tab);

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    const next = tabs[(idx + 1) % tabs.length];
    next.focus();
    next.click();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
    prev.focus();
    prev.click();
  } else if (e.key === 'Home') {
    e.preventDefault();
    tabs[0].focus();
    tabs[0].click();
  } else if (e.key === 'End') {
    e.preventDefault();
    tabs[tabs.length - 1].focus();
    tabs[tabs.length - 1].click();
  }
});




/**
 * Toggles a discussion question open or closed.
 * @param {HTMLElement} el - the .discussion-q wrapper
 */
function toggleDiscussion(el) {
  const btn = el.querySelector('.discussion-btn');
  const answer = el.querySelector('.discussion-answer');
  const isOpen = el.classList.contains('open');

  el.classList.toggle('open', !isOpen);
  btn.setAttribute('aria-expanded', String(!isOpen));
  answer.setAttribute('aria-hidden', String(isOpen));
}


// QUIZ 

const questions = [
  {
    scenario: "Environmental Impact",
    question: "Generating deepfakes and training AI models requires massive data centers. What is a major, often overlooked environmental cost of these facilities?",
    options: [
      "They produce large amounts of physical plastic waste.",
      "They consume billions of liters of fresh water for cooling.",
      "They cause significant noise pollution in urban areas.",
      "They lead to an overproduction of recycled paper."
    ],
    correct: 1,
    feedback: "Data centers require enormous amounts of fresh water for cooling and massive electricity demand. This burden often falls on local communities who live near the infrastructure."
  },
  {
    scenario: "Immediate Action",
    question: "If you realize you have just sent money to an AI scammer, what should be your very first priority?",
    options: [
      "Delete your social media accounts immediately.",
      "Contact your bank to explain the situation and check for reversal options.",
      "Wait 24 hours to see if the person calls back.",
      "Try to hack the scammer's phone number."
    ],
    correct: 1,
    feedback: "Time is critical. Banks are a key stakeholder and may be able to stop or reverse a transfer if notified immediately. Reporting to agencies like the FTC or FBI should follow."
  },
  {
    scenario: "Supporting Others",
    question: "Your friend is devastated because they lost money to a deepfake voice scam. They say, 'I feel so stupid.' How should you respond according to care ethics?",
    options: [
      "Agree that they should have been more careful.",
      "Tell them it's their fault for posting too much on social media.",
      "Validate them by explaining these scams are engineered by professionals to fool smart people.",
      "Advise them to keep it a secret so they aren't embarrassed."
    ],
    correct: 2,
    feedback: "Shame keeps scams underreported. Validation before problem-solving is the most effective way to support a victim of a professional AI-engineered scam."
  },
  {
    scenario: "Digital Ethics",
    question: "Why is it considered a 'violation of dignity' when a scammer uses a deepfake of a family member?",
    options: [
      "Because the software used to make it is expensive.",
      "Because it weaponizes a person's identity and trust against the people they love.",
      "Because it makes the internet run slower.",
      "Because the video quality is usually poor."
    ],
    correct: 1,
    feedback: "This is an issue of Identity Theft. A person's likeness is tied to their dignity; using it without consent to deceive loved ones is a deep ethical violation."
  },
  {
    scenario: "Institutional Responsibility",
    question: "Which institution is at a 'critical intersection' because they can detect fraud before it completes?",
    options: [
      "Social media companies",
      "Environmental agencies",
      "Banks and financial institutions",
      "The local post office"
    ],
    correct: 2,
    feedback: "Banks have the tools to flag suspicious wire transfers and implement real-time warnings, making them a primary stakeholder in preventing financial loss."
  },
  {
    scenario: "Policy Options",
    question: "Under the 'Justice Lens,' why is government regulation of AI considered essential?",
    options: [
      "To make sure AI tools are faster.",
      "Because harms fall disproportionately on vulnerable groups like the elderly.",
      "To ensure everyone has a high-speed internet connection.",
      "To encourage scammers to move to different countries."
    ],
    correct: 1,
    feedback: "The Justice lens highlights that vulnerable or low-income individuals deserve equal legal protection from sophisticated threats they didn't ask to face."
  },
  {
    scenario: "Detection Tactics",
    question: "What is a 'Family Code Word' used for in the context of AI scams?",
    options: [
      "To log into your shared Netflix account.",
      "A secret phrase to verify a family member's identity during a supposed emergency.",
      "A password for your home Wi-Fi.",
      "A marketing term used by AI companies."
    ],
    correct: 1,
    feedback: "If a loved one calls in a panic, asking for a pre-arranged secret code word is a low-tech, highly effective way to bypass a high-tech deepfake."
  },
  {
    scenario: "The Ultimate Challenge",
    question: "You are on a video call with your company's CFO and several colleagues. They all look and sound perfect. The CFO asks you to transfer $25 million for an urgent secret contract. What should you do?",
    options: [
      "Complete the transfer immediately to show you are a good employee.",
      "Ask the other colleagues on the call to vote on it.",
      "Hang up and verify the request through a completely separate, trusted channel.",
      "Assume it's real because it's a live video with multiple people."
    ],
    correct: 2,
    feedback: "In the 2024 Hong Kong case, every other person on the call was a deepfake. Multiple 'colleagues' on a single call do not equal verification. Always use an independent channel (like a known office phone) to confirm."
  }
];

// Quiz state
let currentQ = 0;
let score = 0;
let answered = false;

/**
 * Initialises the quiz: hides the intro, shows the first question.
 
 */
function startQuiz() {
  currentQ = 0;
  score = 0;
  answered = false;
  document.getElementById('quiz-intro').style.display = 'none';
  document.getElementById('quiz-active').style.display = 'block';
  document.getElementById('quiz-results').style.display = 'none';
  renderQuestion();
}

/**
 
 * Uses a <fieldset>/<legend> pattern so screen readers announce the question
 * as the group label for each set of options (1.3.1, 4.1.2).
 */
function renderQuestion() {
  const q = questions[currentQ];
  answered = false;

  // Update next button
  const nextBtn = document.getElementById('next-btn');
  nextBtn.style.display = 'none';

  
  const progressText = document.getElementById('progress-text');
  progressText.textContent = `Question ${currentQ + 1} of ${questions.length}`;

  const progressFill = document.getElementById('progress-fill');
  const pct = Math.round(((currentQ + 1) / questions.length) * 100);
  progressFill.style.width = `${pct}%`;

  // Update progressbar 
  const progressBar = document.getElementById('progress-bar');
  progressBar.setAttribute('aria-valuenow', pct);
  progressBar.setAttribute('aria-valuetext', `Question ${currentQ + 1} of ${questions.length}`);

  // Build option buttons
  const optionsHtml = q.options.map((opt, i) =>
    `<button class="quiz-option" onclick="selectAnswer(${i})" aria-label="Option ${i + 1}: ${opt}">${opt}</button>`
  ).join('');

  // Use fieldset+legend so screen readers read the question as the group label 
  document.getElementById('question-card').innerHTML = `
    <div class="scenario-tag" aria-hidden="true">${q.scenario}</div>
    <fieldset style="border:none;padding:0;margin:0;">
      <legend>
        <h4>${q.question}</h4>
      </legend>
      <div class="quiz-options" role="group" aria-label="Answer options">
        ${optionsHtml}
      </div>
    </fieldset>
    <div class="quiz-feedback" id="quiz-feedback" aria-live="polite" aria-atomic="true"></div>
  `;

  //  move focus to question heading for keyboard/screen-reader users
  const legend = document.querySelector('#question-card legend');
  if (legend) { legend.setAttribute('tabindex', '-1'); legend.focus(); }
}

/**
 * Handles a user selecting an answer option.
 * @param {number} idx - index of chosen option
 */
function selectAnswer(idx) {
  if (answered) return;
  answered = true;

  const q = questions[currentQ];
  const buttons = document.querySelectorAll('.quiz-option');

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    btn.removeAttribute('onclick');
    if (i === q.correct) btn.classList.add('correct');
    else if (i === idx) btn.classList.add('wrong');
  });

  if (idx === q.correct) score++;

  const isCorrect = idx === q.correct;
  const feedbackEl = document.getElementById('quiz-feedback');
  feedbackEl.className = 'quiz-feedback' + (isCorrect ? '' : ' wrong-feedback');
  
  feedbackEl.innerHTML = `<strong>${isCorrect ? '✓ That\'s right.' : '✗ Not quite — but here\'s why this is tricky:'}</strong> ${q.feedback}`;
  feedbackEl.style.display = 'block';
  
  const nextBtn = document.getElementById('next-btn');
  nextBtn.style.display = 'block';
  nextBtn.textContent = currentQ === questions.length - 1 ? 'See Results →' : 'Next Question →';

  //  move focus to feedback so keyboard/screen-reader users notice it
  feedbackEl.setAttribute('tabindex', '-1');
  feedbackEl.focus();
}

/**
 * Advances to the next question or shows results.
 */
function nextQuestion() {
  currentQ++;
  if (currentQ >= questions.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

/**
 * Displays the results screen with score and personalised message.
 */
function showResults() {
  document.getElementById('quiz-active').style.display = 'none';
  const results = document.getElementById('quiz-results');
  results.style.display = 'block';

  document.getElementById('score-display').textContent = `${score} out of ${questions.length}`;

  let title, msg;
  if (score === 8) {
    title = "Excellent — You're Well Prepared!";
    msg = "You answered all questions correctly. You have a strong foundation for protecting yourself and others. Consider sharing what you've learned with family and friends — especially older relatives who may be targeted.";
  } else if (score >= 5) {
    title = "Good Awareness — Keep Building";
    msg = `You got ${score} out of 8 correct. Review the explanations for the questions you missed — each one covers a real tactic scammers use. The more familiar you are with these patterns, the better protected you'll be.`;
  } else {
    title = "Learning In Progress — That's Okay";
    msg = "These scams are deliberately designed to fool people — including careful, intelligent ones. Getting questions wrong now means you're learning exactly the right things. Review the explanations and try again. The goal is awareness, not a perfect score.";
  }

  document.getElementById('results-title').textContent = title;
  document.getElementById('results-message').textContent = msg;

  
  const heading = results.querySelector('h3');
  if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus(); }
}

/**
 
 */
function resetQuiz() {
  currentQ = 0;
  score = 0;
  answered = false;
  document.getElementById('quiz-results').style.display = 'none';
  document.getElementById('quiz-active').style.display = 'none';
  document.getElementById('quiz-intro').style.display = 'block';

  // 2.4.3 — return focus to start button
  const startBtn = document.querySelector('.start-quiz-btn');
  if (startBtn) startBtn.focus();
}
