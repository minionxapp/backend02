import supertest from "supertest";
import { app } from "../app.js";
import User from "../models/User.js";
import Question from "../models/Question.js";
import DevTabelKolom from "../../models/dev/DevTabelKolom.js";

export const createDevTabelKolom = async () => {
    await DevTabelKolom.create({
      tabel: "Tabel1",
      kol_name:'Nama-Kolom',
      kol_tipe:"Kolom_Tipe",
      kol_unique:"Kolom_unique",
      kol_default:"kolom_default"
    });
  }