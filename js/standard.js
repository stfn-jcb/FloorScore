// Global scope variables for period type, numbers etc.
var period, isPlay, noPeriods, lenPeriod, lenBreak, rollingClock, gameStarted;
// Added variables for improved time-keeping
var startTime, isRunning;
var MatchClock;
var buzzer = new Audio('./mp3/47434BUZZER.mp3');
var teamdata;

var scoreHome, scoreAway;

// Set global default values
noPeriods = 2;
lenPeriod = 16;
lenBreak = 2;
rollingClock = true;

function resetGame() {
    // Do stuff here
    period = 1;
    isPlay = false;
    // Do things here to get a hold of the number of periods,
    // the period length and the length of the period break
    noPeriods = parseInt($('#match-timer-no-periods').val()); // mins
    lenPeriod = parseInt($('#match-timer-len-period').val()); // mins
    lenBreak = parseInt($('#match-timer-len-break').val());; // mins
    rollingClock = true;
    gameStarted = false;
    done = false;

    scoreHome = 0;
    scoreAway = 0;
    $("#team-home").val("").change();
    $("#team-away").val('').change();

    // MatchClock object
    MatchClock = new (function() {
        var $countdown,
            $form, // Form used to change the countdown time
            incrementTime = 70,
            currentTime = 60*15,
            updateTimer = function() {
                $countdown.html(formatTime(currentTime));
                if (currentTime == 0) {
                    MatchClock.Timer.stop();
                    timerComplete();
                    MatchClock.resetCountdown();
                    // console.log('Timer complete, resetting');
                    return;
                }
                currentTime -= (incrementTime / 10) * 1.02; // Fudge for interval issues
                if (currentTime < 0) currentTime = 0;
            },
            timerComplete = function() {
                buzzer.play();
                // // console.log('Timer completed!');
                // alert('MatchClock: Countdown timer complete!');
                // return;
            },
            init = function() {
                // console.log("Timer init underway");
                $countdown = $('#match-timer');
                MatchClock.Timer = $.timer(updateTimer, incrementTime, false);
                $form = $('#match-timer-form');
                $form.bind('submit', function() {
                    MatchClock.resetCountdown();
                    return false;
                });
                MatchClock.resetCountdown();
            };
        this.resetCountdown = function() {
            var newTime = parseInt($form.find('input[type=text]').val()) * 100.;
            if (period >= noPeriods && isPlay) {
                // buzzer.play();
                MatchClock.Timer.stop();
                var done = confirm('Looks like this game is done.\nClick OK to reset, ready for the next game\nClick cancel to return to the clock for this game')
                if (done) {
                    resetGame();
                }
                return;
            }
            if (isPlay) {
                isPlay = false;
                period += 1;
                if (period <= noPeriods) {
                    newTime = lenBreak * 60. * 100.;
                } else {
                    newTime = 0.;
                }
                $('#match-period').html(period-1+' (break)');
            } else {
                isPlay = true;
                newTime = lenPeriod * 60. * 100.;
                $('#match-period').html(period);
            }
            if (newTime > 0) {
                currentTime = newTime;
                // Fudge - add a resolution element
                // currentTime += incrementTime / 10.;
            }
            this.Timer.stop().once();
            if (rollingClock && period <= noPeriods && period != 1) {
                this.Timer.toggle();
            } 
        }

        this.alterTime = function(secs) {
            if (secs > 0 || (-100 * secs < currentTime)) {
                currentTime += secs * 100.;
                $countdown.html(formatTime(currentTime));
            }
        };
        $(init);
    });
}

// Common functions
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {str = '0' + str;}
    return str;
}
function formatTime(time) {
    var min = parseInt(time / 6000),
        sec = parseInt(time / 100) - (min * 60),
        hundredths = pad(time - (sec * 100) - (min * 6000), 2);
    return (min > 0 ? pad(min, 2) + ":" : "00:") + pad(sec, 2) + (min < 1 ? "." + hundredths : "");
}
function startGame() {
    gameStarted = true;
}
function populateSelect (id, start_no, end_no) {
    var $select = $(id);
    for (i=start_no; i<=end_no; i++) {
        $select.append($('<option></option>').val(i).html(i));
    }
}
function populateSelectTeamArray (id, arr) {
    // console.log('Running populateSelectTeamArray')
    var $select = $(id)
    // // console.log($select)
    // jQuery.each(arr, function () {
    //     $select.append($('<option></option>')).val(this['name']).html(this['name']);
    // })
    // $select.append($('<option></option>');
    // $select.append($('<option></option>').val('').html(''));
    // arr.forEach(function (i) {
    //     $select.append($('<option></option>').val(i).html(i['name']));
    //     // console.log(i['name'])
    // })
    $.each(arr, function (key, value) {
        // console.log(key);
        $select.append($('<option></option>').val(key).html(value['name']));
    });
}
function populateSelects () {
    // var $perLen = $('#match-timer-len-period')
    // for (i=1; i<=10; i++) {
    //     $perLen.append($('<option></option>').val(i).html(i))
    // }
    populateSelect('#match-timer-no-periods', 1, 10);
    populateSelect('#match-timer-len-period', 1, 30);
    populateSelect('#match-timer-len-break', 1, 15);
}

