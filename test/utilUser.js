import supertest from "supertest";
import { app } from "../app.js";
import User from "../models/User.js";
// import Question from "../models/Question.js";



export const createUser = async (name,email,password,role) => {
    const createUser = await User.create({
        name : name,
        email : email,
        password : password,
        role : role
    })
}

export const removeUser = async (name) => {
    const createUser = await User.deleteOne({
        name : name,
    })
}

export const getCookieUser = async (email,password) => {
  const result = await supertest(app).post("/api/v1/auth/login").send({
    password: password,
    email: email,
  });
  return ((result.header['set-cookie'][0]).split('; ')[0])
}