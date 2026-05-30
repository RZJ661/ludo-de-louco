const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

const salas = {};
const cores = ["Vermelho", "Azul", "Amarelo", "Verde"];

function criarCodigoSala() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function embaralhar(lista) {
    return [...lista].sort(() => Math.random() - 0.5);
}

io.on("connection", (socket) => {
    console.log("Jogador conectado:", socket.id);

    socket.on("criarSala", (nick) => {
        const codigo = criarCodigoSala();

        salas[codigo] = {
            dono: socket.id,
            jogadores: [{ id: socket.id, nick }]
        };

        socket.join(codigo);

        socket.emit("salaCriada", {
            codigo,
            dono: socket.id,
            jogadores: salas[codigo].jogadores
        });
    });

    socket.on("entrarSala", ({ codigo, nick }) => {
        if (!salas[codigo]) {
            socket.emit("erroSala", "Sala não encontrada.");
            return;
        }

        if (salas[codigo].jogadores.length >= 4) {
            socket.emit("erroSala", "Sala cheia.");
            return;
        }

        salas[codigo].jogadores.push({ id: socket.id, nick });
        socket.join(codigo);

        io.to(codigo).emit("atualizarSala", {
            codigo,
            dono: salas[codigo].dono,
            jogadores: salas[codigo].jogadores
        });
    });

    socket.on("iniciarPartida", (codigo) => {
        const sala = salas[codigo];
        if (!sala) return;
        if (socket.id !== sala.dono) return;

        const coresSorteadas = embaralhar([0, 1, 2, 3]);

        const jogadoresComCor = sala.jogadores.map((jogador, index) => ({
            ...jogador,
            corIndex: coresSorteadas[index],
            corNome: cores[coresSorteadas[index]]
        }));

        sala.jogadores = jogadoresComCor;

        io.to(codigo).emit("partidaIniciada", {
            codigo,
            jogadores: jogadoresComCor
        });
    });

    socket.on("estadoJogo", ({ codigo, estado }) => {
        socket.to(codigo).emit("estadoJogo", estado);
    });

    socket.on("disconnect", () => {
        console.log("Jogador saiu:", socket.id);

        for (const codigo in salas) {
            salas[codigo].jogadores = salas[codigo].jogadores.filter(j => j.id !== socket.id);

            if (salas[codigo].jogadores.length === 0) {
                delete salas[codigo];
            } else {
                io.to(codigo).emit("atualizarSala", {
                    codigo,
                    dono: salas[codigo].dono,
                    jogadores: salas[codigo].jogadores
                });
            }
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});