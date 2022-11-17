function initialize()
{
    // front end
    headerOutput = document.getElementById("header");
    puzzleOutput = document.getElementById("puzzle");
    numMovesOutput = document.getElementById("numMoves");
   
    // back end
    header = "Welcome to Slider Puzzle (HuaRong Path)";
    puzzle = [
                ["1", "2", "3", "4"],
                ["5", "6", "7", "8"],
                ["9", "10", "11", "12"],
                ["13", "14", "15", " "]
            ];
    numMoves = 0;
 
    isGameStarted = false;
    isGameWon = true;
 
    // front end
    createPuzzle();
    display();
}
 
// front end
function display()
{
    headerOutput.innerHTML = header;
    updatePuzzle();
    numMovesOutput.innerHTML = numMoves;
}
 
// front end
function createPuzzle()
{
    let counter = 1;
    for (let r = 0; r < puzzle.length; r++)
    {
        let row = puzzleOutput.insertRow();
        for (let c = 0; c < puzzle[r].length; c++)
        {
            let block = row.insertCell();
            block.innerHTML = puzzle[r][c];
            block.onclick = function() { moveBlock(block) };
            block.id = "block" + counter;
            counter++;
        }
    }
}
 
// front end, helper method for display()
// updates the puzzle seen by the user, include numbers and colors
function updatePuzzle()
{
    // update the number displayed in the puzzle && turn all block into the deep color (before changing the NEW empty block to subtle color)
    let counter = 1; // equivalent of the id of the block that is being looked at in the current iteration
    let emptyBlockId = -1; // get the empty block's id while looping through the array
    for (let r = 0; r < puzzle.length; r++)
    {
        for (let c = 0; c < puzzle[r].length; c++)
        {
            if (puzzle[r][c] === " ")
            {
                emptyBlockId = counter;
            }
            let block = document.getElementById("block" + counter);
            block.innerHTML = puzzle[r][c];
            block.style.backgroundColor = "#c4915f"; // deep color
            counter++;
        }
    }
 
    // make the empty block stand out by making the NEW empty block subtle in terms of color
    let emptyBlock = document.getElementById(`block${emptyBlockId}`);
    emptyBlock.style.backgroundColor = "#c4a689"; // subtle color
}
 
 
/* ALL methods after this line should be back end */
 
// all associated with when something is clicked
 
// back end
function start() // for start button
{
    if (isGameWon)
    {
        header = "<span class='green-text'>The puzzle is solved already, you should start the game only when the puzzle is not in the solved state.</span>"
    }
    else
    {
        isGameStarted = true;
        numMoves = 0;
        header = "<span class='green-text'>You just started the game; the game would count all your moves until you click \"Reset\" to pause and reset the game.</span>";
    }
    display();
}
 
// back end
function reset() // for reset button
{
    isGameStarted = false;
    header = "<span class='green-text'>You just paused the game; the game would not count your moves until you click \"Start\" again (which would reset the number of moves you made in the previous game).</span>";
    display();
}
 
// back end
function moveBlock(clickedBlock)
{
    let canMoveUp = true, canMoveDown = true, canMoveLeft = true, canMoveRight = true;
    let clickedRowNum = -1, clickedColNum = -1;
    // find what is being clicked in the back end puzzle array
    for (let r = 0; r < puzzle.length && clickedRowNum === -1; r++)
    {
        for (let c = 0; c < puzzle[r].length && clickedColNum === -1; c++)
        {
            if (clickedBlock.innerHTML === puzzle[r][c])
            {
                clickedRowNum = r;
                clickedColNum = c;
            }
        }
    }
    // determine where it can move, and move it if it can be moved
    (clickedRowNum - 1 >= 0 && puzzle[clickedRowNum - 1][clickedColNum] === " ") ? (swapTwoBlocks(clickedRowNum, clickedColNum, clickedRowNum - 1, clickedColNum)) : (canMoveUp = false);
    (clickedRowNum + 1 != puzzle.length && puzzle[clickedRowNum + 1][clickedColNum] === " ") ? (swapTwoBlocks(clickedRowNum, clickedColNum, clickedRowNum + 1, clickedColNum)) : (canMoveDown = false);
    (clickedColNum - 1 >= 0 && puzzle[clickedRowNum][clickedColNum - 1] === " ") ? (swapTwoBlocks(clickedRowNum, clickedColNum, clickedRowNum, clickedColNum - 1)) : (canMoveLeft = false);
    (clickedColNum + 1 != puzzle[0].length && puzzle[clickedRowNum][clickedColNum + 1] === " ") ? (swapTwoBlocks(clickedRowNum, clickedColNum, clickedRowNum, clickedColNum + 1)) : (canMoveRight = false);
    if (isGameStarted) // if game is not started (i.e. still during the manually-shuffling stage), the messages would not be displayed
    {
        if (!(canMoveUp || canMoveDown || canMoveLeft || canMoveRight)) // if cannot be moved at all
        {
            header = "That block cannot be moved ";
            if (clickedBlock.innerHTML === " ")
                header += "since it is empty. So stop ordering fried rice OnO";
            else
                header += "unless you manually take it out, and certainly you don't want to do that... Right?";
        }
        else // if can be moved and is moved
        {
            numMoves++;
            header = "Do you wish to pick up blocks and move them manually? Not an option 0w0";
        }
    }
 
    checkForVictory();
    display();
}
 
