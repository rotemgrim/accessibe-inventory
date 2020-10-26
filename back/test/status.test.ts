import request from "supertest";
import app from "../src/app";
import {expect} from "chai";

describe("GET /status", () => {
    it("should return 200 OK", (done) => {
        request(app).get("/status")
            .expect(200, done);
    });
    it("should contain the word 'WORKING'", (done) => {
        request(app).get("/status")
            .end(function (err, res) {
                expect(res.text).to.include("WORKING");
                expect(res.error).to.be.false;
                done();
            });
    });
});

describe("GET /random-url", () => {
    it("should return 404", (done) => {
        request(app).get("/reset")
            .expect(404, done);
    });
});
