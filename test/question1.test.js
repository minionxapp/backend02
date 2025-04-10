import supertest from "supertest";
import { app } from "../app.js";
import User from "../models/User.js";
import Question from "../models/Question.js";
// import fs from fs

import { getCookie, getCookieAdmin, createUserLogin, getCookieByUserLogin, createAdmin, createUser, deleteAdmin, deleteUser, createQuestion, deleteQuestion } from "./util.testing.js";
import { isValidObjectId } from "mongoose";

describe("Question Create", () => {
    beforeEach(async () => {
        await createUser();
        await createAdmin();


    });
    afterEach(async () => {
        await deleteUser()
        await deleteAdmin();
        await deleteQuestion();
    }); 


    it("1. Admin can create Question with valid cookies .... /api/v1/question", async () => {
        const result = await supertest(app).post("/api/v1/question").set({ Cookie: await getCookieAdmin() }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        expect(result.status).toBe(200);
        expect(JSON.parse(result.text).message).toBe("berhasil tambah pertanyaan");
        expect(result.body.data.title).toBe("judulTest")
    })

    it("2. Admin cannot create with incorect categry Question with valid cookies .... /api/v1/question", async () => {
        const result = await supertest(app).post("/api/v1/question").set({ Cookie: await getCookieAdmin() }).send({
            title: "judulTest",
            category: "database2222",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        expect(result.status).toBe(400);
        expect(JSON.parse(result.text).message).toBe("`database2222` is not a valid enum value for path `category`.");
    })

    it("3. Admin cannot create duplicate title categry Question with valid cookies .... /api/v1/question", async () => {
        let resultOld = await supertest(app).post("/api/v1/question").set({ Cookie: await getCookieAdmin() }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });

        const result = await supertest(app).post("/api/v1/question").set({ Cookie: await getCookieAdmin() }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan untuk duplicate adalah untuk membuat pertanyaan database",
        });
        expect(result.status).toBe(200);
        expect(JSON.parse(result.text).message).toBe("E11000 duplicate key error collection: forum.questions index: title_1 dup key: { title: \"judulTest\" }");
    })
    it("4. Should cannot create Question with invalid cookies no login(user).... /api/v1/question", async () => {
        const result = await supertest(app).post("/api/v1/question").send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        expect(result.status).toBe(401);
        expect(JSON.parse(result.text).message).toBe("Anda tidak boleh mengakases halaman ini");
    })


})

describe("Question Find ", () => {
    beforeEach(async () => {
        await createUser();
        await createAdmin();
        await createQuestion()
    });
    afterEach(async () => {
        await deleteUser()
        await deleteAdmin()
        await deleteQuestion()
        await Question.deleteOne({
            title: "judulTest33"
          })
        await Question.deleteOne({
        title: "judulTest335"
        })
    });
    
    it("5. find all question user  logged /api/v1/question/ ", async () => {
        const result = await supertest(app)
            .get("/api/v1/question").set({ Cookie: await getCookie() });
        expect(result.status).toBe(200);
        // expect((result.body.data)).toHaveLength(1)
        expect((result.body.data).length).toBeGreaterThanOrEqual(1)
    })

    it("6. find all question user not login /api/v1/question/ ", async () => {
        const result = await supertest(app).get("/api/v1/question")
        expect(JSON.parse(result.text).message).toBe("Anda tidak boleh mengakases halaman ini");
    })

    it("7. find  question by _id user has ben login /api/v1/question/:id", async () => {
         let dataQuestion = await supertest(app).post("/api/v1/question").set({ Cookie: await getCookieAdmin() }).send({
                      title: "judulTest335",
                      category: "database",
                      question: "pertanyaan untuk duplicate adalah untuk membuat pertanyaan database",
                  });

        const result = await supertest(app).get("/api/v1/question/"+dataQuestion.body.data._id).set({ Cookie: await getCookie() })
        expect(JSON.parse(result.text).message).toBe("Document Id pertanyaan berhasil di temukan");
        

    })

    it("8. find  question by _id user not login /api/v1/question/677e20c07f0671e439d3860b", async () => {
        const result = await supertest(app).get("/api/v1/question/677e20c07f0671e439d3860b")
        expect(JSON.parse(result.text).message).toBe("Anda tidak boleh mengakases halaman ini");
    })
})


describe("Question Update ", () => {
    beforeEach(async () => {
        await createUser();
        await createAdmin();
        await createQuestion()
    });
    afterEach(async () => {
        await deleteUser()
        await deleteAdmin()
        await deleteQuestion()
          await Question.deleteOne({
            title:"judul Updated"
        })

        await Question.deleteOne({
            title:"judul Updated admin"
        })
        await Question.deleteOne({
            title: "judulTest33"
          })

          await Question.deleteOne({
            title:"judul Awal"
        })
        await User.deleteOne({
            name : 'mugi2'
        })
          
    });
    it("it should update question by user created /api/v1/question/:id ", async () => {
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: await getCookie() }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const result = await supertest(app).put("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: await getCookie() }).send({
            title: "judul Updated user",
            category: "database",
            question: "pertanyaan updated",
        });
        expect(result.status).toBe(200);
        expect(result.body.data.title).toBe("judul Updated user")
        await Question.deleteOne({
            title:"judul Updated user"
        })
    })

    it("it should update question by admin role created /api/v1/question/:id ", async () => {
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: await getCookie() }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const result = await supertest(app).put("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: await getCookieAdmin() }).send({
            title: "judul Updated by admin",
            category: "database",
            question: "pertanyaan updated",
        });
        expect(result.status).toBe(200);
        expect(result.body.data.title).toBe("judul Updated by admin")
        await Question.deleteOne({
            title:"judul Updated by admin"
        })
    })

    it("it should cannot update question by no user created /api/v1/question/:id ", async () => {
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: await getCookie() }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });

        let createUser = await createUserLogin('mugi2','mugi2@mail.com','rahasia','user')
        const result = await supertest(app).put("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: await getCookieByUserLogin('mugi2@mail.com','rahasia') }).send({
            title: "judul Updated by admin",
            category: "database",
            question: "pertanyaan updated",
        });
        expect(result.status).toBe(401);
        expect(result.body.message).toBe("Anda tidak bisa melakukan update/delete yang bukan milik anda")
        
    })
})

