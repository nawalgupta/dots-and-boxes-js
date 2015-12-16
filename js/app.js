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
CANVAS_OFFSET = 1;

GRID_POINTS = []
GRID_MULTIPLIER = 50; // multiplier that determines where grid points lie

/*
	SETUP
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

	drawGrid();
}


/*
	DRAWING
*/

function drawGrid() {
	var width = CONTEXT.canvas.width;
	var height = CONTEXT.canvas.height;

	// We want a 1 pixel offset at the start to avoid half-drawn circles
	// at the edge of the canvas.  The 1 pixel offset at the end is
	// to keep the board symetric in the canvas.
	for (var x = CANVAS_OFFSET; x < width - CANVAS_OFFSET; x++) {
		for (var y = CANVAS_OFFSET; y < height - CANVAS_OFFSET; y++) {
			if (x % GRID_MULTIPLIER == 0 && y % GRID_MULTIPLIER == 0) {
				// draw circle on grid point
				CONTEXT.beginPath();
				CONTEXT.arc(x, y, 2, 0, 2 * Math.PI, true);
				CONTEXT.fill();

				//store grid point
				var point = new Point(x, y);
				GRID_POINTS.push(point);
			};
		};
	};
};


/*
	GAMEPLAY
*/

function initializePointer() {
	$("#" + CANVAS_ID).mousemove(function(event) {
		parsePointer(event);
	});
};

function parsePointer(event) {
	var point = new Point(event.offsetX, event.offsetY);

	if ( isPointOnGridLine(point) ) {
		console.log("true", point.X, point.Y);
	};
};

function isPointOnGridLine(point) {
	// we do not want points on the grid points
	if (point.X % GRID_MULTIPLIER == 0 && point.Y % GRID_MULTIPLIER == 0) {
		return false;
	};

	if (point.X % GRID_MULTIPLIER == 0 || point.Y % GRID_MULTIPLIER == 0) {
		return true;
	};

	return false;
};


/*
	DRIVER CODE
*/

initializeGame();


