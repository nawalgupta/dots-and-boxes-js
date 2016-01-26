/*
	GLOBAL VARIABLES
*/

CANVAS_ID = "gameCanvas";
CANVAS = null;
CONTEXT = null;
CANVAS_OFFSET = 1;

DISTANCE_BTW_PTS = 50;
GRID_LINE_BUFFER = 2;
GRID_BOX_OFFSET = 5;

GRID_POINTS = [];
GRID_LINES = [];
GRID_BOXES = [];

SIZE_SELECTION_BUTTON_IDS = ["button-size-4", "button-size-6", "button-size-10"];

PLAYERS = [];


/*
	OBJECTS
*/

function Player(id) {
	this.Id = id;
	this.Boxes = [];
	
	this.closedBox = function(box) {
		this.Boxes.push(box);
	};
};

function Point(x, y) {
	this.X = x;
	this.Y = y;

	this.onGrid = function() {
		for (var i = 0; i < GRID_POINTS.length; i++) {
			var gridPoint = GRID_POINTS[i];

			if (gridPoint.X == this.X && gridPoint.Y == this.Y) {
				return true;
			};
		};

		return false;
	};

	// NOTE: Remeber that on a canvas, the origin is the top-left!!!

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
		CONTEXT.fillStyle = "#000000";
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
		this.Highlighted = false;
	};

	this.highlightOn = function() {
		if (!this.Active) {
			this.Highlighted = true;
		};
	};

	this.highlightOff = function() {
		this.Highlighted = false;
	};

	this.draw = function() {
		if (this.Active) {
			CONTEXT.beginPath();
			CONTEXT.moveTo(this.Point1.X, this.Point1.Y);
			CONTEXT.lineTo(this.Point2.X, this.Point2.Y);
			CONTEXT.lineWidth = 3;
			CONTEXT.strokeStyle = "#000000";
			CONTEXT.stroke();
		} else if (this.Highlighted) {
			CONTEXT.beginPath();
			CONTEXT.moveTo(this.Point1.X, this.Point1.Y);
			CONTEXT.lineTo(this.Point2.X, this.Point2.Y);
			CONTEXT.lineWidth = 3;
			CONTEXT.strokeStyle = "#00BFFF";
			CONTEXT.stroke();
		};
	};
};

function Box(pointTopLeft, pointTopRight, pointBottomLeft, pointBottomRight) {
	this.PointTopLeft = pointTopLeft;
	this.PointTopRight = pointTopRight;
	this.PointBottomLeft = pointBottomLeft;
	this.PointBottomRight = pointBottomRight;
	this.Active = false;

	this.equalTo = function(box) {
		if (this.PointTopLeft.equalTo(box.PointTopLeft) &&
				this.PointTopRight.equalTo(box.PointTopRight) &&
				this.PointBottomLeft.equalTo(box.PointBottomLeft) &&
				this.PointBottomRight.equalTo(box.PointBottomRight)) {

			return true;
		}

		return false;
	};

	this.activate = function() {
		this.Active = true;
	};

	this.draw = function() {
		if (this.Active) {
			var buffer = GRID_BOX_OFFSET;
			var x = this.PointTopLeft.X + buffer;
			var y = this.PointTopLeft.Y + buffer;
			var width = this.PointTopRight.X - this.PointTopLeft.X - buffer*2;
			var height = this.PointBottomLeft.Y - this.PointTopLeft.Y - buffer*2;

			CONTEXT.fillStyle = "#F0F0F0";
			CONTEXT.fillRect(x, y, width, height);
		}
	};
};


/*
	SETUP
*/

function initializeGame(boardSize) {
	var boardWidth = calculateBoardSize(boardSize);

	setupCanvas(boardWidth, boardWidth);
	initializeGlobalVariables();
	generateGridPoints();
	generateGridLines();
	generateGridBoxes();
	generatePlayers(2);
	initializePointer();
	drawGrid();
};

function calculateBoardSize(boardSize) {
	return boardSize * DISTANCE_BTW_PTS + 2;
};

