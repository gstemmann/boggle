from flask import Flask, render_template, session, jsonify, request
from boggle import Boggle

app = Flask(__name__)


app.config['SECRET_KEY'] = 'secret_thing'
boggle_game = Boggle()

@app.route('/')
def show_main_page():
    # make the board and then render the gameboard in the DOM only
    board = boggle_game.make_board()
    session['board'] = board

    highscore = session.get('highscore', 0)
    numplays = session.get('numplays', 0)

    return render_template('index.html', board=board, highscore=highscore, numplays=numplays)

# @app.route('/2ndwindow', methods=['POST'])
# def show_new_page():
    # check = check_valid_word()
#     submission = request.form['submission']
        # submission.response.jsonify()
#     return render_template

@app.route('/check-word')
def check_word():
    #the method board check_valid_word is a method in Boggle class that
    #accepts the board(that is in session)
    #and the word that is entered by the user and our js funciton sends it
    #to our server to check if the word is valid
    word = request.args['word']
    board = session['board']
    # remember on line 8 they change the Boggle() class to boggle_game in starter code
    #for no apparent reason
    response_string = boggle_game.check_valid_word(board, word)
    # check_word = Boggle.check_valid_word(res)
    # return render_template
    return jsonify({'response': response_string})

@app.route('/end-game', methods=['POST'])
def end_game():
    score = request.json['score']

    highscore = session.get('highscore', 0)
    numplays = session.get('numplays', 0)

    session['highscore'] = max(score, highscore)
    session['numplays'] = numplays + 1

    return 'game over'