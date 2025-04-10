import supertest from "supertest";
import { app } from "../app.js";
import User from "../models/User.js";
import Question from "../models/Question.js";
import { createUser, removeUser, getCookieUser } from "./utilUser.js";

const userTestEmail = 'admin@mail.com'
const userTestName = 'administrator'
const userTestRole = 'admin'
const userTestPassword = 'rahasia'

describe("CRUD Operations for Create Question Table", () => {
    beforeEach(async () => {
        await createUser(userTestName, userTestEmail, userTestPassword, userTestRole)

    });
    afterEach(async () => {
        await removeUser(userTestName)
        await removeUser("userTestName")
        await Question.deleteOne({
            title: 'judulTest'
        })
    })

    //Positive test for Create
    it('should sukses create a new question', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const result = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        expect(result.status).toBe(200);
        expect(JSON.parse(result.text).message).toBe("berhasil tambah pertanyaan");
        expect(result.body.data.title).toBe("judulTest")
    });

    //Negative test for Create

    it('should fail create a new question user not login', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const result = await supertest(app).post("/api/v1/question").send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        // console.log(result.body.message)
        expect(result.status).toBe(401);
        expect(JSON.parse(result.text).message).toBe("Anda tidak boleh mengakases halaman ini");
    });

    it('should fail create a new question invalid permission/role', async () => {
        await createUser("userTestName", "user@mail.com", userTestPassword, "user")
        const userCookie = await getCookieUser("user@mail.com", userTestPassword)
        const result = await supertest(app).post("/api/v1/question").send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        expect(result.status).toBe(401);
        expect(JSON.parse(result.text).message).toBe("Anda tidak boleh mengakases halaman ini");
    });

    it('should fail create a new question duplicate title', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const resultold = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });

        const result = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        expect(result.status).toBe(401);
        expect(JSON.parse(result.text).message).toBe("Judul sudah ada");
    });


    it('should fail create a new question with invalid data (title null)', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const result = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: null,
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        expect(result.status).toBe(400);
        expect(result.body.message).toBe("Judul harus diinput");
    });
    it('should fail create a new question with invalid data (title "")', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const result = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        expect(result.status).toBe(400);
        expect(result.body.message).toBe("Judul harus diinput");
    });

    it('should fail create a new question with invalid data (category null )', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const result = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: null,
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        expect(result.status).toBe(400);
        expect(result.body.message).toBe("pertanyaan harus memiliki category");
    });

    it('should fail create a new question with invalid data (category is not valid )', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const result = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "linux",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        expect(result.status).toBe(400);
        expect(result.body.message).toBe("`linux` is not a valid enum value for path `category`.");
    });
    it('should fail create a new question with invalid data (question null)', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const result = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: null,
        });
        expect(result.status).toBe(400);
        expect(result.body.message).toBe("pertanyaan harus diisi");
    });
    it('should fail create a new question with invalid data (question "")', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const result = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: "",
        });
        expect(result.status).toBe(400);
        expect(result.body.message).toBe("pertanyaan harus diisi");
    });
})


