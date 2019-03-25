package com.pieczkowski.interactivesudokusolver.solver;

import com.pieczkowski.interactivesudokusolver.model.Cell;
import com.pieczkowski.interactivesudokusolver.model.Sudoku;

public interface Solver {
    int STARTING_INDEX = 0;
    int BOARD_SIZE = 9;
    int DIMENSION_IN_SQUARE = 3;

    boolean solve(Sudoku sudoku);
    boolean isMoveValid(Sudoku sudoku, Cell cell, int rowIndex, int columnIndex);
    boolean checkSquare(Sudoku sudoku, Cell changedCell, int rowIndex, int columnIndex);
    boolean checkRow(Sudoku sudoku, Cell changedCell, int rowIndex);
    boolean checkColumn(Sudoku sudoku, Cell changedCell, int columnIndex);
}
