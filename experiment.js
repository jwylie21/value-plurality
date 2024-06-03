
// DEFINE GLOBAL VARIABLES
let timeline = [];

// jsPsych Initialization
const jsPsych = initJsPsych({
  use_webaudio: false,
  display_element: 'jspsych-target',
  auto_preload: true,
  show_progress_bar: true,
  default_iti: 0,
  on_finish: function (data) {
    jsPsych.data.displayData('csv');
  }
});

const participantId = jsPsych.data.getURLVariable('PROLIFIC_PID');
const studyId = jsPsych.data.getURLVariable('STUDY_ID');
const sessionId = jsPsych.data.getURLVariable('SESSION_ID');

const filename = `${participantId}` + "_" + `${studyId}` + "_" + `${sessionId}.csv`;

// Randomize assignment of condition:
let pluralCondition = jsPsych.randomization.sampleWithoutReplacement(['self', 'other'], 1)[0];

jsPsych.data.addProperties({
  participantId: participantId,
  studyId: studyId,
  sessionId: sessionId,
  pluralCondition: pluralCondition
});

// Options
const valueOpinionOptions = ['Yes', 'Somewhat', 'No'];

// Political Ideology
const politicalResponses = [
  "1 (Extremely liberal)",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7 (Extremely conservative)",
];

// ENTER FULLSCREEN //
const enterFullscreen = {
  type: jsPsychFullscreen,
  name: 'enter_fullscreen',
  fullscreen_mode: true,
  delay_after: 0
};

timeline.push(enterFullscreen)

// CONSENT FORM //
const consentForm = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'consent',
      prompt: `
            <p style="text-align:left;">
            Informed Consent Form for IRB Study #2019-0338
            Thank you for your interest in participating in our study!

            You are being asked to participate in this research study because you are at 
            least 18 years old and have self-selected to participate.
            
            </p>
            <p style="text-align: left;">
            
            The purpose of this research study is to test how social judgments interact with perception and cognition, 
            and whether specific pieces of information influence social judgments. 
            If you agree to participate, we will ask you to: (1) view a series of images, pictures, film clips, stories, 
            newspaper articles, or write about a time from your past; (2) complete a cognitive task in which you will 
            view a series of stimuli for a short period of time, recall or categorize them, sort pictures and words, 
            visually search a display of letters, word/letter recognition task, or solve puzzles; 
            or (3) complete various personality, individual difference, and demographic questionnaires. In some cases, 
            you will skip the first step and simply begin the cognitive task.
            
            </p>
            <p style="text-align: left;">
            This experiment will take about 10 minutes. 
            Participants do not receive compensation if they withdraw prior to completion 
            of the experiment. We do not anticipate any possible risks. 
            However, we will be presenting you with material that has emotional 
            qualities that may induce discomfort viewing such material.

            </p>
            <p style="text-align: left;">
            The material may consist of scary animals, disgusting material, or repugnant material/themes/characters. 
            If you decide to participate, the information recorded will remain confidential, 
            and your identifying information will not be stored with your data.
            </p>
            <p style="text-align: left;">

            We will ask you general questions about your background, political beliefs, and other demographic data, 
            but no sensitive information will be asked or recorded. 
            The data is tied only to a non-descript subject ID, which will be the only subject identifying 
            information that we will use during data analyses. 
            Additionally, the websites used for data collection are password protected/encrypted.
            </p>
            
            <p style="text-align: left;">
            Your participation in this research is voluntary.

            </p>
            <p style="text-align: left;">
            
            If you have any questions, please contact Ana Gantman at ana.gantman@brooklyn.cuny.edu. 
            If you have any questions about your rights as a research participant or if you would 
            like to talk to someone other than the researchers, you can contact CUNY Research 
            Compliance Administrator at 646-664-8918 or HRPP@cuny.edu.

            </p>
            <p style="text-align: left;">
              If you agree to the statements above and agree to participate in this study,
              please select the “Consent given” button below to continue.
            </p>`,
      options: ["Consent not given", "Consent given"],
      horizontal: true,
      required: true
    }
  ],
  preamble: '<h2 style="text-align: center"><strong>Consent Form</strong></h2>',

  // If the participant does not consent, end the experiment
  on_finish: function (data) {
    if (jsPsych.data.get().last(1).values()[0].response.consent == "Consent not given") {
      jsPsych.endExperiment(
        `<p class="jspsych-center">
          You did not consent to participate in this study.<br>
          Please return this study in Prolific.
        </p>`
      );
    }
  }
};

