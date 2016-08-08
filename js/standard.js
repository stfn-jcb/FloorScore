// Global scope variables for period type, numbers etc.
var period, isPlay, noPeriods, lenPeriod, lenBreak, rollingClock, gameStarted;
// Added variables for improved time-keeping
var startTime, isRunning;
var MatchClock;
var buzzer = new Audio('./mp3/47434BUZZER.mp3');
var warningThiry = new Audio('./mp3/thirty.mp3');
var warningGiven;
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
    isPlay = true;
    // Do things here to get a hold of the number of periods,
    // the period length and the length of the period break
    noPeriods = parseInt($('#match-timer-no-periods').val()); // mins
    lenPeriod = parseInt($('#match-timer-len-period').val()); // mins
    lenBreak = parseInt($('#match-timer-len-break').val());; // mins
    rollingClock = true;
    gameStarted = false;
    done = false;
    warningGiven = false;

    clockRed('#match-timer');

    scoreHome = 0;
    scoreAway = 0;
    $("#team-home").val("").change();
    $("#team-away").val('').change();

    $('#match-period').text(period);

    // MatchClock object
    MatchClockTock = new Tock ({
        countdown: true,
        startTime: 15*60*1000,
        interval: 70,
        onTick: function () {
            // if (MatchClockTock.lap() > 10000) {
            //     $('#match-timer').text(MatchClockTock.lap('{mm}:{ss}'));
            // } else {
            //     $('#match-timer').text(MatchClockTock.lap('{ss}.{ll}'));
            // }
            $('#match-timer').text(formatTime(MatchClockTock.lap()));
            if ((!isPlay) && (MatchClockTock.lap() < 30*1000) && (MatchClockTock.lap() > 29*1000) && (!warningGiven)) {
                warningThiry.play();
                warningGiven = true;
            }
        },
        onComplete: function () {
            // console.log('Inside onComplete');
            buzzer.play();
            if (period >= noPeriods && isPlay) {
                // MatchClockTock.stop();
                clockRed('#match-timer');
                var done = confirm('Looks like this game is done.\nClick OK to reset, ready for the next game\nClick cancel to return to the clock for this game')
                if (done) {
                    MatchClockTock.reset();
                    resetGame();
                    return;
                }
                return;
            }
            if (isPlay) {
                isPlay = false;
                period += 1;
                if (period <= noPeriods) {
                    newTime = lenBreak * 60. * 1000.;
                } else {
                    newTime = 0.;
                }
                // $('#match-period').html(period-1+' (break)');
                $('#match-period').html(period+' next...');
            } else {
                isPlay = true;
                newTime = lenPeriod * 60. * 1000.;
                $('#match-period').html(period);
            }
            if (newTime > 0) {
                MatchClockTock.startTime = newTime;
                MatchClockTock.reset();
                MatchClockTock.onTick();
                // Fudge - add a resolution element
                // currentTime += incrementTime / 10.;
            }
            // this.Timer.stop().once();
            if (rollingClock && period <= noPeriods && period != 1) {
                MatchClockTock.start();
            }
        },
        onReset: function () {
            // console.log('Inside onReset');
        }
    });

    // MatchClockTock.onTick();
    MatchClockTock.alterTime  = function (secs) {
        if (secs > 0 || (-1000 * secs < MatchClockTock.lap())) {
            now = MatchClockTock.lap();
            // console.log('Now is '+now)
            // console.log('Secs is'+1000*secs)
            newTime = now + (secs * 1000);
            // console.log('newTime is'+newTime);
            MatchClockTock.startTime = newTime;
            // console.log('New startTime is '+MatchClockTock.startTime)
            if (MatchClockTock.isRunning) {
                MatchClockTock.reset();
                MatchClockTock.start();
            } else {
                MatchClockTock.startTime = now + (secs * 1000);
                MatchClockTock.reset();
                MatchClockTock.onTick();
            }
            warningGiven = false;
        }
    }

    // Game start functions
    MatchClockTock.startTime = lenPeriod * 60. * 1000.;
    MatchClockTock.reset();
    MatchClockTock.onTick();

}

function toggleClock(clock) {
    if (clock.isRunning) {
        clock.stop();
        clockRed('#match-timer');
    } else {
        clock.start();
        clockGreen('#match-timer');
    }
}

function clockRed(id) {
    var $select = $(id);
    $select.attr('style', '');
    $select.attr('style', 'border-right: 10px solid red;');
}

function clockGreen(id) {
    var $select = $(id);
    $select.attr('style', '');
    $select.attr('style', 'border-right: 10px solid green;');
}

// Common functions
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {str = '0' + str;}
    return str;
}
function formatTime(time) {
    var min = parseInt(time / 60000),
        sec = parseInt(time / 1000) - (min * 60),
        mills = Math.floor((time - (sec * 1000) - (min * 60000)) / 100);
    return (min > 0 ? pad(min, 2) + ":" : "00:") + pad(sec, 2) + (min < 1 ? "." + mills : "");
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

function alterPeriod(inc) {
    var conf = confirm("Are you sure? You don't need to alter the period manually unless there has been an error")
    if (conf) {
        if ((period+inc <= noPeriods) && (period+inc > 0)) {
            period += inc;
            if (isPlay) {
                $('#match-period').text(period);
            } else {
                $('#match-period').html(period+' next...');
            }
        }
    }
}


// On-page-load events
$( document ).ready(function () {

    clockToggleH = parseInt($('#clock-toggle').css('height'));
    $('#clock-toggle').css('height', 2*clockToggleH + 'px');

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
            currHome = $('#team-home').val();
            currAway = $('#team-away').val();
            resetGame();
            $('#team-home').val(currHome).change();
            $('#team-away').val(currAway).change();
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
