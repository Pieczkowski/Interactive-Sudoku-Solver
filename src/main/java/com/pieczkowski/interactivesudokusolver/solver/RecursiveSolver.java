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

}
