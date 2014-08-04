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
		experiment.lessVsMore(true,3,3,200);
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
							experiment.lessVsMore(true,1,1,800);
						}, 1000);
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
		
		showSlide("prestudy");
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
		if (numLeft > 1) setTimeout(function() {experiment.moreRecurse(show, (numLeft - 1), direction, speed, 
			left + 65, right + 65);}, (3 * speed));
	},

	moveCookies: function(show, numCookies, direction, speed) {
		//end pile
		var cookie = document.createElement("img");
		cookie.setAttribute("id", "cookiePile" + parseInt(numCookies));
		cookie.setAttribute("class", direction + "Cookie");
		cookie.setAttribute("style", "width: 100px");
		if (numCookies == 1) {
			cookie.src="CookiePictures/CCC.png";
		} else if (numCookies == 2) {
			cookie.src = "CookiePictures/twoCookies.png";
		} else if (numCookies == 3) {
			cookie.src="CookiePictures/threeCookies.png";
		} else if (numCookies == 4) {
			cookie.src="CookiePictures/fourCookies";
		}
		if(!show) {
			mainexpt.appendChild(cookie);
		}
		for (var i = 0; i < numCookies; i++) {
			//moving cookies
			var cookie = document.createElement("img");
			cookie.setAttribute("id", "cookie" + direction + parseInt(i + 1));
			cookie.setAttribute("class", "cookie");
			cookie.src="CookiePictures/CCC.png"
			cookie.setAttribute("style", "width: 75px");
			if (show) {
				warmUp.appendChild(cookie);
			} else {
				mainexpt.appendChild(cookie);
			}
		}

		var left, right;
		if (numCookies == 3) {
			left = 82;
			right = 850;
		} else if (numCookies == 2) {
			left = 117;
			right = 877;
		} else if (numCookies == 1) {
			left = 147;
			right = 910;
		}
		experiment.moreRecurse(show, numCookies, direction, speed, left, right);					
	},

	lessVsMore: function(show, less, more, speed) {
		if(show) {
			showSlide("warmUp");
		} else {
			showSlide("mainexpt");
		}	
		var clickDisabled = true;
		experiment.task = parseInt(less) + "vs" + parseInt(more);

		var x = Math.floor(Math.random()*100);
		var y = Math.floor(Math.random()*100);
		if (x < 50) {
			experiment.initialBucket = "leftB";
			if (y < 50) {
				experiment.moreBucket = "rightB";
				experiment.moveCookies(show, less, 'left', speed);
				setTimeout(function() {experiment.moveCookies(show, more, 'right', speed);}, (3 * speed * less));
			} else {
				experiment.moreBucket = "leftB";
				experiment.moveCookies(show, more, 'left', speed);
				setTimeout(function() {experiment.moveCookies(show, less, 'right', speed);}, (3 * speed * more));
			}			
		} else {
			experiment.initialBucket = "rightB";
			if (y < 50) {
				experiment.moreBucket = "leftB";
				experiment.moveCookies(show, less, 'right', speed);
				setTimeout(function() {experiment.moveCookies(show, more, 'left', speed);}, (3 * speed * less));
			} else {
				experiment.moreBucket = "rightB";
				experiment.moveCookies(show, more, 'right', speed);
				setTimeout(function() {experiment.moveCookies(show, less, 'left', speed);}, (3 * speed * more));
			}
		}

		experiment.firstMove = (new Date()).getTime();
		experiment.startTime = (new Date()).getTime() + ((less + more) * 3 * speed);
		//Allows clicks as soon as startTime occurs
		setTimeout(function() {clickDisabled = false;}, (less + more) * 3 * speed);

		if (show) {
			$('.plate').bind('click touchstart', function(event) {		
				if(clickDisabled) return;	
				clickDisabled = true;
				experiment.clickTime = (new Date()).getTime();
				var choice = $(event.currentTarget).attr('id');
				experiment.userChoice = choice;
				$('.cookie').fadeOut();
				$('.plate').fadeOut();
				//setTimeout(function() {experiment.lessVsMore(false, 1, 2, 800);}, 800);

			});
			$('.cookie').bind('click touchstart', function(event) {		
				if(clickDisabled) return;	
				clickDisabled = true;
				experiment.clickTime = (new Date()).getTime();
				var choice = $(event.currentTarget).attr('id');
				experiment.userChoice = choice;
				$('.cookie').fadeOut();
				$('.plate').fadeOut();
				//setTimeout(function() {experiment.lessVsMore(false, 1, 2, 800);}, 800);
			});
		} else {
			$('.right').bind('click touchstart', function(event) {		
				if(clickDisabled) return;
				clickDisabled = true;	
				experiment.clickTime = (new Date()).getTime();
				var choice = $(event.currentTarget).attr('id');
				experiment.userChoice = choice;
				//secondClass = $('#'+choice).attr('class').split(' ')[1];
				$('.right').fadeOut();
				$('.left').fadeOut();
			});
			$('.left').bind('click touchstart', function(event) {		
				if(clickDisabled) return;
				clickDisabled = true;	
				experiment.clickTime = (new Date()).getTime();
				var choice = $(event.currentTarget).attr('id');
				experiment.userChoice = choice;
				//secondClass = $('#'+choice).attr('class').split(' ')[1];
				$('.right').fadeOut();
				$('.left').fadeOut();
			});
		}	
	},

	cookieFunction : function(show, numCookies, direction, speed) {
		for(var i = 0; i < numCookies; i++) {
			experiment.moveCookies(show,1,direction,speed);
		}	
	},

	end: function () {
    	setTimeout(function () {$("#mainexpt").fadeOut();}, 1000);
    	showSlide("finish");
    	document.body.style.background = "black";
    }

}


