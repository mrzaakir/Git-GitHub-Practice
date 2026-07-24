package com.example.demo;
// Feature 1 Controller
public class Feature1Controller {
    private Feature1Service service = new Feature1Service();
    public void run() {
        service.execute();
    }
}
