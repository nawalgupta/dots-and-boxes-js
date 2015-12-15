/*
	GLOBAL VARIABLES
*/

CANVAS_ID = "gameCanvas";
CANVAS = null;
CONTEXT = null;


/*
	SETUP FUNCTIONS
*/

function initializeGame() {
	setupCanvas(600, 600);
};

function setupCanvas(width, height) {
	$("#" + CANVAS_ID).attr("width", width);
	$("#" + CANVAS_ID).attr("height", height);

	CANVAS = document.getElementById(CANVAS_ID);
	CONTEXT = CANVAS.getContext("2d");

	drawGrid(50);
}


/*
	DRAWING FUNCTIONS
*/

function drawGrid(distanceBtwPts) {
	var width = CONTEXT.canvas.width;
	var height = CONTEXT.canvas.height;

	var x = 0;
	var y = 0;

	for (var x = 1; x < width - distanceBtwPts; x++) {
		
		for (var y = 1; y < height - distanceBtwPts; y++) {
			
			if (x % distanceBtwPts == 0 && y % distanceBtwPts == 0) {
				CONTEXT.beginPath();
				CONTEXT.arc(x, y, 1, 0, 2 * Math.PI, true);
				CONTEXT.fill();
			};

		};

	};
};


/*
	DRIVER CODE
*/

initializeGame();