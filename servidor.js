//const express= require("express") // antigo  comon Js
import express from "express"
import fs from "fs" // Importando o módulo File System
const app = express()
app.use(express.json())
//let proximoId = 2
//Inicializa a Lista de Alunos
let LISTARALUNOS = []

// Funções de Persistência
const ARQUIVO = 'alunos.txt'

function carregarDados() {
    if (fs.existsSync(ARQUIVO)) {
        try {
            const data = fs.readFileSync(ARQUIVO, 'utf8')
            LISTARALUNOS = JSON.parse(data)
            console.log("Dados carregados com sucesso!")
        } catch (err) {
            console.error("Erro ao carregar dados:", err)
        }
    } else {
        // Dados iniciais se o arquivo não existir
        LISTARALUNOS = [
            { id: 1, nome: "Vitor" },
            { id: 2, nome: "Jansen" },
            { id: 34, nome: "Renan" },
            { id: 35, nome: "Yasmim" }
        ]
        salvarDados() // Cria o arquivo inicial
    }
}

function salvarDados() {
    try {
        fs.writeFileSync(ARQUIVO, JSON.stringify(LISTARALUNOS, null, 2))
        console.log("Dados salvos em " + ARQUIVO)
    } catch (err) {
        console.error("Erro ao salvar dados:", err)
    }
}

// Carregar dados ao iniciar
carregarDados()
app.get("/", (req, res) => {
    res.status(200).json({
        msg: "Bom dia"
    })
    //300..399 redirecionamento. 400..499 erro do cliente, 500..599 erro servidor
})

//Lista todos os Alunos
app.get("/alunos", (req, res) => {
    res.status(200).json(LISTARALUNOS)
})

//Localiza Aluno
app.get("/alunos/:codigo", (req, res) => {
    const idParametro = Number(req.params.codigo) //String, number, boo
    const aluno = LISTARALUNOS.find(a => a.id === idParametro)

    if (!aluno) {
        res.status(404).json({ msg: "Aluno não encontrado" })
    }
    res.status(200).json(aluno)

})//Alterar Aluno
app.put("/alunos/:codigo", (req, res) => {
    const idParametro = Number(req.params.codigo) //String, number, boo
    const indiceAluno = LISTARALUNOS.findIndex(a => a.id === idParametro)
    const { nome } = req.body
    if (indiceAluno === -1) {
        return res.status(404).json({ msg: "Aluno não encontrado" })
    }
    if (!nome) {
        return res.status(400).json({ msg: "Nome é obrigatório" })
    }

    LISTARALUNOS[indiceAluno] = {
        id: idParametro, nome
    }
    salvarDados() // Salva após alterar
    res.status(200).json({ msg: "Alteção feita com Sucesso!", Indice: indiceAluno, })
})
app.put("/alunos/", (req, res) =>{
    console.log("Parametro do Put:", req.params)
    const idParametro = req.params.codigo ? Number(req.params.codigo) : 0
    console.log("idParametro:", idParametro)
    if (idParametro === 0) {
      return res.status(400).json({ msg: "Id é obrigatório" })
    }
})

//Deleta Aluno
app.delete("/alunos/:codigo", (req, res) => {
    const idParametro = Number(req.params.codigo) //String, number, boo
    const aluno = LISTARALUNOS.findIndex(a => a.id === idParametro)
    console.log(aluno)
    if (aluno === -1) {
        return res.status(404).json({ msg: "Aluno não encontrado" })
    }
    LISTARALUNOS.splice(aluno, 1)
    salvarDados() // Salva após excluir
    res.status(200).json({ msg: "Aluno excluido com sucesso" })

})
app.delete("/alunos/", (req, res) => {   // esse delete é para apenas quando 
                                         // não digitar id
    const idParametro =req.params.codigo ? Number(req.params.codigo):0
    console.log("Parametro:", req.params) 
    if (idParametro === 0) {
        return res.status(400).json({ msg: "Gentileza Digitar o iD!" })
    }
})
//Cadastro:
app.post("/alunos", (req, res) => {
    console.log(req.body)
    const { nome } = req.body
    if (!nome) {
        res.status(400).json({ msg: "Por gentileza complete o nome!" })
    }
    console.log("O valor de lenght: " + LISTARALUNOS.length + " tamanho da minha lista")
    const id = LISTARALUNOS.length > 0 ? LISTARALUNOS[LISTARALUNOS.length - 1].id + 1 : 1

    const aluno = { id, nome }
    LISTARALUNOS.push(aluno)
    salvarDados() // Salva após cadastrar
    res.status(201).json({ msg: "Aluno Cadastrado com Sucesso!" })

})
app.listen(5000, () => {
    console.log("Servidor está em operação!")
})
