import { app } from "../app.js";
import supertest from "supertest";
import User from "../models/User.js";
// import fs from fs

import { getCookie, getCookieAdmin, createUserLogin, getCookieByUserLogin,deleteAdmin,createAdmin,createUser,deleteUser } from "./util.testing.js";

describe("Test User.................", () => {
  beforeEach(async () => {
    await createUser();
     await createAdmin();
  });
  afterEach(async () => {
     await deleteUser()
     await deleteAdmin()
  });

  it("1. should can register new user /api/v1/auth/register", async () => {
    const result = await supertest(app).post("/api/v1/auth/register").send({
      name: "testnewuser",
      password: "rahasia2",
      email: "test2@mail.com",
    });
    expect(result.status).toBe(201);
    await User.deleteOne({
      name: "testnewuser",
    });
  });

  it("2. User login sukses /api/v1/auth/login", async () => {
    const result = await supertest(app).post("/api/v1/auth/login").send({
      name: "userbiasa",
      password: "rahasia",
      email: "userbiasa@mail.com",
    });
    expect(result.status).toBe(200);
    expect(result.body.data.name).toBe("userbiasa");
    expect(result.body.data.email).toBe("userbiasa@mail.com");
  });

  it("3. User login gagal email/pasword kosong /api/v1/auth/login", async () => {
    const result = await supertest(app).post("/api/v1/auth/login").send({
      name: "userbiasa",
      password: "",
      email: "testuser@mail.com",
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe("Invalid User");
  });

  it("4. User login gagal invalid password /api/v1/auth/login", async () => {
    const result = await supertest(app).post("/api/v1/auth/login").send({
      name: "userbiasa",
      password: "rahasia_salah",
      email: "testuser@mail.com",
    });
    expect(result.status).toBe(400);
    expect(result.body.message).toBe("Invalid User");
  });

  //token cookies valid
  it("5. should getUser logged with valid cookies /api/v1/auth/getUser ", async () => {
    const result = await supertest(app)
      .get("/api/v1/auth/getUser").set({ Cookie: await getCookie() }); //set ke headers// ambil cookie untuk yang sudah login
    expect(result.status).toBe(200);
    expect(result.body.user.name).toBe("userbiasa");
  });

  //token cookies invalid
  it("6. should can not getUser logged invalid cookies) /api/v1/auth/getUser ", async () => {
    const result = await supertest(app).get("/api/v1/auth/getUser")
      .set({ Cookie: await getCookie() + "pppp" }); //set ke headers// ambil cookie untuk yang sudah login
    expect(result.status).toBe(401);
    expect(JSON.parse(result.text).message).toBe("Token invalid")
  });

  it("7. should can not getUser before Log In /api/v1/auth/getUser ", async () => {
    const result = await supertest(app).get("/api/v1/auth/getUser");
    // .set( {'Cookie': await getCookie()});//set ke headers// ambil cookie untuk yang sudah login
    expect(result.status).toBe(401);
    expect(JSON.parse(result.text).message).toBe("Anda tidak boleh mengakases halaman ini");
  });

  it("8. should can not getUser valid cookies and user has ben deleted /api/v1/auth/getUser ", async () => {
    //regiter new user
    await (createUserLogin('testCookies', 'testcookies@mail.com', '12345678'))
    let cookiesUser = await getCookieByUserLogin('testcookies@mail.com', '12345678')
    //delete user
    await User.deleteOne({ name: "testCookies" });
    const result = await supertest(app).get("/api/v1/auth/getUser")
      .set({ 'Cookie': cookiesUser });//set ke headers// ambil cookie untuk yang sudah login

    expect(result.status).toBe(401);
    expect(JSON.parse(result.text).message).toBe("User tidak ditemukan");
  });


  it("9. should logout  /api/v1/auth/logout ", async () => {
    const result = await supertest(app).get("/api/v1/auth/logout");
    expect(result.status).toBe(200);
    expect(JSON.parse(result.text).message).toBe("logout Berhasil");
  });


  // role test
  it("10. should testrole logged with valid role and cookies /api/v1/auth/testrole ", async () => {
    const result = await supertest(app)
      .get("/api/v1/auth/testrole")
      .set({ Cookie: await getCookieAdmin() }); //set ke headers// ambil cookie untuk yang sudah login
    expect(result.status).toBe(200);
    expect(result.text).toBe("berhasil");
  });

  it("11. should testrole logged with invalid role and valid cookies /api/v1/auth/testrole ", async () => {
    const result = await supertest(app)
      .get("/api/v1/auth/testrole")
      .set({ Cookie: await getCookie() }); //set ke headers// ambil cookie untuk yang sudah login
    expect(result.status).toBe(403);
    expect(JSON.parse(result.text).message).toBe("role anda tidak bisa mengakase halaman");
  });
}); //from describe