timeline.push(consentForm);

// Individual INSTRUCTIONS //
const instructionsSelf = {
  type: jsPsychInstructions,
  pages: [
    `<h2><strong>Instructions</strong></h2>
     <p style="text-align: left;">
       Welcome to the experiment! In this study, we will ask you about the kinds of pursuits
       people value in life. 
     </p>`,

    `<p style="text-align: left;">
      Imagine this circle represents all the time a single person has:
     </p>
     <img src="images/piealone.jpg" style="display: block; margin: 0 auto; width: 50%;">
     `,

     `<p style="text-align: left;">
     We want you to think about creating an ideal life. We want to know how much time you think 
     a person should dedicate in their life to different pursuits. 
     </p>

     <p style="text-align: left;">
     These pursuits include:
     <ul style="text-align: left;">
       <li>Knowledge (pursuing truth, science, or technology)</li>
       <li>Morality (helping those in need, caring for others)</li>
       <li>Politics (pursuing social order and organization)</li>
       <li>Pleasures (pursuing enjoyment, play, and leisure in life)</li>
       <li>Self-expression (making art, music, perfecting a sport)</li>
     </ul>
     </p>`,

    `<p style="text-align: left;">
    You will see a pie chart like the one below and be asked to edit it so that it matches how much of their time you 
    think a person should dedicate to each of the different pursuits. 
    <p style="text-align: left;"> In the example below, all of the pursuits are weighted 
    exactly equally.</p> 
    </p>
    <img src="images/piegroups.jpg" alt="Example Pie Chart" style="display: block; margin: 0 auto; width: 40%;">`,

    `<p style="text-align: left;">
    You will edit the circle so that it matches what you think a person should pursue. You may not see all the things you value, 
    or see some that you value very little. That is okay. Your task is to adjust the amounts of the pursuits you are shown. 
    </p>`,

    `<p style="text-align: left;">
    You will start with a pie chart where all of the values are evenly broken up. The values of the pie chart must equal exactly 100. 
    </p>`,


    `<p style="text-align: left;">
    Your task will begin on the next page. 
    </p>`

  ],
  show_clickable_nav: true,
};

// Society/Other people INSTRUCTIONS //
const instructionsOther = {
  type: jsPsychInstructions,
  pages: [
    `<h2><strong>Instructions</strong></h2>
     <p style="text-align: left;">
       Welcome to the experiment! In this study, we will ask you about the kinds of pursuits
       people value in life. 
     </p>`,

    `<p style="text-align: left;">
      Imagine this circle represents all the time people in a society have:
     </p>
     <img src="images/piealone.jpg" style="display: block; margin: 0 auto; width: 50%;">
     `,

     `<p style="text-align: left;">
     We want you to think about creating an ideal society. We want to know how much time people in that 
     society should dedicate to different pursuits. 
     </p>

   
     <p style="text-align: left;">
     These pursuits include:
     <ul style="text-align: left;">
     <li>Knowledge (pursuing truth, science, or technology)</li>
     <li>Morality (helping those in need, caring for others)</li>
     <li>Politics (pursuing social order and organization)</li>
     <li>Pleasures (pursuing enjoyment, play, and leisure in life)</li>
     <li>Self-expression (making art, music, perfecting a sport)</li>
     </ul>
     </p>`,

    `<p style="text-align: left;">
    You will see a pie chart like the one below and be asked to edit it so that it matches how much of their time you 
    think people in society should dedicate to each of the different pursuits. 
    <p style="text-align: left;"> In the example below, all of the pursuits are weighted 
    exactly equally.</p> 
    </p>
    <img src="images/piegroups.jpg" alt="Example Pie Chart" style="display: block; margin: 0 auto; width: 40%;">`,

    `<p style="text-align: left;">
    You will edit the circle so that it matches what you think people in society should pursue. You may not see all the things you value, 
    or see some that you value very little. That is okay. Your task is to adjust the amounts of the pursuits you are shown. 
    </p>`,

    `<p style="text-align: left;">
    You will start with a pie chart where all of the values are evenly broken up. The values of the pie chart must equal exactly 100. 
    </p>`,


    `<p style="text-align: left;">
    Your task will begin on the next page. 
    </p>`

  ],
  show_clickable_nav: true,
};

