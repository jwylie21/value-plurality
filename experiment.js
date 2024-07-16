
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

var likert_scale = [
  'Not at all important', 
  'Slightly important', 
  'Moderately important', 
  'Very important', 
  'Extremely important'
];

var disagree_scale = [
  '1 = Strongly disagree', 
  '2', 
  '3', 
  '4', 
  '5',
  '6',
  '7 = Strongly agree'
];


var rule_scale = [
  '1 = None at all', 
  '2', 
  '3', 
  '4', 
  '5 = A great deal'
];


var true_scale = [
  '1 = Completely disagree', 
  '2', 
  '3', 
  '4 = Neither agree nor disagree', 
  '5', 
  '6', 
  '7 = Completely agree'
];

// attention check
const attention_scale = [
  "1 = No, I didnt pay close attention. You should not use my data",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7 = Yes, I paid full attention. You should use my data",
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
            visually search a display of letters, a word/letter recognition task, or solve puzzles; 
            or (3) complete various personality, individual difference, and demographic questionnaires. In some cases, 
            you will skip the first step and simply begin the cognitive task.
            
            </p>
            <p style="text-align: left;">
            This experiment will take less than 10 minutes. 
            Participants do not receive compensation if they withdraw prior to completion 
            of the experiment. We do not anticipate any possible risks. 
            However, we will be presenting you with material that has emotional 
            qualities that may induce discomfort when viewing such material.

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
       Welcome to the experiment! In this study, we will ask you about the kinds of things people can pursue in their lives. 
     </p>`,

    `<p style="text-align: left;">
      Imagine this circle represents all the time a single person has over the course of their life:
     </p>
     <img src="images/piealone.jpg" style="display: block; margin: 0 auto; width: 50%;">
     `,

     `<p style="text-align: left;">
     We want you to think about creating an ideal life by partitioning up the circle: 
     </p>
     
     <img src="images/piealone2.jpg" style="display: block; margin: 0 auto; width: 30%;">

     <p style="text-align: left;">
     This circle represents the amount of a person's life they dedicate to different pursuits. Your task is to decide <b>how much of a person's life</b> they should dedicate to different pursuits. 
     </p>

     <p style="text-align: left;">
     These pursuits include:
     <ul style="text-align: left;">
       <li><b>Civic Life</b> (pursuing political action, participating in collective decision-making, managing shared resources, engaging with your political community)</li>
       <li><b>Aesthetic & Intellectual Expression</b> (pursuing and passing on knowledge, making and seeing art, seeking truth, playing or listening to music, perfecting a sport)</li>
       <li><b>Morality</b> (pursuing justice, promoting fairness, protecting others from risks and threats, participating in religious or spiritual practices)</li>
       <li><b>Play & Leisure</b> (pursuing enjoyment for its own sake, engaging in play, having hobbies and recreational activities, taking time for leisure)</li>
       <li><b>Relationships</b> (pursuing connection and interaction with other people and animals, feeling close to others, maintaining ties with friends and family)</li>
     </ul>
     </p>`,

   `<p style="text-align: left;">
    You will see a pie chart like the one below and be asked to edit it so that it matches how you think a person should ideally divide up these pursuits in their life. 
    </p>
    <p style="text-align: left;"> Here is an example where only two values are selected, Civic Life and Relationships, and the others are set to zero:</p> 
 
    <img src="images/piegroups.jpg" alt="Example Pie Chart" style="display: block; margin: 0 auto; width: 30%;">`,
  
    `<p style="text-align: left;"> Here is an example where one pursuit, Relationships, is given a large value and the others weighted equally:</p> 
 
    <img src="images/piegroups2.jpg" alt="Example Pie Chart" style="display: block; margin: 0 auto; width: 40%;">`,

    `<p style="text-align: left;">
    Now it is time to edit the circle so that it matches what you think a person should pursue. You may not see all the things you value, 
    or see some that you value very little. That is okay.  
    </p>
    
    <p style="text-align: left;">Your task is to adjust the pursuits you are shown to match YOUR ideal. 
    </p>`,

    `<p style="text-align: left;">
    You will start with a pie chart where none of the pursuits have been assigned value. Because of this, the pie chart will not be visible until you assign values. The values of the pie chart must equal exactly 100. 
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
      Welcome to the experiment! In this study, we will ask you about the kinds of things people can pursue in their lives. 
     </p>`,

    `<p style="text-align: left;">
     Imagine this circle represents all the time people in a society have over the course of their lives:

     </p>
     <img src="images/piealone.jpg" style="display: block; margin: 0 auto; width: 50%;">
     `,

     `<p style="text-align: left;">
     We want you to think about creating an ideal society by partitioning up the circle: 
     </p>
     
     <img src="images/piealone2.jpg" style="display: block; margin: 0 auto; width: 30%;">
     
     <p style="text-align: left;">
     In a society, it is possible that some people dedicate themselves to some pursuits, while others dedicate themselves to other pursuits. 
     We want to know how you think people in an ideal society should divide up these pursuits. 
     </p>

     <p style="text-align: left;">
     These pursuits include:
     <ul style="text-align: left;">
       <li><b>Civic Life</b> (pursuing political action, participating in collective decision-making, managing shared resources, engaging with your political community)</li>
       <li><b>Aesthetic & Intellectual Expression</b> (pursuing and passing on knowledge, making and seeing art, seeking truth, playing or listening to music, perfecting a sport)</li>
       <li><b>Morality</b> (pursuing justice, promoting fairness, protecting others from risks and threats, participating in religious or spiritual practices)</li>
       <li><b>Play & Leisure</b> (pursuing enjoyment for its own sake, engaging in play, having hobbies and recreational activities, taking time for leisure)</li>
       <li><b>Relationships</b> (pursuing connection and interaction with other people and animals, feeling close to others, maintaining ties with friends and family)</li>
     </ul>
     </p>`,

     `<p style="text-align: left;">
    You will see a pie chart like the one below and be asked to edit it so that it matches how you think people in an ideal society should divide up these pursuits.
    </p>
    
    <p style="text-align: left;"> Here is an example where only two values are selected, Civic Life and Relationships, and the others are set to zero:</p> 
 
    <img src="images/piegroups.jpg" alt="Example Pie Chart" style="display: block; margin: 0 auto; width: 30%;">`,
  
    `<p style="text-align: left;"> Here is an example where one pursuit, Relationships, is given a large value and the others weighted equally:</p> 
 
    <img src="images/piegroups2.jpg" alt="Example Pie Chart" style="display: block; margin: 0 auto; width: 40%;">`,

    `<p style="text-align: left;">
    Now it is time to edit the circle so that it matches what you think people in an ideal society should pursue. You may not see all the things you value, 
    or see some that you value very little. That is okay.    
    </p>

    <p style="text-align: left;">Your task is to adjust the pursuits you are shown to match YOUR ideal society. 

    </p>`,

    `<p style="text-align: left;">
    You will start with a pie chart where none of the pursuits have been assigned value. Because of this, the pie chart will not be visible until you assign values. The values of the pie chart must equal exactly 100. 
    </p>`,


    `<p style="text-align: left;">
    Your task will begin on the next page. 
    </p>`

  ],
  show_clickable_nav: true,
};

// TASK 
let proportions = {
  cat1: 0,
  cat2: 0,
  cat3: 0,
  cat4: 0,
  cat5: 0
};

// Categories and their corresponding labels and colors
const categories = [
  { id: 'cat1', label: 'Aesthetic & Intellectual Expression', color: '#DF857A' },
  { id: 'cat2', label: 'Civic Life', color: '#8094A6' },
  { id: 'cat3', label: 'Morality', color: '#E7B268' },
  { id: 'cat4', label: 'Play & Leisure', color: '#936D7D' },
  { id: 'cat5', label: 'Relationships', color: '#1B3022' }
];

// Function to shuffle the categories
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Shuffle the categories
const shuffledCategories = shuffle(categories);

// Store the order of the labels
const labelOrder = shuffledCategories.map(cat => cat.label);

const pieChartTrial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
  <div style="text-align: center; margin-bottom: 5px;">
      <b>Adjust the amount of each of the following pursuits:</b>
      <ul style="text-align: left; font-size: 14px; margin-top: 5px;">
       <li><b>Civic Life</b> (pursuing political action, participating in collective decision-making, managing shared resources, engaging with your political community)</li>
       <li><b>Aesthetic & Intellectual Expression</b> (pursuing and passing on knowledge, making and seeing art, seeking truth, playing or listening to music, perfecting a sport)</li>
       <li><b>Morality</b> (pursuing justice, promoting fairness, protecting others from risks and threats, participating in religious or spiritual practices)</li>
       <li><b>Play & Leisure</b> (pursuing enjoyment for its own sake, engaging in play, having hobbies and recreational activities, taking time for leisure)</li>
       <li><b>Relationships</b> (pursuing connection and interaction with other people and animals, feeling close to others, maintaining ties with friends and family)</li>
      </ul> 
    </div>

    <div id="pieChartContainer" style="width: 400px; height: 400px; margin: 0 auto;">
      <canvas id="pieChart"></canvas>
    </div>
    <div id="inputContainer" style="width: 400px; margin: 0 auto; text-align: left;">
      ${shuffledCategories.map(cat => `
        <label for="${cat.id}">${cat.label}:</label>
        <input type="number" id="${cat.id}" value="0" min="0" max="100"><br>
      `).join('')}
    </div>
    <p></p>
    <p id="error-message" style="color: red;"></p>
    <p><i>The piechart will update when the values <b>equal 100</b>.</i></p>
    <p>Press the <b>space bar</b> when you are done adjusting the proportions to continue.</p>
  `,
  choices: [' '],
  on_load: function() {
    var ctx = document.getElementById('pieChart').getContext('2d');
    var pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: shuffledCategories.map(cat => cat.label),
        datasets: [{
          data: [0, 0, 0, 0, 0],
          backgroundColor: shuffledCategories.map(cat => cat.color) // Updated with hex codes
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    function updateChart() {
      var data = shuffledCategories.map(cat => 
        parseInt(document.getElementById(cat.id).value));

      var total = data.reduce((a, b) => a + b, 0);

      if (total === 100) {
        pieChart.data.datasets[0].data = data;
        pieChart.update();
        document.getElementById('error-message').innerText = '';
        // Store the values in the global variable
        proportions = {
          cat1: data[shuffledCategories.findIndex(cat => cat.id === 'cat1')],
          cat2: data[shuffledCategories.findIndex(cat => cat.id === 'cat2')],
          cat3: data[shuffledCategories.findIndex(cat => cat.id === 'cat3')],
          cat4: data[shuffledCategories.findIndex(cat => cat.id === 'cat4')],
          cat5: data[shuffledCategories.findIndex(cat => cat.id === 'cat5')]
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
    jsPsych.data.addDataToLastTrial({
      proportions: proportions,
      labelOrder: labelOrder
    });
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
    {prompt: 'Were there any pursuits you think should have been included?', name: 'pieexplain', rows: 5}  
  ],
  on_finish: function (data) {
    let explainData = data.response;

    explainData = {
      feedback: explainData['explain']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(explainData);
  }
}

//timeline.push(explain); //remove this question 

// rule breaking questions

var rulebreak = {
  type: jsPsychSurveyLikert,
  questions: [
    {prompt: "How much rule breaking is required to truly pursue <b>aesthetic & intellectual expression</b>?", name: 'ruleexpression', labels: rule_scale, required: true},
    {prompt: "How much rule breaking is required to truly pursue <b>morality</b>?", name: 'rulemorality', labels: rule_scale, required: true},
    {prompt: "How much rule breaking is required to truly pursue <b>play & leisure</b>?", name: 'ruleplay', labels: rule_scale, required: true},
    {prompt: "How much rule breaking is required to truly pursue <b>relationships</b>?", name: 'rulerelationship', labels: rule_scale, required: true},
    {prompt: "How much rule breaking is required to truly pursue <b>civic life</b>?", name: 'rulecivic', labels: rule_scale, required: true}
  ],
  preamble:"For each of the following, please rate how much you believe breaking rules is necessary for someone to truly pursue each of the values below.",
  randomize_question_order: true,
  on_finish: function(data) {
    let rulebreakData = data.response;

    rulebreakData = {
      rule_expression: rulebreakData['ruleexpression'],
      rule_morality: rulebreakData['rulemorality'],
      rule_play: rulebreakData['ruleplay'],
      rule_relationship: rulebreakData['rulerelationship'],
      rule_civic: rulebreakData['rulecivic']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(rulebreakData);
  }
};

timeline.push(rulebreak);

// true self questions

var trueself = {
  type: jsPsychSurveyLikert,
  questions: [
    {prompt: "To be excellent at <b>aesthetic & intellectual expression</b>, one has to be true to who they are deep down.", name: 'trueexpression', labels: true_scale, required: true},
    {prompt: "To be excellent at <b>morality</b>, one has to be true to who they are deep down.", name: 'truemorality', labels: true_scale, required: true},
    {prompt: "To be excellent at <b>play & leisure</b>, one has to be true to who they are deep down.", name: 'trueplay', labels: true_scale, required: true},
    {prompt: "To be excellent at <b>relationships</b>, one has to be true to who they are deep down.", name: 'truerelationship', labels: true_scale, required: true},
    {prompt: "To be excellent at <b>civic life</b>, one has to be true to who they are deep down.", name: 'truecivic', labels: true_scale, required: true}
  ],
  preamble:"Please rate how much you agree or disagree with each of the following statements:",
  randomize_question_order: true,
  on_finish: function(data) {
    let trueselfData = data.response;

    trueselfData = {
      true_expression: trueselfData['trueexpression'],
      true_morality: trueselfData['truemorality'],
      true_play: trueselfData['trueplay'],
      true_relationship: trueselfData['truerelationship'],
      true_civic: trueselfData['truecivic']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(trueselfData);
  }
};

timeline.push(trueself);

// other questions
var whichone = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "In your life now, which of the pursuits would you say YOU most pursue in your life?", 
      name: 'youvalue', 
      options: ['Aesthetic & Intellectual Expression', 'Civic Life', 'Morality', 'Play & Leisure', 'Relationships' ], 
      required: true,
      horizontal: true,
    },

    {
      prompt: "Which of the pursuits should YOU most pursue in your life?", 
      name: 'shouldvalue', 
      options: ['Aesthetic & Intellectual Expression', 'Civic Life', 'Morality', 'Play & Leisure', 'Relationships' ], 
      required: true,
      horizontal: true
    },

    {
      prompt: "Which of the pursuits should OTHERS spend most time pursuing in their lives?", 
      name: 'othersshould', 
      options: ['Aesthetic & Intellectual Expression', 'Civic Life', 'Morality', 'Play & Leisure', 'Relationships' ], 
      required: true,
      horizontal: true
    }
  ],
  on_finish: function (data) {
    let whichoneData = data.response;

    whichoneData = {
      youvalue: whichoneData['youvalue'],
      shouldvalue: whichoneData['shouldvalue'],
      othersshould: whichoneData['othersshould']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(whichoneData);
  }
};

timeline.push(whichone);

var ourmfq = {
  type: jsPsychSurveyLikert,
  questions: [
    {prompt: "Aesthetic & Intellectual Expression", name: 'Self-expression1', labels: likert_scale, required: true},
    {prompt: "Morality", name: 'Morality1', labels: likert_scale, required: true},
    {prompt: "Civic Life", name: 'Civic1', labels: likert_scale, required: true},
    {prompt: "Play & Leisure", name: 'Play1', labels: likert_scale, required: true},
    {prompt: "Relationships", name: 'Relationship1', labels: likert_scale, required: true}

  ],
  preamble:"In this section, please rate each item on how important it would be to you when trying to decide if a pursuit was valuable or not.",
  randomize_question_order: true,
  required: true,
  on_finish: function(data) {
    let mfqData = data.response;

    mfqData = {
      self_expression_importance: mfqData['Self-expression1'],
      morality_importance: mfqData['Morality1'],
      civic_importance: mfqData['Civic1'],
      play_importance: mfqData['Play1'],
      relationship_importance: mfqData['Relationship1']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(mfqData);
  }
};

timeline.push(ourmfq);

var fallapart = {
  type: jsPsychSurveyLikert,
  questions: [
    {prompt: "If too many people pursue <b>aesthetic & intellectual expression</b> society will fall apart", name: 'Self-expression2', labels: disagree_scale, required: true},
    {prompt: "If too many people pursue <b>morality</b> society will fall apart", name: 'Morality2', labels: disagree_scale, required: true},
    {prompt: "If too many people pursue <b>civic life</b> society will fall apart", name: 'Civic2', labels: disagree_scale, required: true},
    {prompt: "If too many people pursue <b>play & leisure</b> society will fall apart", name: 'Play2', labels: disagree_scale, required: true},
    {prompt: "If too many people pursue <b>relationships</b> society will fall apart", name: 'Relationship2', labels: disagree_scale, required: true}
  ],
  preamble:"For each of the following, please rate how much you agree or disagree with the statement",
  randomize_question_order: true,
  required: true,
  on_finish: function(data) {
    let fallapartData = data.response;

    fallapartData = {
      self_expression_fallapart: fallapartData['Self-expression2'],
      morality_fallapart: fallapartData['Morality2'],
      civic_fallapart: fallapartData['Civic2'],
      play_fallapart: fallapartData['Play2'],
      relationship_fallapart: fallapartData['Relationship2']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(fallapartData);
  }
};

timeline.push(fallapart);

//pilot
var pilotqs = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      prompt: "Imagine that you ran into an acquaintance from your neighborhood at a coffee shop on the other side of town. You really like this person and want to get to know them better, but you don't have their phone number. Where do you think you'd have the strongest feeling that you'd run into them again?", 
      name: 'pilot', 
      options: ['Your neighborhood',  'The coffee shop'], 
      required: true,
      horizontal: true
    }
  ],
  on_finish: function(data) {
    let pilotData = data.response;

    pilotData = {
      pilot_choice: pilotData['pilot']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(pilotData);
  }
};

//timeline.push(pilotqs);

/////////////////////////////////////////////// DEMOGRAPHICS ///////////////////////////////////////////////
const demographicsQuestions = {
  type: jsPsychSurveyHtmlForm,
  preamble: `<p class="jspsych-survey-multi-choice-preamble">
      Using the scales provided, please respond to each question about you as an individual:
    </p>`,
  html: `
        <!-- Age -->
        <div class="jspsych-survey-multi-choice-question">
          <label for="age">How old are you?</label><br>
          <input type="number" id="age" name="age" min="18" max="100" style="padding: 5px; width: 40px;" class="incomplete" oninput="this.classList.remove('incomplete');">
        </div>
        
        <!-- Race/Ethnicity -->
        <div class="jspsych-survey-multi-choice-question">
          <legend>Please indicate how you identify yourself:</legend>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-indigenous" name="race-ethnicity-indigenous" value="Indigenous American or Alaskan Native" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-indigenous">Indigenous American or Alaskan Native</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-asian" name="race-ethnicity-asian" value="Asian or Asian-American" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-asian">Asian or Asian-American</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-black" name="race-ethnicity-black" value="African or African-American" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-black">African or African-American</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-native" name="race-ethnicity-native" value="Native Hawaiian or other Pacific Islander" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-native">Native Hawaiian or other Pacific Islander</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-white" name="race-ethnicity-white" value="White" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-white">White</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-hispanic" name="race-ethnicity-hispanic" value="Hispanic/Latino/a/e/x" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-hispanic">Hispanic/Latino/a/e/x</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-other" name="race-ethnicity-other" value="Other" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-other">Other</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-prefer-not" name="race-ethnicity-prefer-not" value="Prefer not to disclose" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-prefer-not">Prefer not to disclose</label>
          </div>
        </div>

        <!-- Gender -->
        <div class="jspsych-survey-multi-choice-question">
          <legend>With which gender do you most closely identify?</legend>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-man" name="gender" value="Man" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-man">Man</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-woman" name="gender" value="Woman" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-woman">Woman</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-non-binary" name="gender" value="Non-binary" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-non-binary">Non-binary</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-other" name="gender" value="Other" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-other">Other</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-prefer-not" name="gender" value="Prefer not to disclose" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
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
            <input type="radio" id="education-less-high-school" name="education" value="Less than a high school diploma" class="demographics-education incomplete" onclick="this.classList.remove('incomplete');">
            <label for="education-less-high-school">
              Less than a high school diploma
            </label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="education-high-school" name="education" value="High school degree or equivalent (e.g. GED)" class="demographics-education incomplete" onclick="this.classList.remove('incomplete');">
            <label for="education-high-school">
              High school degree or equivalent (e.g. GED)
            </label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="education-some-college" name="education" value="Some college, no degree" class="demographics-education incomplete" onclick="this.classList.remove('incomplete');">
            <label for="education-some-college">
              Some college, no degree
            </label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="education-associate" name="education" value="Associate Degree (e.g. AA, AS)" class="demographics-education incomplete" onclick="this.classList.remove('incomplete');">
            <label for="education-associate">
              Associate Degree (e.g. AA, AS)
            </label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="education-bachelors" name="education" value="Bachelor's Degree (e.g. BA, BS)" class="demographics-education incomplete" onclick="this.classList.remove('incomplete');">
            <label for="education-bachelors">
              Bachelor's Degree (e.g. BA, BS)
            </label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="education-postgraduate" name="education" value="Postgraduate Degree (e.g. Master's Degree, Professional Degree, Doctorate Degree)" class="demographics-education incomplete" onclick="this.classList.remove('incomplete');">
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
  on_finish: function (data) {
    let demographicsData = data.response;

    // Age
    const age = Number(demographicsData['age']);

    // Gender
    let gender = demographicsData['gender'] || '';

    // Create a new object with the formatted data
    demographicsData = {
      age: age,
      race_ethnicity_indigenous: demographicsData['race-ethnicity-indigenous'] || '',
      race_ethnicity_asian: demographicsData['race-ethnicity-asian'] || '',
      race_ethnicity_black: demographicsData['race-ethnicity-black'] || '',
      race_ethnicity_native: demographicsData['race-ethnicity-native'] || '',
      race_ethnicity_white: demographicsData['race-ethnicity-white'] || '',
      race_ethnicity_hispanic: demographicsData['race-ethnicity-hispanic'] || '',
      race_ethnicity_other: demographicsData['race-ethnicity-other'] || '',
      race_ethnicity_na: demographicsData['race-ethnicity-prefer-not'] || '',
      gender: gender,
      education: demographicsData['education'] || ''
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

// attention check question

var attentioncheck = {
  type: jsPsychSurveyLikert,
  questions: [
    {prompt: "Did you pay attention while completing this study?", name: 'attentioncheck', labels: attention_scale, required: true},
  ],
  preamble:"Please answer the following question honestly. Your response will NOT affect whether or not you get paid.",
  randomize_question_order: true,
  required: true,
  on_finish: function(data) {
    let attentionData = data.response;

    attentionData = {
      attention_check: attentionData['attentioncheck']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(attentionData);
  }
};

timeline.push(attentioncheck);

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
       window.location.href = "https://app.prolific.com/submissions/complete?cc=C14TE6JM"; //this is updated as of july15 for study 1
     }, 5000)
   }
 };

timeline.push(save_data);

startExperiment();

// Function to initialize the experiment; will be called once all images are preloaded
function startExperiment() {
  jsPsych.run(timeline);
};