from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

   def setUp(self):
       """Stuff to do before every test"""
 
       self.client = app.test_client()
       app.config['TESTING'] = True

   def test_homepage(self):
       """check to make sure everything starts up correctly with the displays we are hoping for"""
       with self.client:
           res = self.client.get('/')
           html = res.get_data(as_text=True)

   def test_homepage(self):
       with self.client:
           res = self.client.get('/')
           decoded = res.data.decode()
           self.assertIn("Score: 0", decoded)
           self.assertIn("Times Played: 0", decoded)
           self.assertIn("High Score: 0", decoded)


   def test_homepage(self):
       """check to make sure everything starts up correctly with the displays we are hoping for"""
       with self.client:
           res = self.client.get('/')
           decoded = res.data.decode()
           self.assertIn("Times Played: 0", decoded)
           self.assertIn("High Score: 0", decoded)
           self.assertIn('board',session)
           self.assertIsNone(session.get("highscore"))
           self.assertIsNone(session.get("numplays"))
           
   def test_valid_word(self):

         with self.client as client:
            with client.session_transaction() as sess:
               sess['board'] = [["R", "O", "K", "R", "T"],
                                ["C", "C", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"]]
            response = self.client.get('/check-word?word=rock')
            self.assertEqual(response.json['response'], 'ok')

   def test_not_word(self):
       """test if a non-english word is submitted"""
      
       with self.client as client:
           with client.session_transaction() as sess:
               sess['board'] = [["R", "O", "K", "R", "T"],
                                ["C", "C", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"],
                                ["C", "A", "T", "T", "T"]]
       response = self.client.get('/check-word?word=leblanc')
       self.assertEqual(response.json['response'], 'not-word')