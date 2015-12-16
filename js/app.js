/*
	GLOBAL VARIABLES AND OBJECTS
*/

function Point(x, y) {
	this.X = x;
	this.Y = y;

	this.onGrid = function() {
		for (var i = 0; i < GRID_POINTS.length; i++) {
			var gridPoint = GRID_POINTS[i];

			if (gridPoint.X === this.X && gridPoint.Y === this.Y) {
				return true;
			};
		};

		return false;
	};
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

function drawLine(point) {
	var linePoint1, linePoint2;

	// point is on a vertical line
	if (point.X % GRID_MULTIPLIER == 0) {
		linePoint1 = new Point(point.X, point.Y - (point.Y % GRID_MULTIPLIER));
		linePoint2 = new Point(point.X, linePoint1.Y + GRID_MULTIPLIER);
	};

	// point is on a horizontal line
	if (point.Y % GRID_MULTIPLIER == 0) {
		linePoint1 = new Point(point.X - (point.X % GRID_MULTIPLIER), point.Y);
		linePoint2 = new Point(linePoint1.X + GRID_MULTIPLIER, point.Y);
	};

	// check to make sure points exist on the grid and then draw the line
	if (linePoint1.onGrid() && linePoint2.onGrid()) {
		CONTEXT.beginPath();
		CONTEXT.moveTo(linePoint1.X, linePoint1.Y);
		CONTEXT.lineTo(linePoint2.X, linePoint2.Y);
		CONTEXT.stroke();
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
		drawLine(point);
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