// Positive test for Create
describe("CRUD Operations for Fetch  Question Table", () => {
    beforeEach(async () => {
        await createUser(userTestName, userTestEmail, userTestPassword, userTestRole)
    });
    afterEach(async () => {
        await removeUser(userTestName)
        await removeUser("userTestName")
        await Question.deleteOne({
            title: 'judulTest'
        })
    })


    it('should success fetch all question', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const resultQuestion = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        const result = await supertest(app).get("/api/v1/question").set({ Cookie: userCookie })
        expect(result.status).toBe(200);
        expect((result.body.data).length).toBeGreaterThanOrEqual(1)
    });
    //Negative
    it('should fail  fetch all question without login', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const resultQuestion = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        const result = await supertest(app).get("/api/v1/question")
        expect(result.status).toBe(401);
        expect(result.body.message).toBe("Anda tidak boleh mengakases halaman ini");
    });

    it('should fail  fetch all question token invalid - wrong cookie ', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const resultQuestion = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        const result = await supertest(app).get("/api/v1/question").set({ Cookie: userCookie + "gggg" })
        expect(result.status).toBe(401);
        expect(result.body.message).toBe("Token invalid");
    });

    it('should fail fetch all question invalid permission/role', async () => {
        await createUser("userTestName", "user@mail.com", userTestPassword, "user")
        const userCookie = await getCookieUser("user@mail.com", userTestPassword)
        const resultQuestion = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        const result = await supertest(app).get("/api/v1/question").set({ Cookie: userCookie })
        expect(result.status).toBe(403);
        expect((result.body.message)).toBe("role anda tidak bisa mengakase halaman")
    });
    //-------By ID------------------------
    it('should success fetch  question by Id', async () => {
        // await createUser("userTestName", "user@mail.com", userTestPassword, "user")
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const resultQuestion = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        const result = await supertest(app).get("/api/v1/question/" + resultQuestion.body.data._id).set({ Cookie: userCookie })
        expect(result.status).toBe(200);
        expect(result.body.data.title).toBe("judulTest")
    });

    it('should fail fetch  question by Id id not found', async () => {
        // await createUser("userTestName", "user@mail.com", userTestPassword, "user")
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const resultQuestion = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        const result = await supertest(app).get("/api/v1/question/" + "6780c77e6bec7b0aacb808f7").set({ Cookie: userCookie })
        expect(result.status).toBe(404);
        expect(result.body.message).toBe("Id pertanyaan tidak ditemukan")
    });

    it('should fail fetch  question by Id invalid Id format', async () => {
        // await createUser("userTestName", "user@mail.com", userTestPassword, "user")
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const resultQuestion = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        const result = await supertest(app).get("/api/v1/question/" + resultQuestion.body.data._id+"l").set({ Cookie: userCookie })
        expect(result.status).toBe(404);
        expect(result.body.message).toBe("Resource not found")
    });

    it('should fail fetch  question by Id without login', async () => {
        // await createUser("userTestName", "user@mail.com", userTestPassword, "user")
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const resultQuestion = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        const result = await supertest(app).get("/api/v1/question/" + resultQuestion.body.data._id)
        expect(result.status).toBe(401);
        expect(result.body.message).toBe("Anda tidak boleh mengakases halaman ini")
    });

    it('should fail fetch  question by Id invalid token', async () => {
        // await createUser("userTestName", "user@mail.com", userTestPassword, "user")
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const resultQuestion = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        const result = await supertest(app).get("/api/v1/question/" + resultQuestion.body.data._id).set({ Cookie: userCookie+"l" })
        expect(result.status).toBe(401);
        expect(result.body.message).toBe("Token invalid")
    });

    it('should fail fetch  question by Id invalid permission/role', async () => {
        await createUser("userTestName", "user@mail.com", userTestPassword, "user")
        const userCookieAdmin = await getCookieUser(userTestEmail, userTestPassword)
        const resultQuestion = await supertest(app).post("/api/v1/question").set({ Cookie: userCookieAdmin }).send({
            title: "judulTest",
            category: "database",
            question: "pertanyaan adalah untuk membuat pertanyaan database",
        });
        const userCookie = await getCookieUser("user@mail.com", userTestPassword)
        const result = await supertest(app).get("/api/v1/question/" + resultQuestion.body.data._id).set({ Cookie: userCookie })
        expect(result.status).toBe(403);
        expect(result.body.message).toBe("role anda tidak bisa mengakase halaman")
    });

  

});

describe("CRUD Operations for Update  Question Table", () => {
    beforeEach(async () => {
        await createUser(userTestName, userTestEmail, userTestPassword, userTestRole)
    });
    afterEach(async () => {
        await removeUser(userTestName)
        await removeUser("userTestName")
        await removeUser("userTestName1")
        await removeUser("userTestName2")
        await Question.deleteOne({ title: 'judulTest' })
        await Question.deleteOne({ title:"judul Awal" })
        await Question.deleteOne({ title:"judul Updated user" })
    })
    //Positive
    it('should success to update a question with valid data', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const result = await supertest(app).put("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: userCookie }).send({
            title: "judul Updated user",
            category: "database",
            question: "pertanyaan updated",
        });
        expect(result.status).toBe(200);
        expect(result.body.data.title).toBe("judul Updated user")
        await Question.deleteOne({ title:"judul Updated user" })
    }); 

    it('should fail to update a question withot login', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const result = await supertest(app).put("/api/v1/question/"+(resultNew.body.data._id)).send({
            title: "judul Updated user",
            category: "database",
            question: "pertanyaan updated",
        });
        expect(result.status).toBe(401);
        expect(result.body.message).toBe("Anda tidak boleh mengakases halaman ini")
    }); 

    it('should fail to update a question invalid token', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const result = await supertest(app).put("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: userCookie+"x" }).send({
            title: "judul Updated user",
            category: "database",
            question: "pertanyaan updated",
        });
        expect(result.status).toBe(401);
        expect(result.body.message).toBe("Token invalid")
    }); 

    it('should fail to update a question invalid permission/role', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        await createUser("userTestName", "user@mail.com", userTestPassword, "kasir")
        const userNewCookie = await getCookieUser("user@mail.com", userTestPassword)

        const result = await supertest(app).put("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: userNewCookie }).send({
            title: "judul Updated user",
            category: "database",
            question: "pertanyaan updated",
        });
        expect(result.status).toBe(403);
        expect(result.body.message).toBe("role anda tidak bisa mengakase halaman")
    }); 


    //lanjut nanti ya----- untuk cookie nya
    it('should fail to update a question invalid user created', async () => {
        await createUser("userTestName1", "user1@mail.com", userTestPassword, "admin")
        const userCookie = await getCookieUser("user1@mail.com", userTestPassword)
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });

        await createUser("userTestName2", "user2@mail.com", userTestPassword, "user")
        const userNewCookie = await getCookieUser("user2@mail.com", userTestPassword)
        const result = await supertest(app).put("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: userNewCookie }).send({
            title: "judul Updated user",
            category: "database",
            question: "pertanyaan updated",
        });
        expect(result.status).toBe(401);
        expect(result.body.message).toBe("Anda tidak bisa melakukan update/delete yang bukan milik anda")
    }); 

    it('should fail to update a question with invalid data (title "")', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const result = await supertest(app).put("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: userCookie }).send({
            title: "",
            category: "database",
            question: "pertanyaan updated",
        });
        expect(result.status).toBe(400);
        expect(result.body.message).toBe("Judul harus diinput")
    }); 

    it('should fail to update a question with invalid data (category invalid value)', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const result = await supertest(app).put("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "java",
            question: "pertanyaan updated",
        });
        expect(result.status).toBe(400);
        expect(result.body.message).toContain("is not a valid enum")
    }); 

    it('should fail to update a question with invalid data (question "")', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const result = await supertest(app).put("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "",
        });
        expect(result.status).toBe(400);
        expect(result.body.message).toContain("pertanyaan harus diisi")
    }); 
})



