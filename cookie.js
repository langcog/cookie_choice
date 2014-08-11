//show slide
function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}

getCurrentDate = function() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

getCurrentTime = function() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}

createDot = function(dotx, doty, i) {
	var monsterPic = document.createElement("img");
	monsterPic.setAttribute("class", "dot");
	monsterPic.id = "monster" + parseInt(i + 1);
	monsterPic.src="CookiePictures/monster.png";

    var x = Math.floor(Math.random()*950);
    var y = Math.floor(Math.random()*540);

    var invalid = "true";

    //make sure dots do not overlap
    while (true) {
    	invalid = "true";
	   	for (j = 0; j < dotx.length ; j++) {
    		if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 250) {
    			var invalid = "false";
    			break; 
    		}
		}
		if (invalid === "true") {
 			dotx.push(x);
  		  	doty.push(y);
  		  	break;	
  	 	}
  	 	x = Math.floor(Math.random()*400);
   		y = Math.floor(Math.random()*400);
	}

    monsterPic.setAttribute("style","position:absolute;left:"+x+"px;top:"+y+"px;");
   	training.appendChild(monsterPic);
}

function play(id) {
       var audio = document.getElementById(id);
       audio.play();
    }

var chosenStart = [1, 2, 3, 4];
function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
var chosen = shuffle(chosenStart);

var yay = new Audio("http://dev.interactive-creation-works.net/1/1.ogg");

showSlide("instructions");

