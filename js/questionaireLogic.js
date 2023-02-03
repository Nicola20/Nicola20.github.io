
var data = [];
loadData();
var currentQuestionNumber = 1;
var currentQuestion = data.filter(function(x){ return x.placement == currentQuestionNumber; })[0];


function loadData() {
    $.ajax({
        url: 'data/questions_test.json',
        async: false,
        dataType: 'json',
        success: function (json) {
            data = json;
        }
    });
}


// Display the current question
function renderQuestion() {

    //get the question with the current placement (the next question in line)
    currentQuestion = data.filter(function(x){ return x.placement == currentQuestionNumber; })[0];

    // Reset the progress
    document.getElementById('progress').innerHTML = "Question " + String(currentQuestionNumber) +
                                                    "/" + String(data.length);

    // Render the current question
    document.getElementById('question').innerHTML = String(currentQuestion["question text"]);

    //Decide which kind of form is needed for the current question
    if (currentQuestion["answer type"] == "int input") {
        let minValue = currentQuestion["value range"][0];
        let maxValue = currentQuestion["value range"][1];
        //Set the type of input field for the form to number
        document.getElementById('question-form').innerHTML = "<input type='number' class='input-field' name='integer'" +
            "data-min=" + String(minValue) + " data-max=" + String(maxValue) + "></input>";

        //Set the styling accordingly
        document.getElementById('question-form').style.padding = "3% 0% 0% 0%";
        document.getElementById('question-form').style.textAlign = "center";

    } else if (currentQuestion["answer type"] == "single choice") {
        //Set the type of input field for the form to number
        let content = "";
        for (let i = 0; i < currentQuestion.answers.length; i++) {
            content = content + "<label class='choice-field single-choice-field'> <input type='radio' class='choice-input' name='question-" +
                        String(currentQuestionNumber) + "' id=" + String(i) + "> <div class='choice-design'></div> <div class='choice-text'>" +
                        String(currentQuestion.answers[i].answer) + "</div></label>";
        }
        document.getElementById('question-form').innerHTML = content;

        //Set the styling accordingly
        document.getElementById('question-form').style.padding = "3% 0% 0% 10%";
        document.getElementById('question-form').style.textAlign = "initial";
    }
    else if (currentQuestion["answer type"] == "multiple choice") {
        document.getElementById('question').innerHTML = String(currentQuestion["question text"]) +
         "<br> Select all answers that apply to your company.";
        //Set the type of input field for the form to number
        let content = "";
        for (let i = 0; i < currentQuestion.answers.length; i++) {
            let exclusive = currentQuestion.answers[i].exclusive;
            content = content + "<label class='choice-field'> <input type='checkbox' class='choice-input' name='question-" +
                        String(currentQuestionNumber) +"' id=" + String(i) + " data-exclusiveness=" +
                        String(exclusive) + " onchange='answerSelectionMultipleChoice(this)'>" +
                         "<div class='choice-design'></div> <div class='choice-text'>" +
                        String(currentQuestion.answers[i].answer) + "</div></label>"
        }
        document.getElementById('question-form').innerHTML = content;

        //Set the styling accordingly
        document.getElementById('question-form').style.padding = "3% 0% 0% 10%";
        document.getElementById('question-form').style.textAlign = "initial";
    }
    currentQuestionNumber = currentQuestionNumber + 1;
};


//make sure that only valid answer forms can be submitted
function answerSelectionMultipleChoice(selected) {
    //check if the selected answer is the only one that can be selected
    var exclusive = selected.getAttribute("data-exclusiveness");
    var selectedId = selected.getAttribute("id");
    var answerElements = document.getElementsByClassName("choice-field");

    if (exclusive === "true") {
        for (let i = 0; i < answerElements.length; i ++) {
            if (String(i) != selectedId) {
                // uncheck all answers that are currently selected except the one which was selected just now
                document.getElementById(String(i)).checked = false;
            }
        }
    } else {
        for (let i = 0; i < answerElements.length; i ++) {
            exclusive = document.getElementById(String(i)).getAttribute("data-exclusiveness");
            if (exclusive === "true") {
                // uncheck all answers that can only be checked if no other answer is selected
                document.getElementById(String(i)).checked = false;
            }
        }
    }

};


// actions when the next button is clicked.
// make sure that question is answered and that the input is valid
function nextView() {
    var answerElements = document.getElementsByClassName("choice-field");
    var answerInput = document.getElementsByClassName("input-field");
    var answerSelected = false;
    var inputInValueRange = false;

    // check if one of the answers was selected
    if (answerElements.length > 0) {
        for (let i = 0; i < answerElements.length; i++) {
            if (document.getElementById(String(i)).checked) {
                answerSelected = true;
                break;
            }
        }
    } else if (answerInput[0].value) { // See if the free number field has a value
        answerSelected = true;
        // check if the input is inside the allowed value range
        if (parseFloat(answerInput[0].getAttribute("data-min")) <= parseFloat(answerInput[0].value) &&
            parseFloat(answerInput[0].value) <= parseFloat(answerInput[0].getAttribute("data-max"))) {
            inputInValueRange = true;
        }
    }

    if (!answerSelected){
        alert("Please select an answer before you proceed!");
    } else if (answerSelected && !inputInValueRange && answerInput.length > 0) {
        alert("Your answer is outside the valid range of values. Please select a number between " +
            String(answerInput[0].getAttribute("data-min")) + " and " + String(answerInput[0].getAttribute("data-max")));
    }     // only show the next question when an answer was selected
    else if ((answerSelected && !inputInValueRange && answerElements.length > 0) ||
        (answerSelected && inputInValueRange && answerInput.length > 0)) {
        updateScore();
        if (currentQuestionNumber <= data.length) {
            if (currentQuestionNumber == data.length) {
                // change the outlook of the next button
                document.getElementById("next-container").innerHTML = "Show Results<i class='fa-solid fa-arrow-right' style='font-size: 16px; color: black;'></i>";
            }
            renderQuestion();
            //Change here the look of the next button if it is the last answer
        }
    }
};


renderQuestion();
document.getElementById("next-container").onclick = function() {nextView()};

