let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");

const genCompChoice = () => {
    let options = ["rock", "paper", "scissors"];
    const randomIdx = Math.floor(Math.random() * 3);
    return options[randomIdx];
};

const drawGame = () => {
    console.log("game was draw");
    msg.innerText = "Game was Draw, Please Play Again";
    msg.style.backgroundColor = "#0c1821";
};

const showWinner = (userWin, userChoice, compChoice) => {
    if (userWin) {
        userScore++;
        userScorePara.innerText = userScore;
        msg.innerText = `You Won! ${userChoice} beats ${compChoice} 🎉`;
        msg.style.backgroundColor = "green";
    } else {
        compScore++;
        compScorePara.innerText = compScore;
        msg.innerText = `You lose! ${compChoice} beats ${userChoice} 😟`;
        msg.style.backgroundColor = "red";
    }
    console.log(`User Score: ${userScore}, Computer Score: ${compScore}`);
};

const playGame = (userChoice) => {
    const compChoice = genCompChoice();
    console.log("user-choice =", userChoice);
    console.log("comp-choice =", compChoice);

    if (userChoice === compChoice) {
        drawGame();
    } else {
        let userWin;
        if (userChoice === "rock") {
            userWin = (compChoice === "scissors");
        } else if (userChoice === "paper") {
            userWin = (compChoice === "rock");
        } else if (userChoice === "scissors") {
            userWin = (compChoice === "paper");
        }
        showWinner(userWin, userChoice, compChoice);
    }
};

choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        const userChoice = choice.getAttribute("id");
        playGame(userChoice);
    });
});