// it('should fail create a new question with wrong data (question null)', async () => {
//     console.log("llllllll")
// console.log(result.body.message)
// }); 
describe("CRUD Operations for Delete  Question Table", () => {
    beforeEach(async () => {
        await createUser(userTestName, userTestEmail, userTestPassword, userTestRole)
    });
    afterEach(async () => {
        await removeUser(userTestName)
        await removeUser("userTestName")
        await Question.deleteOne({title: 'judulTest' })
        await Question.deleteOne({title: 'judul Awal' })

    })
    //Positive
    it('should succes to delete a question ', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const result = await supertest(app).delete("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: userCookie })
        expect(result.status).toBe(200);
        expect(result.body.message).toContain("Delete pertanyaan berhasil")
    }); 

    // Negative
    it('should fail to delete a question without login ', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const result = await supertest(app).delete("/api/v1/question/"+(resultNew.body.data._id))
        expect(result.status).toBe(401);
        expect(result.body.message).toContain("Anda tidak boleh mengakases halaman ini")
    }); 

    it('should fail to delete a question invalid token', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });
        const result = await supertest(app).delete("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: userCookie+"z" })
        expect(result.status).toBe(401);
        expect(result.body.message).toContain("Token invalid")
    }); 

    it('should fail to delete a question invalid permission/role', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });

        await createUser("userTestName", "user@mail.com", userTestPassword, "kasir")
        const userNewCookie = await getCookieUser("user@mail.com", userTestPassword)
        const result = await supertest(app).delete("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: userNewCookie })
        expect(result.status).toBe(403);
        expect(result.body.message).toContain("role anda tidak bisa mengakase halaman")
    }); 


    it('should fail to delete a question invalid user created', async () => {
        // await createUser("userTestName", "user@mail.com", userTestPassword, "user")
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        let resultNew = await supertest(app).post("/api/v1/question").set({ Cookie: userCookie }).send({
            title: "judul Awal",
            category: "database",
            question: "pertanyaan Awal",
        });

        await createUser("userTestName", "user@mail.com", userTestPassword, "user")
        const userNewCookie = await getCookieUser("user@mail.com", userTestPassword)
        const result = await supertest(app).delete("/api/v1/question/"+(resultNew.body.data._id)).set({ Cookie: userNewCookie })
        expect(result.status).toBe(401);
        expect(result.body.message).toContain("Anda tidak bisa melakukan update/delete yang bukan milik anda")
    }); 

    it('should fail to delete a question   id not found', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const result = await supertest(app).delete("/api/v1/question/"+('6780c77e6bec7b0aacb808f7')).set({ Cookie: userCookie })
        expect(result.status).toBe(404);
        expect(result.body.message).toContain("Id pertanyaan tidak ditemukan")
    }); 
    it('should fail to delete a question invalid format ID', async () => {
        const userCookie = await getCookieUser(userTestEmail, userTestPassword)
        const result = await supertest(app).delete("/api/v1/question/"+('6780c77e6bec7b0aacb808f7x')).set({ Cookie: userCookie })
        expect(result.status).toBe(404);
        expect(result.body.message).toContain("Format Id salah")
    }); 
    

})



// it('should fail create a new question with wrong data (question null)', async () => {
//     console.log("llllllll")
// console.log(result.body.message)
// }); 
// describe("CRUD Operations for Fetch  Question Table", () => {})
    // beforeEach(async () => {
    //     await createUser(userTestName, userTestEmail, userTestPassword, userTestRole)
    // });
    // afterEach(async () => {
    //     await removeUser(userTestName)
    //     await removeUser("userTestName")
    //     await Question.deleteOne({
    //         title: 'judulTest'
    //     })
    // })
