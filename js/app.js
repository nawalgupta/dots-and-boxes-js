/*
	GLOBAL VARIABLES
*/

CANVAS_ID = "gameCanvas";
CANVAS = null;
CONTEXT = null;
CANVAS_OFFSET = 1;

GRID_POINTS = []
GRID_LINES = [];
DISTANCE_BTW_PTS = 50;


/*
	OBJECTS
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

	this.pointAbove = function() {
		var point = new Point(this.X, this.Y + DISTANCE_BTW_PTS);

		if (point.onGrid()) {
			return point;
		} else {
			return null;
		}
	};

	this.pointBelow = function() {
		var point = new Point(this.X, this.Y - DISTANCE_BTW_PTS);

		if (point.onGrid()) {
			return point;
		} else {
			return null;
		}
	};

	this.pointLeft = function() {
		var point = new Point(this.X - DISTANCE_BTW_PTS, this.Y);

		if (point.onGrid()) {
			return point;
		} else {
			return null;
		}
	};

	this.pointRight = function() {
		var point = new Point(this.X + DISTANCE_BTW_PTS, this.Y);

		if (point.onGrid()) {
			return point;
		} else {
			return null;
		}
	};

	this.equalTo = function(point) {
		if (this.X == point.X && this.Y == point.Y) {
			return true;
		};

		return false;
	};

	this.draw = function() {
		CONTEXT.beginPath();
		CONTEXT.arc(this.X, this.Y, 2, 0, 2 * Math.PI, true);
		CONTEXT.fill();
	};
};

function Line(point1, point2) {
	this.Point1 = point1;
	this.Point2 = point2;
	this.Active = false;
	this.Highlighted = false;

	this.equalTo = function(line) {
		if ( (this.Point1.equalTo(line.Point1) && this.Point2.equalTo(line.Point2)) ||
				 (this.Point1.equalTo(line.Point2) && this.Point2.equalTo(line.Point1)) ) {
			return true;
		};

		return false;
	};

	this.activate = function() {
		this.Active = true;
	};

	this.highlightOn = function() {
		this.Highlighted = true;
	};

	this.highlightOff = function() {
		this.Highlighted = false;
	};

	this.draw = function() {
		if (this.Active) {
			CONTEXT.beginPath();
			CONTEXT.moveTo(this.Point1.X, this.Point1.Y);
			CONTEXT.lineTo(this.Point2.X, this.Point2.Y);
			CONTEXT.strokeStyle = "#000000";
			CONTEXT.stroke();
		};

		if (this.Highlighted) {
			CONTEXT.beginPath();
			CONTEXT.moveTo(this.Point1.X, this.Point1.Y);
			CONTEXT.lineTo(this.Point2.X, this.Point2.Y);
			CONTEXT.strokeStyle = "#00BFFF";
			CONTEXT.stroke();
		};
	};
};


/*
	SETUP
*/

function initializeGame() {
	setupCanvas(600, 600);
	generateGridPoints();
	generateGridLines();
	initializePointer();
	drawGrid();
};

function setupCanvas(width, height) {
	$("#" + CANVAS_ID).attr("width", width);
	$("#" + CANVAS_ID).attr("height", height);

	CANVAS = document.getElementById(CANVAS_ID);
	CONTEXT = CANVAS.getContext("2d");
}

function generateGridPoints() {
	var width = CONTEXT.canvas.width;
	var height = CONTEXT.canvas.height;

	// We want a 1 pixel offset at the start to avoid half-drawn circles
	// at the edge of the canvas.  The 1 pixel offset at the end is
	// to keep the board symetric in the canvas.
	for (var x = CANVAS_OFFSET; x < width - CANVAS_OFFSET; x++) {
		for (var y = CANVAS_OFFSET; y < height - CANVAS_OFFSET; y++) {
			if (x % DISTANCE_BTW_PTS == 0 && y % DISTANCE_BTW_PTS == 0) {
				GRID_POINTS.push(new Point(x, y));
			};
		};
	};
};

function generateGridLines() {
	for (var i = 0; i < GRID_POINTS.length; i++) {
		var gridPoint = GRID_POINTS[i];

		var pointAbove = gridPoint.pointAbove();
		var pointBelow = gridPoint.pointBelow();
		var pointLeft = gridPoint.pointLeft();
		var pointRight = gridPoint.pointRight();

		if (pointAbove != null) {
			var line = new Line(gridPoint, pointAbove);

			if (!doesLineExist(line)) {
				GRID_LINES.push(line);
			};
		};

		if (pointBelow != null) {
			var line = new Line(gridPoint, pointBelow);

			if (!doesLineExist(line)) {
				GRID_LINES.push(line);
			};
		};

		if (pointLeft != null) {
			var line = new Line(gridPoint, pointLeft);

			if (!doesLineExist(line)) {
				GRID_LINES.push(line);
			};
		};

		if (pointRight != null) {
			var line = new Line(gridPoint, pointRight);

			if (!doesLineExist(line)) {
				GRID_LINES.push(line);
			};
		};
	};
};

function initializePointer() {
	$("#" + CANVAS_ID).mousemove(function(event) {
		parsePointer(event);
	});
};


/*
	HELPERS
*/

function doesLineExist(line) {
	for (var i = 0; i < GRID_LINES.length; i++) {
		var gridLine = GRID_LINES[i];

		if (line.equalTo(gridLine)) {
			return true;
		};
	};

	return false;
};

// gets the line from the GRID_LINES array
function getLine(line) {
	for (var i = 0; i < GRID_LINES.length; i++) {
		var gridLine = GRID_LINES[i];

		if (line.equalTo(gridLine)) {
			return gridLine;
		};
	};

	return null;
};


/*
	DRAWING
*/

function clearCanvas() {
	CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
};

function drawGrid() {
	clearCanvas();

	// draw grid points
	for (var i = 0; i < GRID_POINTS.length; i++) {
		GRID_POINTS[i].draw();
	};

	// draw active lines
	for (var i = 0; i < GRID_LINES.length; i++) {
		GRID_LINES[i].draw();
	};
};

function highlightLine(point) {
	var linePoint1, linePoint2;

	// point is on a vertical line
	if (point.X % DISTANCE_BTW_PTS == 0) {
		linePoint1 = new Point(point.X, point.Y - (point.Y % DISTANCE_BTW_PTS));
		linePoint2 = new Point(point.X, linePoint1.Y + DISTANCE_BTW_PTS);
	};

	// point is on a horizontal line
	if (point.Y % DISTANCE_BTW_PTS == 0) {
		linePoint1 = new Point(point.X - (point.X % DISTANCE_BTW_PTS), point.Y);
		linePoint2 = new Point(linePoint1.X + DISTANCE_BTW_PTS, point.Y);
	};

	// check to make sure line is valid and then activate it
	var line = new Line(linePoint1, linePoint2);
	var gridLine = getLine(line);

	if (gridLine != null) {
		gridLine.highlightOn();
		drawGrid();
	};
};


/*
	GAMEPLAY
*/

function parsePointer(event) {
	var point = new Point(event.offsetX, event.offsetY);

	if (isPointOnGridLine(point)) {
		highlightLine(point);
	};
};

function isPointOnGridLine(point) {
	// we do not want points on the grid points
	if (point.X % DISTANCE_BTW_PTS == 0 && point.Y % DISTANCE_BTW_PTS == 0) {
		return false;
	};

	if (point.X % DISTANCE_BTW_PTS == 0 || point.Y % DISTANCE_BTW_PTS == 0) {
		return true;
	};

	return false;
};


/*
	DRIVER CODE
*/

initializeGame();