function initializeGlobalVariables() {
	GRID_POINTS = [];
	GRID_LINES = [];
	GRID_BOXES = [];
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

function generateGridBoxes() {
	for (var i = 0; i < GRID_POINTS.length; i++) {
		var pointTopLeft = GRID_POINTS[i];
		var box = getBoxByTopLeftPoint(pointTopLeft);

		if (box != null) {
			if (!doesBoxExist(box)) {
				GRID_BOXES.push(box);
			}
		};
	};
};

function initializePointer() {
	$("#" + CANVAS_ID).mousemove(function(event) {
		parsePointerMove(event);
	});

	$("#" + CANVAS_ID).click(function(event) {
		parsePointerClick(event);
	});
};

// this function is controlled by the buttons in the HTML
function selectBoardSize(size) {
	resetBoardSizeButtons();
	initializeGame(size);
};

function resetBoardSizeButtons() {
	for (var i = 0; i < SIZE_SELECTION_BUTTON_IDS.length; i++) {
		$("#" + SIZE_SELECTION_BUTTON_IDS[i]).removeClass("active");
	};
};

function generatePlayers(numberPlayers) {
	for (var i = 1; i <= numberPlayers; i++) {
		PLAYERS.push(new Player(i));
	};
};


/*
	HELPERS
*/

// checks to see if line exists in the grid
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
function getGridLine(line) {
	for (var i = 0; i < GRID_LINES.length; i++) {
		var gridLine = GRID_LINES[i];

		if (line.equalTo(gridLine)) {
			return gridLine;
		};
	};

	return null;
};

// finds the nearest line for a given point if the point is close enough to one
function getNearbyLine(point) {
	var buffer = GRID_LINE_BUFFER;
	var linePoint1;
	var linePoint2;
	var line;

	var distanceToGridLineX = point.X % DISTANCE_BTW_PTS;
	var distanceToGridLineY = point.Y % DISTANCE_BTW_PTS;

	// we do not want a grid point
	if (distanceToGridLineX <= buffer && distanceToGridLineY <= buffer) {
		return null;
	};

	// directly on a vertical line
	if (distanceToGridLineX == 0) {
		linePoint1 = new Point(point.X, point.Y - distanceToGridLineY);
		linePoint2 = new Point(point.X, linePoint1.Y + DISTANCE_BTW_PTS);
		line = new Line(linePoint1, linePoint2);
	};

	// slightly right of vertical line
	if (distanceToGridLineX <= buffer) {
		linePoint1 = new Point(point.X - distanceToGridLineX, point.Y - distanceToGridLineY);
		linePoint2 = new Point(point.X - distanceToGridLineX, linePoint1.Y + DISTANCE_BTW_PTS);
		line = new Line(linePoint1, linePoint2);
	};

	// slightly left of vertical line
	if (DISTANCE_BTW_PTS - distanceToGridLineX <= buffer) {
		linePoint1 = new Point(point.X + (DISTANCE_BTW_PTS - distanceToGridLineX), point.Y - distanceToGridLineY);
		linePoint2 = new Point(point.X + (DISTANCE_BTW_PTS - distanceToGridLineX), linePoint1.Y + DISTANCE_BTW_PTS);
		line = new Line(linePoint1, linePoint2);
	};

	// directly on a horizontal line
	if (distanceToGridLineY == 0) {
		linePoint1 = new Point(point.X - distanceToGridLineX, point.Y);
		linePoint2 = new Point(linePoint1.X + DISTANCE_BTW_PTS, point.Y);
		line = new Line(linePoint1, linePoint2);
	};

	// slightly above a horizontal line
	if (distanceToGridLineY <= buffer) {
		linePoint1 = new Point(point.X - distanceToGridLineX, point.Y - distanceToGridLineY);
		linePoint2 = new Point(linePoint1.X + DISTANCE_BTW_PTS, point.Y - distanceToGridLineY);
		line = new Line(linePoint1, linePoint2);
	};

	// slightly below a horizontal line
	if (DISTANCE_BTW_PTS - distanceToGridLineY <= buffer) {
		linePoint1 = new Point(point.X - distanceToGridLineX, point.Y + (DISTANCE_BTW_PTS - distanceToGridLineY));
		linePoint2 = new Point(linePoint1.X + DISTANCE_BTW_PTS, point.Y + (DISTANCE_BTW_PTS - distanceToGridLineY));
		line = new Line(linePoint1, linePoint2);
	};

	var gridLine;

	if (line != null) {
		gridLine = getGridLine(line);
	}

	return gridLine;
};

// checks to see if box exists in the grid
function doesBoxExist(box) {
	if (box == null) {
		return null;
	}

	for (var i = 0; i < GRID_BOXES.length; i++) {
		var gridBox = GRID_BOXES[i];

		if (box.equalTo(gridBox)) {
			return true;
		};
	};

	return false;
};

function getGridBox(box) {
	for (var i = 0; i < GRID_BOXES.length; i++) {
		var gridBox = GRID_BOXES[i];

		if (box.equalTo(gridBox)) {
			return gridBox;
		}
	};

	return null;
};

function getBoxByTopLeftPoint(pointTopLeft) {
	var box = null;

	if (pointTopLeft == null) {
		return null;
	};

	var pointTopRight = pointTopLeft.pointRight();
	var pointBottomLeft = pointTopLeft.pointAbove();

	// need to check for null values
	if (pointTopRight != null) {
		var pointBottomRight = pointTopRight.pointAbove();

		if (pointBottomLeft != null && pointBottomRight != null) {
			box = new Box(pointTopLeft, pointTopRight, pointBottomLeft, pointBottomRight);
		};
	};

	return box;
};

function getBoxesByLine(line) {
	var boxes = [];

	// a line can be part of up to two boxes
	var pointTopLeft1;
	var pointTopLeft2;

	// line is horizontal
	if (line.Point1.Y == line.Point2.Y) {
		if (line.Point1.X < line.Point2.X) {
			pointTopLeft1 = line.Point1.pointBelow();
			pointTopLeft2 = line.Point1;
		} else {
			pointTopLeft1 = line.Point2.pointBelow();
			pointTopLeft2 = line.Point2;
		};
	};

	// line is vertical
	if (line.Point1.X == line.Point2.X) {
		if (line.Point1.Y < line.Point2.Y) {
			pointTopLeft1 = line.Point1.pointLeft();
			pointTopLeft2 = line.Point1;
		} else {
			pointTopLeft1 = line.Point2.pointLeft();
			pointTopLeft2 = line.Point2;
		};
	};

	var box1 = getBoxByTopLeftPoint(pointTopLeft1);
	var box2 = getBoxByTopLeftPoint(pointTopLeft2);

	if (doesBoxExist(box1)) {
		boxes.push(box1);
	};

	if (doesBoxExist(box2)) {
		boxes.push(box2);
	};

	return boxes;
};

function isBoxComplete(box) {
	var topLine = new Line(box.PointTopLeft, box.PointTopRight);
	var bottomLine = new Line(box.PointBottomLeft, box.PointBottomRight);
	var leftLine = new Line(box.PointTopLeft, box.PointBottomLeft);
	var rightLine = new Line(box.PointTopRight, box.PointBottomRight);

	if (getGridLine(topLine).Active &&
			getGridLine(bottomLine).Active &&
			getGridLine(leftLine).Active &&
			getGridLine(rightLine).Active) {

		return true;
	};

	return false;
};

// check to see if an activated line has closed a box
function updateBoxStatus(line) {
	var boxes = getBoxesByLine(line);
	
	for (var i = 0; i < boxes.length; i++) {
		var box = boxes[i];

		if (isBoxComplete(box)) {
			var completeBox = getGridBox(box);
			completeBox.activate();
		};
	};
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

	// draw active boxes
	for (var i = 0; i < GRID_BOXES.length; i++) {
		GRID_BOXES[i].draw();
	};
};

function resetHighlights() {
	for (var i = 0; i < GRID_LINES.length; i++) {
		GRID_LINES[i].highlightOff();
	};
};


/*
	GAMEPLAY
*/

function parsePointerMove(event) {
	var point = new Point(event.offsetX, event.offsetY);
	var nearbyLine = getNearbyLine(point);

	if (nearbyLine != null) {
		resetHighlights();
		nearbyLine.highlightOn();
		drawGrid();
	} else {
		resetHighlights();
		drawGrid();
	};
};

function parsePointerClick(event) {
	var point = new Point(event.offsetX, event.offsetY);
	var nearbyLine = getNearbyLine(point);

	if (nearbyLine != null) {
		nearbyLine.activate();
		updateBoxStatus(nearbyLine);
		drawGrid();
	};
};


/*
	DRIVER CODE
*/

initializeGame(10);