describe("Question Delete", () => {
    beforeEach(async () => {
        await createUser();
        await createAdmin();
        await createQuestion()
    });
    afterEach(async () => {
        await deleteUser()
        await deleteAdmin()
        await deleteQuestion()
        await Question.deleteOne({
            title:"judul Awal"
        })
        await Question.deleteOne({
            title:"judulTest33"
        })
        
          
    });
    it("it should can delete question by user created /api/v1/question/:id ", async () => {
        // add data first
        const resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: await getCookie() }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const idParam =(resultNew.body.data._id)
        const result = await supertest(app).delete("/api/v1/question/"+idParam).set({ Cookie: await getCookie() })   
        expect(result.status).toBe(200);

        const result2 = await supertest(app).get("/api/v1/question/"+idParam).set({ Cookie: await getCookie() })
        expect(result2.body.message).toBe("Id pertanyaan tidak ditemukan")
    })

    it("it should can not delete question  Id not found /api/v1/question/:id ", async () => {
        console.log("Delete Question")
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: await getCookie() }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const result = await supertest(app).delete("/api/v1/question/6780c77e6bec7b0aacb808f7").set({ Cookie: await getCookie() })
        expect(result.status).toBe(404);
        expect(JSON.parse(result.text).message).toBe("Id pertanyaan tidak ditemukan")
    })

    it("it should can not delete question  Id format wrong/false /api/v1/question/:id ", async () => {
        console.log("Delete Question")
        // add data first
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: await getCookie() }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const result = await supertest(app).delete("/api/v1/question/6780c77e6bec7b0aacb808f7x").set({ Cookie: await getCookie() })
        expect(result.status).toBe(404);
        expect(JSON.parse(result.text).message).toBe("Format Id salah")
    })
})
