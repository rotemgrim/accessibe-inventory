import request from "supertest";
import app from "../src/app";
import {expect} from "chai";
import {reduce} from "async";

describe("test products list with GET /api/products", () => {
    it("should return 200 OK", () => {
        return request(app).get("/api/products")
            .expect(200);
    });

    it("should return a none err result", (done) => {
        return request(app).get("/api/products")
            .end(function (err, res) {
                let response = JSON.parse(res.text);
                expect(response.err).to.eq(0);
                expect(res.error).to.be.false;
                done();
            });
    });

    it("should return a list in payload", (done) => {
        return request(app).get("/api/products")
            .end(function (err, res) {
                let response = JSON.parse(res.text);
                expect(response.payload).to.be.an.instanceof(Array);
                expect(res.error).to.be.false;
                done();
            });
    });
});

describe("tests creation of new products with POST /api/products", () => {

    beforeAll((done) => {
        return request(app).delete("/api/products")
            .send({
                "isbn": "test1"
            })
            .end((err, res) => {
                done();
            });
    });

    it("should return 201 CREATED", (done) => {
        return request(app).post("/api/products")
            .send({
                "isbn": "test1",
                "name": "test1"
            })
            .end((err, res) => {
                expect(res.error).to.be.false;
                let response = JSON.parse(res.text);
                expect(response.err).eq(0);
                done();
            })
            .expect(201);
    });

    it("should return error 400 because its already created", (done) => {
        return request(app).post("/api/products")
            .send({
                "isbn": "test1",
                "name": "test1"
            })
            .end((err, res) => {
                let response = JSON.parse(res.error.text);
                expect(response.err).eq(1);
                done();
            })
            .expect(400);
    });
});

describe("test updating of products with PUT /api/products", () => {
    it("should update the product name", (done) => {
        return request(app).put("/api/products")
            .send({
                "product": {
                    "isbn": "test1",
                    "name": "test2-test2"
                }
            })
            .end((err, res) => {
                expect(res.error).to.be.false;
                let response = JSON.parse(res.text);
                expect(response.err).eq(0);
                expect(response.payload.name).eq("test2-test2");
                done();
            })
            .expect(400);
    });
});

describe("test product deletion with DELETE /api/products", () => {
    it("should Delete the product with isbn 'test1'", (done) => {
        return request(app).delete("/api/products")
            .send({
                "isbn": "test1"
            })
            .expect(200)
            .end((err, res) => {
                done();
            });

    });
});

describe("tests requests & inventory update", () => {

    beforeAll((done) => {
        return request(app).post("/api/products")
            .send({
                "isbn": "test2",
                "name": "test2"
            })
            .end((err, res) => {
                done();
            });
    });

    it("should add new request to 'test2'", (done) => {
        return request(app).put("/api/products/add-request")
            .send({
                "isbn": "test2",
                "pRequest": {
                    "user": "rotem",
                    "amount": 1,
                    "isActive": true
                }
            })
            .expect(200)
            .end((err, res) => {
                expect(res.error).to.be.false;
                let response = JSON.parse(res.text);
                expect(response.err).eq(0);
                expect(response.payload.requests.length).to.be.gt(0);
                done();
            });
    });

    it("should add new inventory item to 'test2' and remove 1 request", (done) => {
        return request(app).put("/api/products/add-to-inventory")
            .send({
                "isbn": "test2"
            })
            .expect(200)
            .end((err, res) => {
                expect(res.error).to.be.false;
                let response = JSON.parse(res.text);
                expect(response.err).eq(0);
                expect(response.payload.quantity).to.be.eq(1);
                expect(response.payload.requests.map(x => x.isActive ? x.amount : 0).reduce((a, b) => a+b, 0)).to.be.eq(0);
                done();
            });
    });


});

afterAll((done) => {
    return request(app).delete("/api/products")
        .send({
            "isbn": "test1"
        })
        .end((err, res) => {
            done();
        });
});

afterAll((done) => {
    return request(app).delete("/api/products")
        .send({
            "isbn": "test2"
        })
        .end((err, res) => {
            done();
        });
});
