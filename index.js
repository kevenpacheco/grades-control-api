import express from 'express';
import {promises as fs} from 'fs';

const app = express();
app.use(express.json());

// Item 1
app.post('/create', async (req, res) => {
    try{
        let newStudant = req.body
        const data = JSON.parse(await fs.readFile('grades.json'));
        
        const id = data.nextId;
        newStudant = {
            "id": id,
            ...newStudant,
            "timestamp": new Date()
        }

        data.nextId++;
        data.grades.push(newStudant);

        await fs.writeFile('grades.json', JSON.stringify(data, null, 2))

        res.send(newStudant)
    } catch(erro) {
        res.status(400).send({ error: erro.message })
    }
})

// Item 2
app.put('/update', async (req, res) => {
    try{
        const newStudant = req.body;
        const data = JSON.parse(await fs.readFile('grades.json'));
        
        const index = data.grades.findIndex(studant => studant.id === newStudant.id);

        if(index >= 0) {
            data.grades[index] = {
                id: newStudant.id,
                student: newStudant.student,
                subject: newStudant.subject,
                type: newStudant.type,
                value: newStudant.value,
                "timestamp": new Date()
            };
    
            await fs.writeFile('grades.json', JSON.stringify(data, null, 2));
    
            res.send(data.grades[index]);
        } else {
            throw new Error("ID studant not found");
        };
    } catch(erro) {
        res.status(400).send({ error: erro.message });
    }
})

// Item 3
app.delete('/delete/:id', async (req, res) => {
    try {
        const data = JSON.parse(await fs.readFile('grades.json'));

        const filter = data.grades = data.grades.filter(
            grade => parseInt(grade.id) != parseInt(req.params.id)
        )

        data.grades = filter;

        fs.writeFile('grades.json', JSON.stringify(data, null, 2));
        
        res.send(data)
    } catch (erro) {
        res.status(400).send({ error: erro.message });
    }
})

// Item 4
app.get('/search-grade/:id', async(req, res) => {
    try {
        const data = JSON.parse(await fs.readFile('grades.json'));
        

        const grade = data.grades.find(grade => {
            return Number(grade.id) === Number(req.params.id)
        })

        res.send(grade);

    } catch(erro) {
        res.status(400).send({ err: erro.message })
    }
})

// Item 5
app.get('/total-score', async(req, res) => {
    try {
        const data = JSON.parse(await fs.readFile('grades.json'));
        const aluno = req.body.student;
        const materia = req.body.subject;

        const score = data.grades.filter(grade => {
            return grade.student === aluno
            && 
            grade.subject === materia;
        })
        
        const total = score.reduce((acc, elem) => acc + elem.value, 0)

        res.send(`Sua nota total é ${total}`);
    } catch(erro) {
        res.status(400).send({ erro: erro.message });
    }
})

// Item 6
app.get('/average', async(req, res) => {
    try {
        const data = JSON.parse(await fs.readFile('grades.json'));
        const subject = req.body.subject;
        const type = req.body.type;

        const score = data.grades.filter(grade => {
            return grade.subject === subject
            && 
            grade.type === type;
        })

        const total = score.reduce((acc, elem) => acc + elem.value, 0);

        const average = total / score.length

        res.send(`A média é ${average}`)
    } catch(erro) {
        res.status(400).send({ erro: erro.message });
    }
})

// Item 7
app.get('/top3', async(req, res) => {
    try {
        const data = JSON.parse(await fs.readFile('grades.json'));
        const subject = req.body.subject;
        const type = req.body.type;

        const score = data.grades.filter(grade => {
            return grade.subject === subject
            && 
            grade.type === type;
        })

        const top3 = score.sort((a, b) => b.value - a.value).slice(0, 3);

        res.send(top3)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})

app.listen(4567, async () => {
    try{
        await fs.readFile('grades.json')
    } catch (erro) {
        await fs.writeFile('grades.json', JSON.stringify(
            {
                "nextId": 1,
                "grades": []
            },
            null,
            2
        ))
    }
    
    console.log('API Started!')
})