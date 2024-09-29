// Variables - storage of values
let board;
let score = 0;
let rows = 4;
let columns = 4;


// This variables will be used to monitor if the user already won once in the value of 2048, 4096, or 8192
// If one of these variables value became true, it means the player already won once in specific values

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// function to set the gameboard to have tiles
function setGame(){

	// board = [
 //        [32, 8, 4, 0],
 //        [4, 128, 64, 256],
 //        [8, 32, 16, 2],
 //        [16, 2, 256, 1024]
 //    ];

	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]; 
	// this board will be used as the backend board to design and modify the tiles of the frontend board

	// loop
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			// loop - To create a div element
			let tile = document.createElement("div");

			// Assign an ID based on the position of the tile
			tile.id = r.toString() + "-" + c.toString();

			// Retrieves the number of the tile from the backend board
			// board [0][1] = 0
			let num = board[r][c];


			updateTile(tile, num);

			document.getElementById("board").append(tile);
		}
	}

	setTwo();
	setTwo();
}


// This function is to update the color of the tile based on its num value
function updateTile(tile, num){

	tile.innerText = "";
	tile.classList.value = "";

	// <div class="tile"></div>
	tile.classList.add("tile");

	if(num > 0){

		// <div class="tile">2</div>
		tile.innerText = num.toString();

		// 2 < 8192
		if(num > 8192){
			tile.classList.add("x" + num.toString());
		}
		else{
			tile.classList.add("x8192");
		}
	}
}

window.onload = function(){
	setGame(); // we call the setGame function
}

// e = means "event"
function handleSlide(e){

	console.log(e.code);
	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){

		if(e.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		}

		else if(e.code == "ArrowRight"){
			slideRight();
			setTwo();
		}

		else if(e.code == "ArrowUp"){
			slideUp();
			setTwo();
		}

		else if(e.code == "ArrowDown"){
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;

	setTimeout(()=>{
		checkWin();
	}, 100)

	if(hasLost() == true){

		setTimeout(() => {

			alert("Game Over. You have lost the game. Game will restart");
			restartGame();
			alert("CLick any arrow key to restart")
		}, 100);
	}
}

document.addEventListener("keydown", handleSlide);


// to filter out the zero (0) number
function filterZero(row){
	return row.filter(num => num != 0);
}

function slide(tiles){
	tiles = filterZero(tiles);

	for (let i=0; i < tiles.length-1; i++){
		if(tiles[i] == tiles[i+1]){ // true
			tiles[i] = tiles[i] * 2; // 2 -> 4 
			tiles[i+1] = 0; 
			score += tiles[i];
		}
	}

	tiles = filterZero(tiles);

	while(tiles.length < columns){
		tiles.push(0);
	}
	return tiles;
}

// slideLeft function will use slide function to merge matching adjacent tiles
function slideLeft(){

	for(let r=0; r<rows; r++){

		let row = board[r];
		row = slide(row);
		board[r] = row;

		for(let c=0; c<columns; c++){

			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile,num);
		}
	}
}

// For merging, slide left and right will be mainly through row values
function slideRight(){

	for(let r=0; r<rows; r++){
 
		// All tiles values per row are saved in a container row
		let row = board[r];
		row.reverse(); // this function is originally built for slideLeft, but using row.reverse()- it will reverse and slide to right

		row = slide(row); // use slide function to merge the same values

		row.reverse();

		board[r] = row; //update the row with the merged tile/s

		// Because of this loop, we are able to update the ID and color of all the tiles, from the first column of a row to its last column, and because of the upper loop, not just single row will be updated, but all the rows.

		for(let c=0; c<columns; c++){
			// Accesses the tile using it's ID
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile,num);
		}
	}
}

function slideUp(){

	for(let c=0; c<columns; c++){

		let col = [board[0][c], board[1][c], board[2][c], board[3][c]]; 
		col = slide(col); // use slide function to MERGE the same values
		
		for(let r=0; r<rows; r++){

			board[r][c] = col[r];

			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile,num);
		}
	}
}

function slideDown(){

	for(let c=0; c<columns; c++){

		let col = [board[0][c], board[1][c], board[2][c], board[3][c]]; 

		col.reverse();
		col = slide(col); // use slide function to MERGE the same values
		col.reverse();

		for(let r=0; r<rows; r++){

			board[r][c] = col[r];

			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile,num);
		}
	}
}

// to CHECK if there is an empty tile/s
function hasEmptyTile(){

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			if (board[r][c] == 0) {
				return true;
			}
		}
	}
	return false;
}

// for setting the random 2s to the empty tiles/ until tiles are empty
function setTwo(){
	if(hasEmptyTile() == false){
		return;
	}

	let found = false;

	while(found == false){

		// random r, random c
		// These will generate a random value based on the rows value (0-3)

		// [for RANDOM position value for r (row)]
		let r = Math.floor(Math.random() * rows);

		// [for RANDOM position value for c (column)]
		let c = Math.floor(Math.random() * columns);

		// if (board[randomr] [random c] ==0 )
		if (board[r][c] == 0){
			
			// If the tile is an empty tile, we convert the empty tile to 2 (0 -> 2)
			board[r][c] = 2;

			let tile = document.getElementById(r.toString() + "-" + c.toString());

			// <div class= "x2">2</div>
			tile.innerText = "2";
			tile.classList.add("x2");

			found = true;
		}
	}
}

function checkWin(){

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			// Congratulatory to the user if they reach the score "2048, 4096, 8192"
			if (board[r][c] == 2048 && is2048Exist == false){
				alert("You Win! You got the 2048");
				is2048Exist = true;
			}
			else if (board[r][c] == 4096 && is4096Exist == false){
				alert("You are unstoppable at 4096! You are fantastically unstoppable!");
				is4096Exist = true;
			}
			else if (board[r][c] == 8192 && is8192Exist == false){
				alert("Victory! You have reached 8192! You are incredibly awesome!");
				is8192Exist = true;
			}

		}
	}
}


function hasLost(){

	for (let r=0; r<rows; r++){
		for (let c=0; c<columns; c++){

			if (board[r][c] == 0){
				return false;
			}

			const currentTile = board[r][c];

		if(
			r > 0 && board[r-1][c] === currentTile || // to check if the current tile matches to the upper tile
			r < 3 - 1 && board[r+1][c] === currentTile || // to check if the current tile matches to the lower tile
			c > 0 && board[r][c-1] === currentTile || // to check if the current tile matches to the left tile
			c < 3 - 1 && board[r][c+1] === currentTile // to check if the current tile matches to the right tile
		){
			return false;
		}
		// No possible moves - meaning true, the user has lost
		}
	}
	return true;
}

function restartGame(){
	board = [
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0],
		[0,0,0,0]
	]

	setTwo();
}