// TASK 
let proportions = {};

const pieChartTrial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
  <div style="text-align: center; margin-bottom: 20px;">
    <p>
      <b>Adjust the amount of each of the following pursuits:</b></p>
      <p>Knowledge relates to pursuing truth, science or technology, Moral relates to helping those in need, caring for others,
      Politics relates to pursuing social order and organization, Pleasures relates to pursuing enjoyment, play, and leisure in life,
      and Self-expression relates to making art, perfecting a sport. </p>
    </p>
  </div>

  <div id="pieChartContainer" style="width: 400px; height: 400px; margin: 0 auto;">
    <canvas id="pieChart"></canvas>
  </div>
  <div id="inputContainer" style="width: 400px; margin: 0 auto; text-align: left;">
    <label for="cat1">Self-expression:</label>
    <input type="number" id="cat1" value="20" min="0" max="100"><br>
    <label for="cat2">Knowledge:</label>
    <input type="number" id="cat2" value="20" min="0" max="100"><br>
    <label for="cat3">Morality:</label>
    <input type="number" id="cat3" value="20" min="0" max="100"><br>
    <label for="cat4">Politics:</label>
    <input type="number" id="cat4" value="20" min="0" max="100"><br>
    <label for="cat5">Pleasures:</label>
    <input type="number" id="cat5" value="20" min="0" max="100"><br>
  </div>
  <p></p>
  <p id="error-message" style="color: red;"></p>
  <p>The piechart will update when the values equal 100. </p>
  <p>Press the <b>space bar</b> when you are done adjusting the proportions to continue.</p>
  `,
  choices: [' '],
  on_load: function() {
    var ctx = document.getElementById('pieChart').getContext('2d');
    var pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Self-expression', 'Knowledge', 'Morality', 'Politics', 'Pleasures'],
        datasets: [{
          data: [20, 20, 20, 20, 20],
          backgroundColor: ['red', 'blue', 'green', 'yellow', 'orange']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    function updateChart() {
      var data = [
        parseInt(document.getElementById('cat1').value),
        parseInt(document.getElementById('cat2').value),
        parseInt(document.getElementById('cat3').value),
        parseInt(document.getElementById('cat4').value),
        parseInt(document.getElementById('cat5').value)
      ];

      var total = data.reduce((a, b) => a + b, 0);

      if (total === 100) {
        pieChart.data.datasets[0].data = data;
        pieChart.update();
        document.getElementById('error-message').innerText = '';
        // Store the values in the global variable
        proportions = {
          cat1: data[0],
          cat2: data[1],
          cat3: data[2],
          cat4: data[3],
          cat5: data[4]
        };
      } else {
        document.getElementById('error-message').innerText = 'Total proportion must be exactly 100.';
      }
    }

    document.querySelectorAll('#inputContainer input').forEach(input => {
      input.addEventListener('input', updateChart);
    });
  },
  on_finish: function(data) {
    jsPsych.data.addDataToLastTrial({ proportions: proportions });
  }
};


// Add the pie chart trial to the timeline based on the condition
if (pluralCondition === 'self') {
  timeline.push(instructionsSelf, pieChartTrial);
} else if (pluralCondition === 'other') {
  timeline.push(instructionsOther, pieChartTrial);
}

///////////////////// Add follow up questions 

//open ended
var explain = {
  type: jsPsychSurveyText,
  questions: [
    {prompt: 'Why did you complete the pie chart in the way you did?', name: 'pieexplain', rows: 5}  ]
}

timeline.push(explain);

// other questions
var whichone = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "If you had to choose, which of the pursuits do you think is most important to being human?", 
      name: 'human', 
      options: ['Knowledge',  'Morality', 'Pleasures', 'Politics', 'Self-expression' ], 
      required: true,
      horizontal: true
    }, 
    {
      prompt: "In your life now, which of the pursuits would you say YOU most pursue in your life?", 
      name: 'youvalue', 
      options: ['Knowledge',  'Morality', 'Pleasures', 'Politics', 'Self-expression' ], 
      required: true,
      horizontal: true
    },

    {
      prompt: "Which of the pursuits should YOU most pursue in your life?", 
      name: 'shouldvalue', 
      options: ['Knowledge',  'Morality', 'Pleasures', 'Politics', 'Self-expression' ], 
      required: true,
      horizontal: true
    },

    {
      prompt: "Which of the pursuits should OTHERS spend most time pursuing in their lives?", 
      name: 'othersshould', 
      options: ['Knowledge',  'Morality', 'Pleasures', 'Politics', 'Self-expression' ], 
      required: true,
      horizontal: true
    }
  ],
};

timeline.push(whichone);

var likert_scale = [
  'Not at all important', 
  'Slightly important', 
  'Moderately important', 
  'Very important', 
  'Extremely important'
];

var ourmfq = {
  type: jsPsychSurveyLikert,
  questions: [
    {prompt: "Knowledge", name: 'Knowledge', labels: likert_scale},
    {prompt: "Morality", name: 'Morality', labels: likert_scale},
    {prompt: "Pleasures", name: 'Pleasures', labels: likert_scale},
    {prompt: "Politics", name: 'Politics', labels: likert_scale},
    {prompt: "Self-expression", name: 'Self-expression', labels: likert_scale},
  ],
  preamble:" In this section, please rate each item on how important it would be to you when trying to decide if a pursuit was valuable or not.",
  randomize_question_order: true
};

timeline.push(ourmfq);

/////////////////////////////////////////////// DEMOGRAPHICS ///////////////////////////////////////////////
const demographicsQuestions = {
  type: jsPsychSurveyHtmlForm,
  preamble:
    `<p class="jspsych-survey-multi-choice-preamble">
      Using the scales provided, please respond to each question about you as an individual:
    </p>`,
  html: `
        <!-- Age -->

        <div class="jspsych-survey-multi-choice-question">
          <label for="age">How old are you?</label><br>
          <input 
            type="number" 
            id="age" 
            name="age" 
            min="18" max="100" 
            style="padding: 5px; width: 40px;" 
            class="incomplete"
            oninput="this.classList.remove('incomplete');"
          >
        </div>
        

        <!-- Race/Ethnicity -->

        <div class="jspsych-survey-multi-choice-question">
          <legend>Please indicate how you identify yourself:</legend>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-indigenous" 
              name="race-ethnicity-indigenous" 
              value="Indigenous American or Alaskan Native" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-indigenous">Indigenous American or Alaskan Native</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-asian" 
              name="race-ethnicity-asian" 
              value="Asian or Asian-American" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-asian">Asian or Asian-American</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-black" 
              name="race-ethnicity-black" 
              value="African or African-American" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-black">African or African-American</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-native" 
              name="race-ethnicity-native" 
              value="Native Hawaiian or Pacific Islander" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-native">Native Hawaiian or other Pacific Islander</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-white" 
              name="race-ethnicity-white" 
              value="White" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-white">White</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-hispanic" 
              name="race-ethnicity-hispanic" 
              value="Hispanic/Latino/a/e/x" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-hispanic">Hispanic/Latino/a/e/x</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox" 
              id="race-ethnicity-other" 
              name="race-ethnicity-other" 
              value="Other" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-other">Other</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="checkbox"
              id="race-ethnicity-prefer-not" 
              name="race-ethnicity-prefer-not" 
              value="Prefer not to disclose" 
              class="demographics-race-ethnicity incomplete"
              oninput="
                let demographicsRaceEthnicity = document.querySelectorAll(
                  '.demographics-race-ethnicity'
                );
                for (let i = 0; i < demographicsRaceEthnicity.length; i++) {
                  demographicsRaceEthnicity[i].classList.remove('incomplete');
                };
              "
            >
            <label for="race-ethnicity-prefer-not">Prefer not to disclose</label>
          </div>
        </div>


        <!-- Gender -->
        
        <div class="jspsych-survey-multi-choice-question">
          <legend>With which gender do you most closely identify?</legend>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-man" 
              name="gender-man" 
              value="Man" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-man">Man</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-woman" 
              name="gender-woman" 
              value="Woman" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-woman">Woman</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-non-binary" 
              name="gender-non-binary" 
              value="Non-binary" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-non-binary">Non-binary</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-other" 
              name="gender-other" 
              value="Other" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-other">Other</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="gender-prefer-not" 
              name="gender-prefer-not" 
              value="Prefer not to disclose" 
              class="demographics-gender incomplete"
              oninput="
                let demographicsGender = document.querySelectorAll(
                  '.demographics-gender'
                );
                for (let i = 0; i < demographicsGender.length; i++) {
                  demographicsGender[i].classList.remove('incomplete');
                };
              "
            >
            <label for="gender-prefer-not">Prefer not to disclose</label>
          </div>
        </div>


        <!-- Education -->
        
        <div class="jspsych-survey-multi-choice-question">
          <legend>
            What is the highest level of education you have received? 
            (If you are currently enrolled in school, please indicate the highest degree you have received)
          </legend>
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="education-less-high-school" 
              name="education-less-high-school" 
              value="Less than a high school diploma" 
              class="demographics-education incomplete"
              oninput="
                let demographicsEducation = document.querySelectorAll(
                  '.demographics-education'
                );
                for (let i = 0; i < demographicsEducation.length; i++) {
                  demographicsEducation[i].classList.remove('incomplete');
                };
              "
            >
            <label for="education-less-high-school">
              Less than a high school diploma
            </label>
          </div>

          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="education-high-school" 
              name="education-high-school" 
              value="High school degree or equivalent (e.g. GED)" 
              class="demographics-education incomplete"
              oninput="
                let demographicsEducation = document.querySelectorAll(
                  '.demographics-education'
                );
                for (let i = 0; i < demographicsEducation.length; i++) {
                  demographicsEducation[i].classList.remove('incomplete');
                };
              "
            >
            <label for="education-high-school">
              High school degree or equivalent (e.g. GED)
            </label>
          </div>

          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="education-some-college" 
              name="education-some-college" 
              value="Some college, no degree" 
              class="demographics-education incomplete"
              oninput="
                let demographicsEducation = document.querySelectorAll(
                  '.demographics-education'
                );
                for (let i = 0; i < demographicsEducation.length; i++) {
                  demographicsEducation[i].classList.remove('incomplete');
                };
              "
            >
            <label for="education-some-college">
              Some college, no degree
            </label>
          </div>

          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="education-associate" 
              name="education-associate" 
              value="Associate Degree (e.g. AA, AS)" 
              class="demographics-education incomplete"
              oninput="
                let demographicsEducation = document.querySelectorAll(
                  '.demographics-education'
                );
                for (let i = 0; i < demographicsEducation.length; i++) {
                  demographicsEducation[i].classList.remove('incomplete');
                };
              "
            >
            <label for="education-associate">
              Associate Degree (e.g. AA, AS)
            </label>
          </div>

          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="education-bachelors" 
              name="education-bachelors" 
              value="Bachelor's Degree (e.g. BA, BS)" 
              class="demographics-education incomplete"
              oninput="
                let demographicsEducation = document.querySelectorAll(
                  '.demographics-education'
                );
                for (let i = 0; i < demographicsEducation.length; i++) {
                  demographicsEducation[i].classList.remove('incomplete');
                };
              "
            >
            <label for="education-bachelors">
              Bachelor's Degree (e.g. BA, BS)
            </label>
          </div>
          
          <div class="jspsych-survey-multi-choice-option">
            <input 
              type="radio" 
              id="education-postgraduate" 
              name="education-postgraduate" 
              value="Postgraduate Degree (e.g. Master's Degree, Professional Degree, Doctorate Degree)" 
              class="demographics-education incomplete"
              oninput="
                let demographicsEducation = document.querySelectorAll(
                  '.demographics-education'
                );
                for (let i = 0; i < demographicsEducation.length; i++) {
                  demographicsEducation[i].classList.remove('incomplete');
                };
              "
            >
            <label for="education-postgraduate">
              Postgraduate Degree (e.g. Master's Degree, Professional Degree, Doctorate Degree)
            </label>
          </div>
        </div>
        
        <style id="jspsych-survey-multi-choice-css">
          .jspsych-survey-multi-choice-question { 
            margin-top: 2em; 
            margin-bottom: 2em; 
            text-align: left; 
          } .jspsych-survey-multi-choice-option { 
            font-size: 10pt; 
            line-height: 2; 
          } .jspsych-survey-multi-choice-horizontal 
            .jspsych-survey-multi-choice-option { 
            display: inline-block; 
            margin-left: 1em; 
            margin-right: 1em; 
            vertical-align: top; 
            text-align: center; 
          } label.jspsych-survey-multi-choice-text input[type='radio'] {
            margin-right: 1em;
          }
        </style>
      `,
  button_label: 'Next',
  request_response: true,
  on_finish: function (data) {
    let demographicsData = data.response;

    // Age
    const age = Number(demographicsData['age']);

    // Gender
    let gender = '';
    if (demographicsData['gender-man']) {
      gender = 'Man';
    } else if (demographicsData['gender-woman']) {
      gender = 'Woman';
    } else if (demographicsData['gender-non-binary']) {
      gender = 'Non-Binary';
    } else if (demographicsData['gender-other']) {
      gender = 'Other';
    }

    // Create a new object with the formatted data
    demographicsData = {
      age: age,
      race_ethnicity_indigenous: demographicsData['race-ethnicity-indigenous'],
      race_ethnicity_asian: demographicsData['race-ethnicity-asian'],
      race_ethnicity_black: demographicsData['race-ethnicity-black'],
      race_ethnicity_native: demographicsData['race-ethnicity-native'],
      race_ethnicity_white: demographicsData['race-ethnicity-white'],
      race_ethnicity_hispanic: demographicsData['race-ethnicity-hispanic'],
      race_ethnicity_other: demographicsData['race-ethnicity-other'],
      race_ethnicity_na: demographicsData['race-ethnicity-prefer-not'],
      gender: gender
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(demographicsData);
  }
};

timeline.push(demographicsQuestions);

const politicsQuestions = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'political-ideology-economic',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your political beliefs surrounding <strong>economic</strong> issues?
            </p>`,
      options: politicalResponses,
      horizontal: true
    },
    {
      name: 'political-ideology-social',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your political beliefs surrounding <strong>social</strong> issues?
            </p>`,
      options: politicalResponses,
      horizontal: true
    },
    {
      name: 'political-ideology-overall',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your <strong>overall</strong> political beliefs?
            </p>`,
      options: politicalResponses,
      horizontal: true
    }
  ],
  preamble: `
        <p class="jspsych-survey-multi-choice-preamble">
          Please answer the following questions about your political ideology:
        </p>`,
  request_response: true,
  on_finish: function (data) {
    let politicalData = data.response;

    politicalData = {
      political_ideology_economic: politicalData['political-ideology-economic'],
      political_ideology_social: politicalData['political-ideology-social'],
      political_ideology_overall: politicalData['political-ideology-overall']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(politicalData);
  }
};

