import supertest from "supertest";
import { app } from "../app.js";
import User from "../models/User.js";
import Question from "../models/Question.js";


export const getCookie = async () => {
  const result = await supertest(app).post("/api/v1/auth/login").send({
    name: "userbiasa",
    password: "rahasia",
    email: "userbiasa@mail.com",
    role: 'user'
  });
  return ((result.header['set-cookie'][0]).split('; ')[0])

}

export const getCookieAdmin = async () => {
  const result = await supertest(app).post("/api/v1/auth/login").send({
    name: "useradmin",
    password: "rahasia",
    email: "useradmin@mail.com",
    role: 'admin'
  });
  return ((result.header['set-cookie'][0]).split('; ')[0])

}

export const getCookieByUserLogin = async (userEmail, userPassword) => {
  const result = await supertest(app).post("/api/v1/auth/login").send({
    name: "mugi3",
    password: userPassword,
    email: userEmail,
  });
  return ((result.header['set-cookie'][0]).split('; ')[0])
}

export const createUserLogin = async (userName, userEmail, userPassword, userRole) => {
  const result = await supertest(app).post("/api/v1/auth/register").send({
    name: userName,
    password: userPassword,
    email: userEmail,
    role: userRole
  });
  return (result)
}

export const createUser = async () => {
  const result = await supertest(app).post("/api/v1/auth/register").send({
    name: 'userbiasa',
    password: 'rahasia',
    email: 'userbiasa@mail.com',
    role: 'user',
  });
  return (result)
}
export const createAdmin = async () => {
  const result = await supertest(app).post("/api/v1/auth/register").send({
    name: "useradmin",
    password: "rahasia",
    email: "useradmin@mail.com",
    role: "admin",
  });
  return (result)
}

export const deleteUser = async () => {
  await User.deleteOne({
    name: "userbiasa",
  });
}
export const deleteAdmin = async () => {
  await User.deleteOne({
    name: "useradmin",
  });
}

// create question
export const createQuestion = async () => {
  await supertest(app).post("/api/v1/question").set({ Cookie: await getCookie() }).send({
              title: "judulTest33",
              category: "database",
              question: "pertanyaan untuk duplicate adalah untuk membuat pertanyaan database",
          });
}

export const deleteQuestion = async()=>{
  await Question.deleteOne({
    title: "judulTest"
  })
}