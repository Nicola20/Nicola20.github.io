
var socialScore = 0;
var ecologicScore = 0;
var economicScore = 0;
var socialLetter = "";
var ecologicLetter = "";
var economicLetter = "";
var countOfSocialQuestions = 0;
var countOfEcologicQuestions = 0;
var countOfEconomicQuestions = 0;
var colorCodes = {"A": "#11a533ff", "B": "#4ccd35ff", "C": "#a5d20dff", "D": "#f0e52bff",
                    "E": "#fbc412ff", "F": "#fe8127ff", "G": "#fe2737ff"};


function computeNumberInput() {
   // get the allowed value range, the different mapping ranges and the input value of the form
    var valueInput = document.getElementsByClassName("input-field")[0].value;
    var mappingRangeSocial = currentQuestion["mapping range"]["social"];
    var mappingRangeEcologic = currentQuestion["mapping range"]["ecological"];
    var mappingRangeEconomic = currentQuestion["mapping range"]["economical"];
    var valueInputRange = currentQuestion["value range"];

    // compute the score for the category social by mapping the input value to the output mapping range
    var dividend = (valueInput - valueInputRange[0]) * (mappingRangeSocial[1] - mappingRangeSocial[0]);
    var divisor = valueInputRange[1] - valueInputRange[0];
    socialScore = socialScore + (mappingRangeSocial[0] + (dividend / divisor));

    // compute the score for the category ecologic
    dividend = (valueInput - valueInputRange[0]) * (mappingRangeEcologic[1] - mappingRangeEcologic[0]);
    divisor = valueInputRange[1] - valueInputRange[0];
    ecologicScore = ecologicScore + (mappingRangeEcologic[0] + (dividend / divisor));

    // compute the score for the category economic
    dividend = (valueInput - valueInputRange[0]) * (mappingRangeEconomic[1] - mappingRangeEconomic[0]);
    divisor = valueInputRange[1] - valueInputRange[0];
    economicScore = economicScore + (mappingRangeEconomic[0] + (dividend / divisor));
}


function computeSingleInput() {
    var answerElements = document.getElementsByClassName("choice-field");
    for (let i = 0; i < answerElements.length; i++) {
        if (document.getElementById(String(i)).checked) {
            var answerValues = currentQuestion.answers[i].values;
            break;
        }
    }
    socialScore = socialScore + answerValues[0];
    ecologicScore = ecologicScore + answerValues[1];
    economicScore = economicScore + answerValues[2];
}


function computeMultipleChoiceInput() {
    var answerElements = document.getElementsByClassName("choice-field");
    var numberOfCheckedAnswers = 0;
    var tmpSocialScore = 0;
    var tmpEcologicScore = 0;
    var tmpEconomicScore = 0;

    for (let i = 0; i < answerElements.length; i++) {
        if (document.getElementById(String(i)).checked) {
            numberOfCheckedAnswers = numberOfCheckedAnswers + 1;
            var answerValues = currentQuestion.answers[i].values;
            tmpSocialScore = tmpSocialScore + answerValues[0];
            tmpEcologicScore = tmpEcologicScore + answerValues[1];
            tmpEconomicScore = tmpEconomicScore + answerValues[2];
        }
    }

    tmpSocialScore = tmpSocialScore / numberOfCheckedAnswers;
    tmpEcologicScore = tmpEcologicScore / numberOfCheckedAnswers;
    tmpEconomicScore = tmpEconomicScore / numberOfCheckedAnswers;

    socialScore = socialScore + tmpSocialScore;
    ecologicScore = ecologicScore + tmpEcologicScore;
    economicScore = economicScore + tmpEconomicScore;
}


function displayScore() {
    document.getElementsByClassName("content-container")[0].innerHTML = "<p class='head-line'>Your Score</p>" +
            "<div id='score-container' class='details-container'> <div class='scoring-card'>" +
                "<p>Social</p>" +
                "<p class='scoring-value' id='social-value'>0</p>" +
                "<div id='social-score'></div>" +
            "</div>" +
            "<div class='scoring-card'>" +
                "<p>Ecologic</p>" +
                "<p class='scoring-value' id='ecologic-value'>0</p>" +
                "<div id='ecologic-score'></div>" +
            "</div>" +
            "<div class='scoring-card'>" +
                "<p>Economic</p>" +
                "<p class='scoring-value' id='economic-value'>0</p>" +
                "<div id='economic-score'></div>" +
            "</div>" +
        "</div>"
    document.getElementById("next-container").style.display = "none";

    // display the scoring values
    document.getElementById("social-value").innerHTML = String(socialScore.toFixed(2));
    document.getElementById("ecologic-value").innerHTML = String(ecologicScore.toFixed(2));
    document.getElementById("economic-value").innerHTML = String(economicScore.toFixed(2));

    // display the scoring letters
    document.getElementById("social-score").innerHTML = socialLetter;
    document.getElementById("ecologic-score").innerHTML = ecologicLetter;
    document.getElementById("economic-score").innerHTML = economicLetter;

    //change the colors of the letter cards according to the scoring
    for (let key in colorCodes) {
        if (socialLetter == key) {
            document.getElementById("social-score").style.backgroundColor = colorCodes[key];
        }
        if (ecologicLetter == key) {
            document.getElementById("ecologic-score").style.backgroundColor = colorCodes[key];
        }
        if (economicLetter == key) {
            document.getElementById("economic-score").style.backgroundColor = colorCodes[key];
        }
    }
}


function updateScore() {
    var categories = currentQuestion.categories;

    // update of the count of the correlating categories
    for (let i = 0; i < categories.length; i++) {
        if (categories[i] == "social") {
            countOfSocialQuestions = countOfSocialQuestions + 1;
        }
        if (categories[i] == "ecological") {
            countOfEcologicQuestions = countOfEcologicQuestions + 1;
        }
        if (categories[i] == "economical") {
            countOfEconomicQuestions = countOfEconomicQuestions + 1;
        }
    }

    if (currentQuestion["answer type"] == "int input") {
        computeNumberInput();

    } else if (currentQuestion["answer type"] == "single choice") {
        computeSingleInput();

    } else if (currentQuestion["answer type"] == "multiple choice") {
        computeMultipleChoiceInput();
    }

    if (currentQuestionNumber > data.length) {
        // compute the final score
        socialScore = socialScore / countOfSocialQuestions;
        ecologicScore = ecologicScore / countOfEcologicQuestions;
        economicScore = economicScore / countOfEconomicQuestions;

        // round the scores to the nearest integer to decide which letter (A-G) they are getting as a mark
        let tmpScoring = [Math.round(socialScore), Math.round(ecologicScore), Math.round(economicScore)];
        var letter = "";
        for (let i = 0; i < tmpScoring.length; i++) {

            if (tmpScoring[i] == -3) {
                letter = "G";
            } else if (tmpScoring[i] == -2) {
                letter = "F";
            } else if (tmpScoring[i] == -1) {
                letter = "E";
            } else if (tmpScoring[i] == 0) {
                letter = "D";
            } else if (tmpScoring[i] == 1) {
                letter = "C";
            } else if (tmpScoring[i] == 2) {
                letter = "B";
            } else if (tmpScoring[i] == 3) {
                letter = "A";
            }
            console.log(letter);
            if (i == 0) {
                socialLetter = letter;
            } else if (i == 1) {
                ecologicLetter = letter;
            } else if (i == 2) {
                economicLetter = letter;
            }
        }
        displayScore();
    }

}

