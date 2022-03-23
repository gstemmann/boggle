// 'use strict';

// let score = 0;
// let words = new Set()
// let time = 120;

// $('#timer').html(time);
// $('form').on('submit', handleSubmit);

// const makeRequest = () => {
// 	axios
// 		.post('http://127.0.0.1:5000/')
// 		.then((response) => {
// 			const newPost = response.data;
// 			console.log('POST has been made');
// 			appenToDOM([ newPost ]);
// 		})
// 		.catch((error) => console.error(error));
// };

// $('form').on('submit', handleSubmit);

// async function handleSubmit(e) {
// 	e.preventDefault();
// 	//this variable is the word submitted through the form
// 	let word = $('input').val();
// 	//if nothing in form, then do nothing
// 	if (!word) return;
// 	//send word in form to server to "check_valid_word" method in boggle.py

// 	const res = await axios.get('/check-word', {
// 		params : {
// 			word : word
// 		}
// 	});
// 	let response = res.data.response;
// 	let new_response = document.getElementById('response');
// 	new_response.append(response);
// 	$('form').trigger('reset');

// 	if (response === 'ok') {
// 		if (words.has(word)) {
// 			return;
// 		}
// 		words.add(word);
// 		score += word.length;
// 		$('#score').html(`Score: ${score}`);
// 	}
// }
// let countDown = setInterval(() => {
// 	time--;
// 	$('#timer').html(time);
// 	stopTimer();
// }, 1000);

// function stopTimer() {
// 	if (time < 1) {
// 		clearInterval(countDown);
// 		$('form').hide();
// 		$('.container').append($('<span>').html('GAME OVER'));
// 		endgame();
// 	}
// }
// async function endGame() {
// 	await axios.post('/end-game', {score : score})
// }


// "use strict";
 
// let score = 0;
 
// //Create an empty Set where correct words from the board are stored
// let words = new Set();
 
// //Set countdown timer until endgame
// let time = 10;
// $("#timer").html(time);
 
// $("form").on("submit", handleSubmit);
 
// async function handleSubmit(e) {
//  e.preventDefault();
//  //create a variable that equals the word submitted through the form
//  let word = $("input").val();
//  //do nothing if the form is empty
//  if (!word) return;
//  //send this word to the "server" to have it check if it is an appropriate response.
//  const res = await axios.get("/check-word", { params: { word: word } });
//  //set the response from the "server" to a variable
//  let response = res.data.response;
//  //display response in DOM
//  $("#response").html(response);
//  //reset form
//  $("form").trigger("reset");
//  //If the server determines this is an appropriate response and the word is not in our words Set, add the word to our words Set, update the score value, and update the score in the DOM.
//  if (response === "ok") {
//    if (words.has(word)) {
//      return;
//    }
//    words.add(word);
//    score += word.length;
//    $("#score").html(`Score: ${score}`);
//  }
// }
 
// let countDown = setInterval(function () {
//  //Every second, decrease the time by one and update the time displayed in the DOM
//  time--;
//  $("#timer").html(time);
//  //run this function that only fully executes when time is up.
//  stopTimer();
// }, 1000);
 
// function stopTimer() {
//  //if time has run out, stop the countdown and replace the form with the words "GAME OVER"
//  if (time < 1) {
//    clearInterval(countDown);
//    $("form").hide();
//    $(".container").append($("<span>").html("GAME OVER!!!"));
//    endGame();
//  }
// }
 
// async function endGame() {
//  //post score to server to see if the high score needs to be updated
//  await axios.post("/end-game", { score: score });
// }


class BoggleGame {
	/* make a new game at this DOM id */
  
	constructor(boardId, secs = 60) {
	  this.secs = secs; // game length
	  this.showTimer();
  
	  this.score = 0;
	  this.words = new Set();
	  this.board = $("#" + boardId);
  
	  // every 1000 msec, "tick"
	  this.timer = setInterval(this.tick.bind(this), 1000);
  
	  $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
	}
  
	/* show word in list of words */
  
	showWord(word) {
	  $(".words", this.board).append($("<li>", { text: word }));
	}
  
	/* show score in html */
  
	showScore() {
	  $(".score", this.board).text(this.score);
	}
  
	/* show a status message */
  
	showMessage(msg, cls) {
	  $(".msg", this.board)
		.text(msg)
		.removeClass()
		.addClass(`msg ${cls}`);
	}
  
	/* handle submission of word: if unique and valid, score & show */
  
	async handleSubmit(evt) {
	  evt.preventDefault();
	  const $word = $(".word", this.board);
  
	  let word = $word.val();
	  if (!word) return;
  
	  if (this.words.has(word)) {
		this.showMessage(`Already found ${word}`, "err");
		return;
	  }
  
	  // check server for validity
	  const resp = await axios.get("/check-word", { params: { word: word }});
	  if (resp.data.result === "not-word") {
		this.showMessage(`${word} is not a valid English word`, "err");
	  } else if (resp.data.result === "not-on-board") {
		this.showMessage(`${word} is not a valid word on this board`, "err");
	  } else {
		this.showWord(word);
		this.score += word.length;
		this.showScore();
		this.words.add(word);
		this.showMessage(`Added: ${word}`, "ok");
	  }
  
	  $word.val("").focus();
	}
  
	/* Update timer in DOM */
  
	showTimer() {
	  $(".timer", this.board).text(this.secs);
	}
  
	/* Tick: handle a second passing in game */
  
	async tick() {
	  this.secs -= 1;
	  this.showTimer();
  
	  if (this.secs === 0) {
		clearInterval(this.timer);
		await this.scoreGame();
	  }
	}
  
	/* end of game: score and update message. */
  
	async scoreGame() {
	  $(".add-word", this.board).hide();
	  const resp = await axios.post("/post-score", { score: this.score });
	  if (resp.data.brokeRecord) {
		this.showMessage(`New record: ${this.score}`, "ok");
	  } else {
		this.showMessage(`Final score: ${this.score}`, "ok");
	  }
	}
  }