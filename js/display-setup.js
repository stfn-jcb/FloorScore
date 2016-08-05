// Formatting setup for screen

function formatScreen () {
    // Home team logo & score
    var tourneyLogoH = parseInt($('#tourney-logo').css('height'));
    
    $('#team-name-home').css('top', tourneyLogoH+'px');
    var homeLogoW = parseInt($('#team-img-home').css('width'));
    $('#team-name-home').css('height', 0.4*homeLogoW+'px');
    var homeNameH = parseInt($('#team-name-home').css('height'));
    $('#team-name-home').css('font-size', 0.42*homeNameH+'px')
    $('#team-name-home').css('line-height', 0.44*homeNameH+'px')
    $('#team-img-home').css('height', homeLogoW+'px');
    $('#team-img-home').css('top', tourneyLogoH+homeNameH+homeLogoW+'px');
    $('#team-score-home').css('height', homeLogoW+'px');
    $('#team-score-home').css('line-height', homeLogoW+'px');
    // console.log(tourneyLogoH);
    var homeScoreY = homeNameH + tourneyLogoH;
    // console.log(homeScoreY)
    $('#team-score-home').css("top", homeScoreY+'px');
    $('#team-score-home').css("font-size", 0.6*parseInt(homeLogoW)+'px');

    $('#team-name-away').css('top', tourneyLogoH+'px');
    var awayLogoW = parseInt($('#team-img-away').css('width'));
    $('#team-name-away').css('height', 0.4*awayLogoW+'px');
    var awayNameH = parseInt($('#team-name-away').css('height'));
    $('#team-name-away').css('font-size', 0.42*awayNameH+'px')
    $('#team-name-away').css('line-height', 0.44*awayNameH+'px')
    $('#team-img-away').css('height', awayLogoW+'px');
    $('#team-img-away').css('top', tourneyLogoH+awayNameH+awayLogoW+'px');
    $('#team-score-away').css('height', awayLogoW+'px');
    $('#team-score-away').css('line-height', awayLogoW+'px');
    // console.log(tourneyLogoH);
    var awayScoreY = awayNameH + tourneyLogoH;
    // console.log(awayScoreY)
    $('#team-score-away').css("top", awayScoreY+'px');
    $('#team-score-away').css("font-size", 0.6*parseInt(awayLogoW)+'px');

    // $('.team-logo').css('font-size', 0.8*homeLogoW+"px");

    // Timer
    timerW = parseInt($('#match-timer').css('width'));
    // console.log(timerW);
    $('#match-timer').css('height', 0.3*timerW+"px");
    $('#match-timer').css('line-height', 0.3*timerW+"px");
    timerH = parseInt($('#match-timer').css('height'));
    $('#match-timer').css('font-size', 0.68*timerH+"px");
    timerFS = parseInt($('#match-timer').css('font-size'));
    $('#match-period').css('top', tourneyLogoH+timerH+'px');
    $('#match-period').css('height', 0.5 * timerH + "px");
    $('#match-period').css('line-height', 0.5 * timerH + "px");
    $('#match-period').css('font-size', 0.38 * timerH + "px");
}

// Shift around home elements
$( document ).ready( function () {
    formatScreen();
});