package com.pieczkowski.interactivesudokusolver.solver;

import com.pieczkowski.interactivesudokusolver.model.Cell;
import com.pieczkowski.interactivesudokusolver.model.Sudoku;
import org.springframework.stereotype.Service;

@Service
public class RecursiveSolver implements Solver {

    @Override
    public boolean solve(Sudoku sudoku) {
        Cell cellToFill;
        for (int rowIndex = STARTING_INDEX; rowIndex < BOARD_SIZE; rowIndex++){
            for (int columIndex = STARTING_INDEX; columIndex < BOARD_SIZE; columIndex++) {
                cellToFill = sudoku.getCell(rowIndex, columIndex);
                if (cellToFill.isNotFilled()){
                    for (int value = 1; value <= 9; value++) {
                        cellToFill.setValue(value);
                        if (isMoveValid(sudoku, cellToFill, rowIndex, columIndex) && solve(sudoku)){
                            return true;
                        }
                        cellToFill.resetValue();
                    }
                    return false;
                }
            }
        }
        return true;
    }

    private boolean isMoveValid(Sudoku sudoku, Cell cell, int rowIndex, int columnIndex) {
        return checkRow(sudoku, cell, rowIndex) && checkColumn(sudoku, cell, columnIndex) && checkSquare(sudoku, cell, rowIndex, columnIndex);
    }


    private boolean checkRow(Sudoku sudoku, Cell changedCell, int rowIndex) {
        for (Cell cellInRow : sudoku.getRow(rowIndex)){
            if (checkValueDuplication(cellInRow, changedCell)){
                return false;
            }
        }
        return true;
    }

    private boolean checkSquare(Sudoku sudoku, Cell changedCell, int rowIndex, int columnIndex) {
        int squareRowIndexStart = (rowIndex/DIMENSION_IN_SQUARE) * DIMENSION_IN_SQUARE;

        for (int squareRowIndex = squareRowIndexStart; squareRowIndex < squareRowIndexStart + DIMENSION_IN_SQUARE; squareRowIndex++) {

            if (squareRowIndex == rowIndex) continue; // no point in checking cells that were checked in other methods

            if (compareCellsInColumns(sudoku, changedCell, columnIndex, squareRowIndex)) return false;
        }
        return true;
    }

    private boolean compareCellsInColumns(Sudoku sudoku, Cell changedCell, int columnIndex, int squareRowIndex) {
        int squareColumnIndexStart = (columnIndex/DIMENSION_IN_SQUARE) * DIMENSION_IN_SQUARE;
        for (int squareColumnIndex = squareColumnIndexStart; squareColumnIndex < squareColumnIndexStart + DIMENSION_IN_SQUARE; squareColumnIndex++) {

            if (squareColumnIndex == columnIndex) continue;

            if (checkValueDuplication(sudoku.getCell(squareRowIndex, squareColumnIndex), changedCell))
                return true;
        }
        return false;
    }

    private boolean checkColumn(Sudoku sudoku, Cell changedCell, int columnIndex) {
        for (int rowIndex = STARTING_INDEX; rowIndex < BOARD_SIZE; rowIndex++) {
            if (checkValueDuplication(sudoku.getCell(rowIndex, columnIndex), changedCell)){
                return false;
            }
        }
        return true;
    }

    private boolean checkValueDuplication(Cell cell, Cell cellChanged){
        if (cell == cellChanged) {
            return false;
        } else return cell.getValue() == cellChanged.getValue();
    }
}