timeline.push(politicsQuestions);

// Comments
const feedback = {
  type: jsPsychSurveyText,
  questions: [
    {
      name: 'feedback',
      prompt:
        `<p class="jspsych-survey-multi-choice-question" style='text-align: "center !important;"'>
          Do you have any additional comments? We appreciate any and all feedback!
        </p>`,
      rows: 10
    }
  ],
  on_finish: function (data) {
    let purposeFeedbackData = data.response;

    purposeFeedbackData = {
      guess_study_purpose: purposeFeedbackData['guess-study-purpose'],
      feedback: purposeFeedbackData['feedback']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(purposeFeedbackData);
  }
}

timeline.push(feedback);

// Exit fullscreen
const exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
  delay_after: 0
};

timeline.push(exitFullscreen);

// DataPipe conclude data collection
const save_data = {
   type: jsPsychPipe,
   action: "save",
   experiment_id: "9VDNqbtQWyZk", //updated as of june 3
   filename: filename,
   data_string: () => jsPsych.data.get().csv(),
   on_finish: function (data) {
     function countdown(start, end) {
       const timer = setInterval(function() {
         if (start <= end) {
           clearInterval(timer);
         } else {
           start--;
           document.getElementById("countdown").innerHTML = start;
        }
      }, 1000);
     }
    
     countdown(5, 0);

     jsPsych.endExperiment(
      `<p class="jspsych-center">
         Thanks for participating! You will be redirected in <span id="countdown">5</span> seconds.
       </p>`
     );
     setTimeout(function () {
       window.location.href = "https://app.prolific.com/submissions/complete?cc=CUB7DRMV"; //this is updated as of april 22
     }, 5000)
   }
 };

timeline.push(save_data);

startExperiment();

// Function to initialize the experiment; will be called once all images are preloaded
function startExperiment() {
  jsPsych.run(timeline);
};