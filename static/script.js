'use strict';

let score = 0;
let time = 120;

$('#timer').html(time);
$('form').on('submit', handleSubmit);

const makeRequest = () => {
	axios
		.post('http://127.0.0.1:5000/')
		.then((response) => {
			const newPost = response.data;
			console.log('POST has been made');
			appenToDOM([ newPost ]);
		})
		.catch((error) => console.error(error));
};

$('form').on('submit', handleSubmit);

async function handleSubmit(e) {
	e.preventDefault();
	//this variable is the word submitted through the form
	let word = $('input').val();
	//if nothing in form, then do nothing
	if (!word) return;
	//send word in form to server to "check_valid_word" method in boggle.py

	const res = await axios.get('/check-word', {
		params : {
			word : word
		}
	});
	let response = res.data.response;
	let new_response = document.getElementById('response');
	new_response.append(response);
	$('form').trigger('reset');

	if (response === 'ok') {
		score += word.length;
		$('#score').html(`Score: ${score}`);
	}
}
let countDown = setInterval(() => {
	time--;
	$('#timer').html(time);
	stopTimer();
}, 1000);

function stopTimer() {
	if (time < 1) {
		clearInterval(countDown);
		$('form').hide();
		$('.container').append($('<span>').html('GAME OVER'));
	}
}