var experiment = {
	
	subid: "",

	task: "",

	//Warm up variables
	initialPlate: "",

	morePlate: "",

	plateChoice: "",



	//Experimental task variables
	//first bucket
	initialBucket: "",

	moreBucket: "",

	userChoice: "",
	//Beginning of animation
	firstMove: 0,
	//Starts as soon as animation ends, which is right when click is enabled
	startTime: 0,
	//Time when object is clicked
	clickTime: 0,

	reactionTime: 0,

	preStudy: function() {
		//document.body.style.background = "black";
		$("#prestudy").hide();
		showSlide("warmUp");
		experiment.runNext(true, 1);
	},

	mainTrials: function() {
		$('#preStudy').hide();
		showSlide("mainexpt");
		experiment.runNext(false, 1);
	},

	training: function(dotgame) {
		var monsters = ["monster1", "monster2", "monster3", "monster4", "monster5"];
		var xcounter = 0;
		var dotCount = 5;

		var dotx = [];
		var doty = [];

		for (i = 0; i < dotCount; i++) {
			createDot(dotx, doty, i);
		}
		
		showSlide("training");
		$('.dot').bind('click touchstart', function(event) {
	    	var dotID = $(event.currentTarget).attr('id');

	    	//only count towards completion clicks on CookieMonster that have not yet been clicked
	    	if (monsters.indexOf(dotID) === -1) {
	    		return;
	    	}
	    	monsters.splice(monsters.indexOf(dotID), 1);
	    	document.getElementById(dotID).src = "CookiePictures/x.jpg";
	    	xcounter++
	    	if (xcounter === dotCount) {
	    		setTimeout(function () {
	    			$("#training").hide();
	    			if (dotgame === 0) {		
	    				//hide old x marks before game begins again
	    				var dotID;
	    				for (i = 1; i <= dotCount; i++) {
	    					dotID = "monster" + i;
	    					training.removeChild(document.getElementById(dotID));
	    				}
						experiment.training();
						dotgame++; 
					} else {
						//document.body.style.background = "black";
						setTimeout(function() {
							showSlide("prestudy");
						}, 500);
					}
				}, 1000);
			}
	    });
	},

	checkInput: function() {
		//subject ID
  		if (document.getElementById("subjectID").value.length < 1) {
			$("#checkMessage").html('<font color="red">You must input a subject ID</font>');
			return;
		}
  		experiment.subid = document.getElementById("subjectID").value;

		//list
		if (document.getElementById("order").value !== "1" && document.getElementById("order").value !== "2") { //|| document.getElementById("order").value !== "2") {
			$("#checkMessage").html('<font color="red">For list, you must choose either a 1 or 2</font>');
			return;
		}
		experiment.order = parseInt(document.getElementById("order").value);
		
		showSlide("transition");
		experiment.training(1);			
	},

	processOneRow: function() {
		var dataforRound = experiment.subid; 
		dataforRound += "," + experiment.task + "," + experiment.initialBucket + "," + experiment.moreBucket + "," + experiment.userChoice;
		dataforRound += "," + experiment.firstMove + "," + experiment.startTime + "," + experiment.clickTime;
		$.post("http://langcog.stanford.edu/cgi-bin/Cookie/cookie.php", {postresult_string : dataforRound});	
	},

	moreRecurse: function(show, numLeft, direction, speed, left, right) {
		var moveAwayPercent = direction == 'left' ? parseInt(left) + 'px' : parseInt(right) + 'px';
		for (var i = 0; i < 1; i++) {
			(function(index) {
				$('#cookie' + direction + parseInt(numLeft)).animate({'top': '10%'}, {duration: speed}, speed);
				$('#cookie' + direction + parseInt(numLeft)).animate({'left': moveAwayPercent}, {duration: speed}, speed);				
				$('#cookie' + direction + parseInt(numLeft)).animate({'top': '53%'}, {duration: speed,
					complete: function() {
						// We don't want the cookie to reappear on the last animation
						if (!show) {
							$(this).removeAttr('style'); // Remove style jquery added
						}
					}
				}, speed);				
			})(i);
		}
		if (numLeft > 1 && show) {
			setTimeout(function() {experiment.moreRecurse(show, (numLeft - 1), direction, speed, 
			left + 57, right + 57);}, (3 * speed));
		} else if (numLeft > 1) {
			setTimeout(function() {experiment.moreRecurse(show, (numLeft - 1), direction, speed, 
			left, right);}, (3 * speed));
		}
	},

	setChildren : function(show, numCookies, direction) {
		if (show) {
			var pile = document.createElement("img");
			pile.setAttribute("id", "cookies");
			pile.setAttribute("class", "cookiePile");
			pile.src="CookiePictures/pile.png";
			warmUp.appendChild(pile);
			var plateL = document.createElement("img");
			plateL.setAttribute("id", "plateLeft");
			plateL.setAttribute("class", "plate");
			plateL.src="CookiePictures/plate.png";
			warmUp.appendChild(plateL);
			var plateR = document.createElement("img");
			plateR.setAttribute("id", "plateRight");
			plateR.setAttribute("class", "plate");
			plateR.src="CookiePictures/plate.png";
			warmUp.appendChild(plateR);
		} else {
			//create buckets
			var rightTop = document.createElement("img");
			rightTop.setAttribute("id", "rightTop");
			rightTop.setAttribute("class", "bucketTop right");
			rightTop.src="CookiePictures/bowlTop.png";
			mainexpt.appendChild(rightTop);
			var leftTop = document.createElement("img");
			leftTop.setAttribute("id", "leftTop");
			leftTop.setAttribute("class", "bucketTop left");
			leftTop.src="CookiePictures/bowlTop.png";
			mainexpt.appendChild(leftTop);
			var rightBottom = document.createElement("img");
			rightBottom.setAttribute("id", "rightBottom");
			rightBottom.setAttribute("class", "bucketBottom right");
			rightBottom.src="CookiePictures/bowlBottom.png";
			mainexpt.appendChild(rightBottom);
			var leftBottom = document.createElement("img");
			leftBottom.setAttribute("id", "leftBottom");
			leftBottom.setAttribute("class", "bucketBottom left");
			leftBottom.src="CookiePictures/bowlBottom.png";
			mainexpt.appendChild(leftBottom);

			//create cookie pile
			var pile = document.createElement("img");
			pile.setAttribute("id", "cookies");
			pile.setAttribute("class", "cookiePile");
			pile.src="CookiePictures/pile.png";
			mainexpt.appendChild(pile);
			var endPile = document.createElement("img");
			endPile.setAttribute("id", "cookiePile" + parseInt(numCookies));
			endPile.setAttribute("class", direction + "Cookie");
			var leftRight;
			if (numCookies == 1) {
				endPile.src="CookiePictures/CCC.png";
				leftRight = direction == 'left' ? "14%" : "80%";
				endPile.setAttribute("style", "width: 65px; left: " + leftRight);
			} else if (numCookies == 2) {
				endPile.src = "CookiePictures/twoPile.png";
				leftRight = direction == 'left' ? "11%" : "77%";
				endPile.setAttribute("style", "left: " + leftRight);
			} else if (numCookies == 3) {
				endPile.src="CookiePictures/threePile.png";
				leftRight = direction == 'left' ? "9%" : "75%";
				endPile.setAttribute("style", "left: " + leftRight);
			} else if (numCookies == 4) {
				endPile.src="CookiePictures/fourPile.png";
				leftRight = direction == 'left' ? "7%" : "72%";
				endPile.setAttribute("style", "left: " + leftRight);
			}
			mainexpt.appendChild(endPile);
		}
		var yay = document.createElement("audio");
		yay.setAttribute("id", "yay");
		yay.src="CookieSounds/yay.mp3";
		var aw = document.createElement("audio");
		aw.setAttribute("id", "aw");
		aw.src="CookieSounds/aw.mp3";
		
		//moving cookies
		for (var i = 0; i < numCookies; i++) {
			var cookie = document.createElement("img");
			cookie.setAttribute("id", "cookie" + direction + parseInt(i + 1));
			if (direction == 'left') cookie.setAttribute("class", "cookie leftCook");
			if (direction == 'right') cookie.setAttribute("class", "cookie rightCook");
			cookie.src="CookiePictures/CCC.png";
			if (show) {
				warmUp.appendChild(cookie);
				warmUp.appendChild(yay);
				warmUp.appendChild(aw);
			} else {
				mainexpt.appendChild(cookie);
				mainexpt.appendChild(yay);
				mainexpt.appendChild(aw);
			}
		}
	},

	moveCookies: function(show, numCookies, direction, speed) {
		experiment.setChildren(show, numCookies, direction);
		var left, right;
		if (show) {
			if (numCookies == 3) {
				left = 94;
				right = 860;
			} else if (numCookies == 2) {
				left = 122;
				right = 887;
			} else if (numCookies == 1) {
				left = 151;
				right = 916;
			} else if (numCookies == 4) {
				left = 67;
				right = 832;
			}
		} else {
			left = 151;
			right = 916;
		}
		setTimeout(function() {experiment.moreRecurse(show, numCookies, direction, speed, left, right);}, 300);					
	},

	lessVsMore: function(show, less, more, speed, trial) {
		if(show) {
			showSlide("warmUp");
		} else {
			showSlide("mainexpt");
		}	
		var clickDisabled = true;
		experiment.task = parseInt(less) + "vs" + parseInt(more);

		var x = Math.floor(Math.random()*100);
		var y = Math.floor(Math.random()*100);
		experiment.firstMove = (new Date()).getTime();
		experiment.startTime = (new Date()).getTime() + ((less + more) * 3 * speed);
		//Allows clicks as soon as startTime occurs
		//setTimeout(function() {clickDisabled = false;}, (less + more) * 3 * speed);
		if (x < 50) {
			experiment.initialBucket = "leftB";
			if (y < 50) {
				experiment.moreBucket = "rightB";
				experiment.moveCookies(show, less, 'left', speed);
				setTimeout(function() {experiment.moveCookies(show, more, 'right', speed); experiment.getClickData(show, false, trial, 'right');}, (3 * speed * less));
			} else {
				experiment.moreBucket = "leftB";
				experiment.moveCookies(show, more, 'left', speed);
				setTimeout(function() {experiment.moveCookies(show, less, 'right', speed); experiment.getClickData(show, false, trial, 'left');}, (3 * speed * more));
			}			
		} else {
			experiment.initialBucket = "rightB";
			if (y < 50) {
				experiment.moreBucket = "leftB";
				experiment.moveCookies(show, less, 'right', speed);
				setTimeout(function() {experiment.moveCookies(show, more, 'left', speed); experiment.getClickData(show, false, trial, 'left');}, (3 * speed * less));
			} else {
				experiment.moreBucket = "rightB";
				experiment.moveCookies(show, more, 'right', speed);
				setTimeout(function() {experiment.moveCookies(show, less, 'left', speed); experiment.getClickData(show, false, trial, 'right');}, (3 * speed * more));		
			}
		}	
	},

	getClickData : function(show, clickDisabled, trial, moreSide) {
		if (show) {
			$('.plate').bind('click touchstart', function(event) {		
				if(clickDisabled) return;
				var choice = $(event.currentTarget).attr('id');
				if (moreSide == 'right' && choice == 'plateRight' || moreSide == 'left' && choice == 'plateLeft') {
					clickDisabled = true;
					play("yay");
					experiment.clickTime = (new Date()).getTime();
					experiment.userChoice = choice;
					$('.cookie').fadeOut(500);
					if (trial < 8) {
						setTimeout(function() {
							while (warmUp.firstChild) {
								warmUp.removeChild(warmUp.firstChild);
							}
							experiment.runNext(true, trial + 1);
						}, 2000);
					} else {
						setTimeout(function() {
							while (warmUp.firstChild) {
								warmUp.removeChild(warmUp.firstChild);
							}
							showSlide("transition");
						}, 2000);
					}
				} else {
					play("aw");
				}	
			});
			$('.cookie').bind('click touchstart', function(event) {		
				if(clickDisabled) return;
				var choice = $(event.currentTarget).attr('id');	
				secondClass = $('#'+choice).attr('class').split(' ')[1];
				if (moreSide == 'left' && secondClass == "leftCook" || moreSide == 'right' && secondClass == "rightCook") {
					clickDisabled = true;
					play("yay");
					experiment.clickTime = (new Date()).getTime();
					experiment.userChoice = choice;
					$('.cookie').fadeOut(500);
					if (trial < 8) {
						setTimeout(function() {
							while (warmUp.firstChild) {
								warmUp.removeChild(warmUp.firstChild);
							}
							experiment.runNext(true, trial + 1);
						}, 2000);
					} else {
						setTimeout(function() {
							while (warmUp.firstChild) {
								warmUp.removeChild(warmUp.firstChild);
							}
							showSlide("transition");
						}, 2000);
					}
				} else {
					play("aw");
				}
			});
		} else {
			$('.right').bind('click touchstart', function(event) {		
				if(clickDisabled) return;
				if (moreSide != 'right') {
					play("aw");
				} else {
					clickDisabled = true;	
					experiment.clickTime = (new Date()).getTime();
					var choice = $(event.currentTarget).attr('id');
					experiment.userChoice = choice;
					play("yay");
					$('.right').fadeOut(500);
					$('.left').fadeOut(500);
					if (trial < 16) {
						setTimeout(function() {
							while (mainexpt.firstChild) {
								mainexpt.removeChild(mainexpt.firstChild);
							}
							experiment.runNext(false, trial + 1);
						}, 2000);
					} else {
						experiment.end();
					}
				}
			});
			$('.left').bind('click touchstart', function(event) {		
				if(clickDisabled) return;
				if (moreSide != 'left') {
					play("aw");
				} else {
					clickDisabled = true;	
					experiment.clickTime = (new Date()).getTime();
					var choice = $(event.currentTarget).attr('id');
					experiment.userChoice = choice;
					//secondClass = $('#'+choice).attr('class').split(' ')[1];
					play("yay");
					$('.right').fadeOut(500);
					$('.left').fadeOut(500);
					if (trial < 16) {
						setTimeout(function() {
							while (mainexpt.firstChild) {
								mainexpt.removeChild(mainexpt.firstChild);
							}
							experiment.runNext(false, trial + 1);
						}, 2000);
					} else {
						experiment.end();
					}
				}
			});
		}
	},

	runNext : function(show, trial) {
		var newTrial = trial;
		while (newTrial > 4) {
			newTrial = trial - 4;
		}
		var type = chosen[newTrial - 1];
		if (type == 1) {
			experiment.lessVsMore(show, 1, 2, 200, trial);
		} else if (type == 2) {
			experiment.lessVsMore(show, 1, 3, 200, trial);
		} else if (type == 3) {
			experiment.lessVsMore(show, 1, 4, 200, trial);
		} else if (type == 4) {
			experiment.lessVsMore(show, 2, 3, 200, trial);
		} 
	},

	end: function () {
    	setTimeout(function () {
    		$("#mainexpt").fadeOut();
    		showSlide("finish");
    		document.body.style.background = "black";
    	}, 1000);
    }, 

}


