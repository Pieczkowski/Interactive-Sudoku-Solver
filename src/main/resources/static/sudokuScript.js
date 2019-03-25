var isBoardSet = false;
var board = document.getElementById("board");
var setupCellsFilled = 0;
var boardDimension = 9;
var dimensionInSquare = 3;

function solve() {
    postBoardToServer("/solve", function (){
        if (this.readyState == 4 && this.status == 200){
            var response = JSON.parse(this.responseText);

            for (var row = 0; row < boardDimension; row++){
                for (var column = 0; column < boardDimension; column++){
                    board.children[row].children[column].value = response.board[row][column].value;
                    board.children[row].children[column].placeholder = [];
                }
            }
        }
    });
}

function finishSetup(element) {
    if (isBoardSet){
        document.getElementById("solveBtn").disabled = true;
        element.firstChild.data = "Finish setup";
        clearNotReadOnlyBoard();
        isBoardSet = false;
        changeCellsToOrFromReadOnly();
    } else {
        postBoardToServer("/check", function (){
            if (this.readyState == 4 && this.status == 200){
                if (JSON.parse(this.responseText)){
                    element.firstChild.data = "Redo Setup";
                    isBoardSet = true;
                    document.getElementById("solveBtn").disabled = false;
                    changeCellsToOrFromReadOnly();
                } else {
                    alert("This sudoku is unsolvable")
                }
            }
        });
    }

    function changeCellsToOrFromReadOnly() {
        iterateOverBoard(function (el) {
            if (Number(el.value)) {
                el.readOnly = isBoardSet;
            }
            changeBackgroundColor(el)
        });


        function changeBackgroundColor(element) {
            if (element.readOnly){
                element.style.backgroundColor = "#66ccff";
            } else{
                element.style.backgroundColor = "White";
            }
        }
    }
}

function clearNotReadOnlyBoard() {
    iterateOverBoard(function (el) {
        if (!el.readOnly && el.value > 0) {
            el.setAttribute("data-last-value", el.value);
            checkInput("", el);
        }
    });
}

function clearBoard(){
    iterateOverBoard(function (el) {
        if (el.value > 0){
            el.setAttribute("data-last-value", el.value);
            el.readOnly = false;
            isBoardSet = false;
            checkInput("", el);
        }
    });
        setupCellsFilled = 0;
}

function iterateOverBoard(call) {
    for (var row = 0; row < boardDimension; row++){
        for (var column = 0; column < boardDimension; column++){
            call(board.children[row].children[column])
        }
    }
}

function getPlaceholders(element) {
    markColumnAndElement(element);
    markRow(element);
    markSquare(element);
    countFilled(element);
}

function markColumnAndElement(element) {
    var columnConst = element.getAttribute("data-column");
    var lastValue = element.getAttribute("data-last-value");
    var arr;
    var cellToMark;
    for (var rowIndex = 0; rowIndex < boardDimension; rowIndex++){
        cellToMark = board.children[rowIndex].children[columnConst];
        arr = cellToMark.placeholder.split(" ");
        if (wasActionDelete(element)){
            if (!(checkIfBlockedByRow(rowIndex, lastValue) || checkIfBlockedBySquare(cellToMark, lastValue))){
                arr.push(lastValue);
                arr.sort(function (a, b) {return a - b});
            }
        } else {
            var index = arr.indexOf(element.value);
            if (index > -1){
                arr.splice(index, 1);
            }
        }
        cellToMark.placeholder = arr.join(" ");
    }
}

function markRow(element) {
    var rowConst = element.getAttribute("data-row");
    var column = element.getAttribute("data-column");
    var lastValue = element.getAttribute("data-last-value");
    var arr;
    var cellToMark;
    for (var columnIndex = 0; columnIndex < boardDimension; columnIndex++){
        if (columnIndex == column) continue;
        cellToMark = board.children[rowConst].children[columnIndex];
        arr = cellToMark.placeholder.split(" ");
        if (wasActionDelete(element)) {
            if (!(checkIfBlockedByColumn(columnIndex, lastValue) || checkIfBlockedBySquare(cellToMark, lastValue))){
                arr.push(lastValue);
                arr.sort(function (a, b) {return a - b});
            }
        } else {
            var index = arr.indexOf(element.value);
            if (index > -1){
                arr.splice(index, 1);
            }
        }
        cellToMark.placeholder = arr.join(" ");
    }
}

