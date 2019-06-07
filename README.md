# click-game
My final project for Operating Systems. It is a multi-client click based game.

The game is played in a web browser. The objective is to mouse over the red "goal" dot before any of the other players. Each player
is assigned a random color upon joining the game. The game plays like a never-ending game of "King of the Hill": the player with the
highest score is currently "winning", but the game has no actual end. The game only ends when the server does.

After the server is started, the game is hosted on port 8550. To play the game, open your web browser of choice.
If you are on the computer hosting the server script, navigate to "localhost:8550". If you are playing on the same network, but not
on the host machine, navigate to [host IP]":8550". If you would like clients outside of the local network to connect, you will need to
forward port 8550 first, then have other players navigate to [host public IP]":8550".
