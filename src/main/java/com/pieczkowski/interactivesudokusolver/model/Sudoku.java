package com.pieczkowski.interactivesudokusolver.model;

import java.io.Serializable;
import java.util.List;

public class Sudoku implements Serializable {
    List<List<Cell>> board;
    boolean solved = false;
    boolean moveValid = false;

    Sudoku(){}

    public void setBoard(List<List<Cell>> board) {
        this.board = board;
    }

    public List<List<Cell>> getBoard() {
        return board;
    }

    public Cell getCell(int rowIndex, int columnIndex){
        return board.get(rowIndex).get(columnIndex);
    }

    public List<Cell> getRow(int rowIndex){
        return board.get(rowIndex);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        for (List<Cell> row:board) {
            for (Cell cell:row) {
                sb.append(cell);
            }
        }
        return sb.toString();
    }

    public void markAsSolved() {
        solved = true;
    }

    public boolean isSolved() {
        return solved;
    }

    public boolean isMoveValid() {
        return moveValid;
    }

    public void setMoveValid(){
        moveValid = true;
    }
}
