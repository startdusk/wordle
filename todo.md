V1:

- you provide five char guesses
- each guess must be a word
- when you press enter,
	- board 
		- you see the status of you last guess
			- letters that are in wrong places are yellow
			- missing letters are grey
			- correct guesses + positions are green
			- snake the active row on word we don't know
	- keyborad 
		- reflects same data
		- third row is enter [...] backspace
		- you can still input by typing
		- when you press enter, each letter animates into rotaing from black to grey one
	- you only see past + active attempt
	- if you make too many attempts you probably die
	- initial visual state
		- all rows are empty
		- as i fill out my guess, background is black
		- filled out cells have slight border highlight