Final Project 

# Final Project - Minesweeper Team 5
Live app: https://minesweeper-final-project-wpi.glitch.me/

### Instructions
When entering the website you are prompted to login, if you don't yet have an account 
enter a unique username and a password and click the login button twice, this will create 
your new profile.

### Technologies
- Express Node.js server framework
- Mongodb database, non relational db to store user and game data.
- Bootstrap CSS framework and design 
- Bycrpt for password hashing increased security
- Date-fns for date formatting 
- Express-session for keeping user data across view
- Socket IO for live chat communication


### Challenges
+ The biggest challenge we faced, was setting up the session to pass around the logged in user information, this is necesary for storing user specific data about the games. 
+ We first started by working on a localhost web app, and the trasntion between localhost and glitch gave us a lot of trouble specifically with socket io and the live chat. 

### Responsibilities
Luckyly we were all together and thus we managed to meet regularly and work together in all the components. However, each member was the owner of the following features:
+ Joseph Cybul: 
    Soceketio/Live Chat 
    Express sessions 
    Application design and flow
+ Isabel Morales: 
    Git flow (merge)
    Login and authentication
    Database management 
    Application design and flow
+ Orlando Pinel:
    Game drawing and implementation
    Client side data manipulation 
    Application design and flow

### Video

### Acknowledgements
+ The algorithm to generate the grid with mines and the gameflow was based off an online project from: https://www.youtube.com/watch?v=tSAaVG7a16E&feature=youtu.be