function markSquare(element) {
    var column = element.getAttribute("data-column");
    var row = element.getAttribute("data-row");
    var squareColumnStart = Math.floor(column / dimensionInSquare) * dimensionInSquare;
    var squareRowStart = Math.floor(row / dimensionInSquare) * dimensionInSquare;
    var arr;
    var cellToMark;
    var lastValue = element.getAttribute("data-last-value");
    for (var squareRowIndex = squareRowStart; squareRowIndex < (squareRowStart + dimensionInSquare); squareRowIndex++){
        if (row == squareRowIndex) continue;
        for (var squareColumnIndex = squareColumnStart; squareColumnIndex < (squareColumnStart + dimensionInSquare); squareColumnIndex++) {
            if (column == squareColumnIndex) continue;
            cellToMark = board.children[squareRowIndex].children[squareColumnIndex];
            arr = cellToMark.placeholder.split(" ");
            if (wasActionDelete(element)) {
                if (!(checkIfBlockedByRow(squareRowIndex, lastValue) || checkIfBlockedByColumn(squareColumnIndex, lastValue))) {
                    arr.push(lastValue);
                    arr.sort(function (a, b) {return a - b});
                }
            } else {
                var index = arr.indexOf(element.value);
                if (index > -1) {
                    arr.splice(index, 1);
                }
            }
            cellToMark.placeholder = arr.join(" ");
        }
    }
}

function checkIfBlockedByRow(row, lastValue){
    for (var columnIndex = 0; columnIndex < boardDimension; columnIndex++){
        if (board.children[row].children[columnIndex].value == lastValue) {
            return true;
        }
    }
    return false;
}

function checkIfBlockedByColumn(column, lastValue) {
    for (var rowIndex = 0; rowIndex < boardDimension; rowIndex++){
        if (board.children[rowIndex].children[column].value == lastValue) {
            return true;
        }
    }
    return false;
}

function checkIfBlockedBySquare(element, lastValue){
    var column = element.getAttribute("data-column");
    var row = element.getAttribute("data-row");
    var squareColumnStart = Math.floor(column / dimensionInSquare) * dimensionInSquare;
    var squareRowStart = Math.floor(row / dimensionInSquare) * dimensionInSquare;

    for (var squareRowIndex = squareRowStart; squareRowIndex < (squareRowStart + dimensionInSquare); squareRowIndex++){
        for (var squareColumnIndex = squareColumnStart; squareColumnIndex < (squareColumnStart + dimensionInSquare); squareColumnIndex++){
            if (board.children[squareRowIndex].children[squareColumnIndex].value == lastValue){
                return true;
            }
        }
    }
    return false;
}

function countFilled(element) {
    if (!isBoardSet && wasActionDelete(element)){
        setupCellsFilled--;
        console.log(setupCellsFilled);
    } else if (!isBoardSet){
        setupCellsFilled++;
    }
    document.getElementById("setupBtn").disabled = setupCellsFilled < 17;
}

function wasActionDelete(element) {
    return element.getAttribute("data-last-value").length === 1 && element.value.length === 0;
}

function saveValue(element) {
    element.setAttribute("data-last-value", element.value);
}

function postBoardToServer(destination, onReadyStatusFunction){
    function formToJSON(board){
        function rowReducer(data, element){
            var value = isNaN(Number(element.value)) ? 0 : Number(element.value);
            var possibleInserts = element.placeholder.split(" ");
            data.push({"value" : value , "possibleInserts" : possibleInserts});
            return data;
        }
        var array = [];
        for (var i = 0; i < boardDimension; i++) {
            array.push([].reduce.call(board.children[i].children, rowReducer, []));
        }
        var finalForm = {"board" : array};
        return JSON.stringify(finalForm);
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = onReadyStatusFunction;
    xhttp.open("POST", destination, true);
    var boardJSON = formToJSON(board);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(boardJSON);
}

function checkInput(value, element) {
    function isInputValid(element) {
        var valueAsNumber = Number(element.value);
        var inputFormatValid = element.value.length < 2 && valueAsNumber > 0 && valueAsNumber <= 9;
        var isOneOfPossibleInputs = element.placeholder.split(" ").includes(element.value);
        return inputFormatValid && isOneOfPossibleInputs;
    }

    if (!isInputValid(element)) {
        element.value = element.value.substr(0, element.value.length - 1);
        if (wasActionDelete(element)) {
            getPlaceholders(element);
        }
    } else {
        getPlaceholders(element)
    }
}
