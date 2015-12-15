/*
	GLOBAL VARIABLES AND OBJECTS
*/

function Point(x, y) {
	this.X = x;
	this.Y = y;
};

CANVAS_ID = "gameCanvas";
CANVAS = null;
CONTEXT = null;

GRID = []

/*
	SETUP FUNCTIONS
*/

function initializeGame() {
	setupCanvas(600, 600);
	initializePointer();
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

	// We want a 1 pixel offset at the start to avoid half-drawn circles
	// at the edge of the canvas.  The 1 pixel offset at the end is
	// to keep the board symetric in the canvas.
	for (var x = 1; x < width - 1; x++) {
		for (var y = 1; y < height - 1; y++) {
			if (x % distanceBtwPts == 0 && y % distanceBtwPts == 0) {
				// draw circle on grid point
				CONTEXT.beginPath();
				CONTEXT.arc(x, y, 2, 0, 2 * Math.PI, true);
				CONTEXT.fill();

				//store grid point
				var point = new Point(x, y);
				GRID.push(point);
			};
		};
	};
};


/*
	GAMEPLAY FUNCTIONS
*/

function initializePointer() {
	$("#" + CANVAS_ID).mousemove(function(event) {
		parsePointer(event);
	});
}

function parsePointer(event) {
	var point = new Point(event.offsetX, event.offsetY);
}


/*
	DRIVER CODE
*/

initializeGame();


