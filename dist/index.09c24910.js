var questions = $(".question").length; // stores the question number of questions
var myQuestions = $("section.q-n-a");
var currQ = 0; //question we are currently showing
myQuestions.each(function(index) {
    var myAnswers = $(this).find(".answer");
    $(this).find(".answers").html(myAnswers);
    $(this).attr("id", index + 1);
    if (index == 0) $(this).find(".previous").remove(); //remove previous button from the first question
});
$("#quiz-area").html(myQuestions);
//hide and show the current question
function showQ() {
    $("section.q-n-a").hide();
    currQ++;
    if ($("#" + currQ).length > 0) //there is at least one of that id on this page
    $("#" + currQ).fadeIn();
    else $(".result").fadeIn();
}
$("#start-quiz").on("click", function() {
    $("#quiz-area").show();
    $("#start-quiz").hide();
    showQ();
});
$(".previous, .next, .missed, .take-another-quiz").click(function() {
    if ($(this).hasClass("previous")) currQ -= 2; //because showQ always increments by 1, we need to set the currQ by 2 and THEN showQ
    else if ($(this).hasClass("missed")) {
        currQ = 0;
        $(".response, .result, .missed, .take-another-quiz").hide();
    }
    showQ();
});
// Create an object to store answers for each question
var allAnswers = {};
$(".answer").on("click", function() {
    var qid = $(this).data("qid");
    var value = $(this).data("value");
    var allowMultiple = $(this).parent().data("allow-multiple");
    //   console.log(allAnswers);
    // Create a new array for the question if it doesn't exist
    if (!allAnswers[qid]) allAnswers[qid] = [];
    if (allowMultiple) {
        if ($(this).hasClass("selected")) {
            $(this).removeClass("selected");
            var index = allAnswers[qid].indexOf(value);
            if (index !== -1) allAnswers[qid].splice(index, 1);
        } else {
            $(this).addClass("selected");
            allAnswers[qid].push(value);
        }
    } else {
        if ($(this).parent().find(".selected").length > 0) $(this).parent().find(".selected").removeClass("selected");
        $(this).addClass("selected");
        allAnswers[qid] = [
            value
        ];
    }
});
$(".result").on("click", function() {
    var message = "";
    var resultHtml = "";
    //check if all questions are answered
    if ($(".selected").length >= questions) {
        fetch("data.json").then((response)=>response.json()).then((data)=>{
            /// filter the data based on user answers
            const filteredData = data.filter((item)=>{
                return item.q1.some((answer)=>allAnswers.q1.includes(answer)) && item.q2.some((answer)=>allAnswers.q2.includes(answer)) && item.q3.some((answer)=>allAnswers.q3.includes(answer)) && item.q4.some((answer)=>allAnswers.q4.includes(answer));
            });
            resultHtml += '<ul class = "result-area-ul">';
            for(let i = 0; i < filteredData.length; i++)resultHtml += '<li class = "result-area-li">' + filteredData[i].SKU + "</li>" + '<li class = "result-area-li">' + filteredData[i].title + "</li>" + '<li class = "result-area-li"><a href =' + filteredData[i].link + ">" + filteredData[i].image + "</a></li>";
            resultHtml += "</ul>";
            var resultArea = document.getElementById("result-area-id");
            resultArea.innerHTML = resultHtml;
        // // display the matching results
        // filteredData.forEach(item => {
        //     console.log(`SKU: ${item.SKU}`);
        //     console.log(`Title: ${item.title}`);
        //     console.log(`Image: ${item.image}`);
        //     console.log(`Link: ${item.link}`);
        //     console.log('------------------------');
        // });
        });
        $("#quiz-area, .result").hide();
        $(".take-another-quiz").show();
    } else {
        message = "Please answer all questions";
        $(".take-another-quiz").hide();
        $(".missed").show();
    }
    $(".response p").text(message);
    $(".response").show();
});
$(".take-another-quiz").on("click", function() {
    currQ = 0;
    allAnswers = [];
    $(".selected").removeClass("selected");
    $("#quiz-area, .result, .response, .missed, .take-another-quiz, .result-area").hide();
    $("#start-quiz").show();
});

//# sourceMappingURL=index.09c24910.js.map