function populateTeamSelects (data) {
    // console.log('Doing populateTeamSelects');
    populateSelectTeamArray('#team-home', data);
    populateSelectTeamArray('#team-away', data);
}

function alterBGTeamImage (id, team) {
    var $div = $(id);
    // Clear the existing classes on the team-img
    $div.attr('style', '');
    if (team != '') {
    // Attach the photo
    $div.css('background-image',
        'url('+teamdata[team]['img']+')');
    $div.css('background-color',
        teamdata[team]['img-clr']);
    }
}

function showTeamScore (id, score) {
    var $score = $(id);
    $score.text(score);
}

function alterBGTeamScore (id, team, score) {
    var $div = $(id);
    // Clear the existing classes on the team-img
    // $div.attr('style', '');
    $div.css('background-color',
        "");
    $div.css('color', "");
    $div.text('');
    // Attach the photo
    if (team != '') {
    $div.css('background-color',
        teamdata[team]['bg-clr']);
    $div.css('color',
        teamdata[team]['tx-clr']);
    $div.text(score);
    }   
}

function alterHomeScore (inc) {
    if (-1 * scoreHome < (inc+1)) {
    scoreHome += inc;
    showTeamScore('#team-score-home', scoreHome);
    }
}

function alterAwayScore (inc) {
    if (-1 * scoreAway < (inc+1)) {
    scoreAway += inc;
    showTeamScore('#team-score-away', scoreAway);
    }
}


// On-page-load events
$( document ).ready(function () {

    $.ajaxSetup({beforeSend: function(xhr){
      if (xhr.overrideMimeType)
      {
        xhr.overrideMimeType("application/json");
      }
    }
    });

    teamdata = {};
    [
    "./json/teams.national.json",
    "./json/teams.colours.json"
    ].forEach(function (i) {
        ($.getJSON(i, function (json) { 
            // // console.log('Have team JSON!');
            $.extend(teamdata, json);
            populateTeamSelects(json);
        }));
    });
    // Initialize system
    populateSelects();

    // Set game-alteration selects to system hard-coded defaults
    $('#match-timer-no-periods').val(noPeriods)
    $('#match-timer-len-period').val(lenPeriod)
    $('#match-timer-len-break').val(lenBreak)
    $('#match-timer-rolling').prop('checked', rollingClock)

    // Bind window open function
    $('#window-open').click(function () {
        ext = window.open('./rolling-screen.html', 'null',
            "height=1080,width=1920,menubar=no,location=no,dependent=yes,resizable,scrollbars=no,personalbar=no");
        // Close external display if confirmed
        $( window ).on('unload', function () {
            ext.close();
    })
    })
    // Bind window unload function
    // Make user connfirm navigation away
    window.onbeforeunload = function () {
        return 'Are you sure you want to leave/refresh?'
    }

    // Bind timer-alteration selects
    $('#match-timer-no-periods').change(function () {
        noPeriods = parseInt($( this ).val());
    });
    $('#match-timer-len-period').change(function () {
        lenPeriod = parseInt($( this ).val());
        if (!gameStarted) {
            resetGame();
        }
    });
    $('#match-timer-len-break').change(function () {
        lenBreak = parseInt($( this ).val());
    })
    $('#match-timer-rolling').change(function () {
        if ($( this ).prop('checked') == true) {
            rollingClock = true;
        } else {
            rollingClock = false;
        }
    })

    // Bind team-alteration selects
    $('#team-home').change(function () {
        alterBGTeamImage('#team-img-home', $( this ).val());
        alterBGTeamScore('#team-score-home', $( this ).val(), scoreHome);
    })
    $('#team-away').change(function () {
        alterBGTeamImage('#team-img-away', $( this ).val());
        alterBGTeamScore('#team-score-away', $( this ).val(), scoreAway);
    })

    // Should now be ready - reset game to start!
    resetGame();
});

window.onload = function () {
    
};

