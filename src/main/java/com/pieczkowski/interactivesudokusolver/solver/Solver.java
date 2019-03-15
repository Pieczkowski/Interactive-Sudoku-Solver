package com.pieczkowski.interactivesudokusolver.solver;

import com.pieczkowski.interactivesudokusolver.model.Sudoku;

public interface Solver {
    int STARTING_INDEX = 0;
    int BOARD_SIZE = 9;
    int DIMENSION_IN_SQUARE = 3;

    boolean solve(Sudoku sudoku);

}
