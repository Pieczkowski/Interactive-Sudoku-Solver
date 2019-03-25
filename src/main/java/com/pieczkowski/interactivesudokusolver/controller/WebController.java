package com.pieczkowski.interactivesudokusolver.controller;

import com.pieczkowski.interactivesudokusolver.model.Sudoku;
import com.pieczkowski.interactivesudokusolver.solver.Solver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class WebController {
    private Solver solver;

    @Autowired
    public WebController(Solver solver){
        this.solver = solver;
    }

    @PostMapping(value = "/solve", consumes = "application/json")
    @ResponseBody
    public Sudoku solve(@RequestBody Sudoku form){
        boolean isSolved = solver.solve(form);
        if (isSolved) {
            form.markAsSolved();
        }
        return form;
    }

    @GetMapping("/solve")
    public String getForm(){
        return "emptySudoku";
    }

    @PostMapping("/check")
    @ResponseBody
    public Boolean check(@RequestBody Sudoku form){
        return solver.solve(form);
    }
    
}