// arrow function attempt
// swap two items provided through arguments (associated with row and col)
// back end, helper of moveBlock and shuffle
let swapTwoBlocks = (formerRow, formerCol, latterRow, latterCol) =>
{
    let temp = puzzle[formerRow][formerCol];
    puzzle[formerRow][formerCol] = puzzle[latterRow][latterCol];
    puzzle[latterRow][latterCol] = temp;
 
    display();
}
 
// back end
function shuffle()
{
    if (isGameWon === true)
    {
        // empty block is always the last item in the 2D array when the puzzle is solved
        let emptySpotRow = puzzle.length - 1;
        let emptySpotCol = puzzle[0].length - 1;
 
        let numSpotsAdjacent = 0;
        let canMoveLeft = true, canMoveRight = true, canMoveDown = true, canMoveUp = true;
        // ternary operator attempts
        // figure out the number of adjacent blocks that the empty block can swap position with
        // and track if the empty block can or cannot swap in certain directions due to reaching the boundary
        emptySpotRow - 1 >= 0 ? numSpotsAdjacent++ : canMoveUp = false;
        emptySpotRow + 1 != puzzle.length ? numSpotsAdjacent++ : canMoveDown = false;
        emptySpotCol - 1 >= 0 ? numSpotsAdjacent++ : canMoveLeft = false;
        emptySpotCol + 1 != puzzle[0].length ? numSpotsAdjacent++ : canMoveRight = false;
 
        // range = the possibility in which a move can be made
        // a decimal value ranging between ~0.5 (2 available spots) and ~0.25 (4 available spots)
        let range = 1 / numSpotsAdjacent;
        let numSwaps = 0;
        while (numSwaps < 1000)
        {
            if (Math.random() < range && canMoveUp === true)
            {
                swapTwoBlocks(emptySpotRow, emptySpotCol, emptySpotRow - 1, emptySpotCol);
                emptySpotRow--;
                numSwaps++;
            }
            else if (Math.random() < range && canMoveDown === true)
            {
                swapTwoBlocks(emptySpotRow, emptySpotCol, emptySpotRow + 1, emptySpotCol);
                emptySpotRow++;
                numSwaps++;
            }
            else if (Math.random() < range && canMoveRight === true)
            {
                swapTwoBlocks(emptySpotRow, emptySpotCol, emptySpotRow, emptySpotCol + 1);
                emptySpotCol++;
                numSwaps++;
            }
            else if (Math.random() < range && canMoveLeft === true)
            {
                swapTwoBlocks(emptySpotRow, emptySpotCol, emptySpotRow, emptySpotCol - 1);
                emptySpotCol--;
                numSwaps++;
            }
            // update availablity of moves
            emptySpotRow - 1 >= 0 ? canMoveUp = true : canMoveUp = false;
            emptySpotRow + 1 != puzzle.length ? canMoveDown = true : canMoveDown = false;
            emptySpotCol - 1 >= 0 ? canMoveLeft = true : canMoveLeft = false;
            emptySpotCol + 1 != puzzle[0].length ? canMoveRight = true : canMoveRight = false;
        }
        header = "The puzzle is successfully shuffled.";
    }
    else
    {
        header = "Shuffle is only available when the puzzle is in the completely-solved state."
    }
 
    checkForVictory();
    display();
}
 
// back end
// winning status should be check when blocks are moved (moveBlock and shuffle functions)
function checkForVictory()
{
    let counter = 1;
    isGameWon = true; // subject to change
    for (let r = 0; r < puzzle.length && isGameWon; r++)
    {
        for (let c = 0; c < puzzle[r].length && isGameWon; c++)
        {
            if (counter != puzzle.length * puzzle[r].length) // enables flexibility when more blocks are added to the puzzle; 4 * 4 = 16, and the 16th block would be empty
            {
                if (puzzle[r][c] === "" + counter)
                {
                    counter++;
                }
                else
                {
                    isGameWon = false;
                }
            }
        }
    }
 
    if (isGameStarted && isGameWon)
    {
        header = "<span class='red-text'>You solved the puzzle.</span>";
        isGameStarted = false;
    }
 
    display();
}
