package com.pieczkowski.interactivesudokusolver.model;

import java.util.Set;

public class Cell {
    int value;
    Set<Integer> possibleInserts;

    public Cell(int value){
        this.value = value;
    }
    public Cell(){
    }

    public int getValue() {
        return value;
    }

    public Set<Integer> getPossibleInserts() {
        return possibleInserts;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public boolean isNotFilled(){
        return value == 0;
    }

    public void resetValue(){
        value = 0;
    }

    @Override
    public String toString() {

        return "Value: " + value + ", Possible solutions: " + possibleInserts;
    }

    public void removeFromPossibleInserts(int value){
        possibleInserts.remove(value);
    }

    public void addToPossibleInserts(int value){
        possibleInserts.add(value);
    }
}
