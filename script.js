const nomes = ["Vermelho", "Azul", "Amarelo", "Verde"];
const classesPainel = ["painel-vermelho", "painel-azul", "painel-amarelo", "painel-verde"];

let jogadorAtual = 0;

const tabuleiro = document.getElementById("tabuleiro");
const botaoDado = document.getElementById("dado");
const dadoVisual = document.getElementById("dado-visual");
const dadosAcumuladosTexto = document.getElementById("dados-acumulados");
const nickJogador = document.getElementById("nick-jogador");
const painelJogador = document.getElementById("painel-jogador");

const resultado = document.getElementById("resultado");
const turnoTexto = document.getElementById("jogador-atual");
const info = document.getElementById("info");

let pecasDOM = [[], [], [], []];

let progresso = [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1]
];

let golsFeitos = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
];

let dadosPendentes = [];
let bonusGiros = 0;
let seisSeguidos = 0;
let animando = false;
let timerAFK = null;

let jogoOnline = false;
let minhaCor = null;
let meuNick = "";
let minhaSala = "";
let souDonoDaSala = false;

const GOL = 53;

const facesDado = {
    1: "⚀",
    2: "⚁",
    3: "⚂",
    4: "⚃",
    5: "⚄",
    6: "⚅"
};

const caminho = [
    { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 },
    { r: 5, c: 6 }, { r: 4, c: 6 }, { r: 3, c: 6 }, { r: 2, c: 6 }, { r: 1, c: 6 }, { r: 0, c: 6 },
    { r: 0, c: 7 },
    { r: 1, c: 8 }, { r: 2, c: 8 }, { r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 },
    { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 }, { r: 6, c: 13 }, { r: 6, c: 14 },
    { r: 7, c: 14 },
    { r: 8, c: 13 }, { r: 8, c: 12 }, { r: 8, c: 11 }, { r: 8, c: 10 }, { r: 8, c: 9 },
    { r: 9, c: 8 }, { r: 10, c: 8 }, { r: 11, c: 8 }, { r: 12, c: 8 }, { r: 13, c: 8 }, { r: 14, c: 8 },
    { r: 14, c: 7 },
    { r: 13, c: 6 }, { r: 12, c: 6 }, { r: 11, c: 6 }, { r: 10, c: 6 }, { r: 9, c: 6 },
    { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 }, { r: 8, c: 1 }, { r: 8, c: 0 },
    { r: 7, c: 0 }
];

const indicesSaida = [0, 12, 24, 36];

const retasFinais = [
    [{ r: 7, c: 1 }, { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, { r: 7, c: 5 }],
    [{ r: 1, c: 7 }, { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, { r: 5, c: 7 }],
    [{ r: 7, c: 13 }, { r: 7, c: 12 }, { r: 7, c: 11 }, { r: 7, c: 10 }, { r: 7, c: 9 }],
    [{ r: 13, c: 7 }, { r: 12, c: 7 }, { r: 11, c: 7 }, { r: 10, c: 7 }, { r: 9, c: 7 }]
];

const casasSeguras = [0, 12, 24, 36, 44, 8, 20, 32];

const bases = [
    [{ r: 1, c: 1 }, { r: 1, c: 3 }, { r: 3, c: 1 }, { r: 3, c: 3 }],
    [{ r: 1, c: 11 }, { r: 1, c: 13 }, { r: 3, c: 11 }, { r: 3, c: 13 }],
    [{ r: 11, c: 11 }, { r: 11, c: 13 }, { r: 13, c: 11 }, { r: 13, c: 13 }],
    [{ r: 11, c: 1 }, { r: 11, c: 3 }, { r: 13, c: 1 }, { r: 13, c: 3 }]
];

function pegarCasa(r, c) {
    return document.querySelector(`.casa[data-row="${r}"][data-col="${c}"]`);
}

function criarTabuleiro() {
    tabuleiro.innerHTML = "";

    for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
            const casa = document.createElement("div");
            casa.classList.add("casa");
            casa.dataset.row = r;
            casa.dataset.col = c;

            if (r <= 5 && c <= 5) casa.classList.add("vermelho-area");
            else if (r <= 5 && c >= 9) casa.classList.add("azul-area");
            else if (r >= 9 && c <= 5) casa.classList.add("verde-area");
            else if (r >= 9 && c >= 9) casa.classList.add("amarelo-area");
            else if ((r >= 6 && r <= 8) || (c >= 6 && c <= 8)) casa.classList.add("caminho");

            if (r === 7 && c >= 1 && c <= 5) casa.className = "casa vermelho-entrada";
            if (c === 7 && r >= 1 && r <= 5) casa.className = "casa azul-entrada";
            if (r === 7 && c >= 9 && c <= 13) casa.className = "casa amarelo-entrada";
            if (c === 7 && r >= 9 && r <= 13) casa.className = "casa verde-entrada";

            if (r === 6 && c === 1) casa.className = "casa vermelho-entrada segura";
            if (r === 1 && c === 8) casa.className = "casa azul-entrada segura";
            if (r === 8 && c === 13) casa.className = "casa amarelo-entrada segura";
            if (r === 13 && c === 6) casa.className = "casa verde-entrada segura";

            if (r === 8 && c === 2) casa.className = "casa caminho segura";
            if (r === 2 && c === 6) casa.className = "casa caminho segura";
            if (r === 6 && c === 12) casa.className = "casa caminho segura";
            if (r === 12 && c === 8) casa.className = "casa caminho segura";

            if (r === 6 && c === 6) casa.className = "casa centro-vermelho";
            if (r === 6 && c === 7) casa.className = "casa centro-azul";
            if (r === 6 && c === 8) casa.className = "casa centro-azul";
            if (r === 7 && c === 6) casa.className = "casa centro-vermelho";

            if (r === 7 && c === 7) {
                casa.className = "casa centro-meio";
                casa.textContent = "○";
            }

            if (r === 7 && c === 8) casa.className = "casa centro-amarelo";
            if (r === 8 && c === 6) casa.className = "casa centro-verde";
            if (r === 8 && c === 7) casa.className = "casa centro-verde";
            if (r === 8 && c === 8) casa.className = "casa centro-amarelo";

            if (r === 7 && c === 0) {
                casa.className = "casa caminho seta";
                casa.textContent = "→";
            }

            if (r === 0 && c === 7) {
                casa.className = "casa caminho seta";
                casa.textContent = "↓";
            }

            if (r === 7 && c === 14) {
                casa.className = "casa caminho seta";
                casa.textContent = "←";
            }

            if (r === 14 && c === 7) {
                casa.className = "casa caminho seta";
                casa.textContent = "↑";
            }

            tabuleiro.appendChild(casa);
        }
    }
}

function criarPecas() {
    criarPecasNoCanto(1, 1, 0, "vermelho");
    criarPecasNoCanto(1, 11, 1, "azul");
    criarPecasNoCanto(11, 11, 2, "amarelo");
    criarPecasNoCanto(11, 1, 3, "verde");
}

function criarPecasNoCanto(startRow, startCol, jogador, cor) {
    const offsets = [[0, 0], [0, 2], [2, 0], [2, 2]];

    offsets.forEach((o, i) => {
        const casa = pegarCasa(startRow + o[0], startCol + o[1]);

        const peca = document.createElement("div");
        peca.classList.add("peca", cor);
        peca.onclick = () => clicarNaPeca(jogador, i);

        casa.appendChild(peca);
        pecasDOM[jogador].push(peca);
    });
}

botaoDado.addEventListener("click", async () => {
    if (animando) return;

    if (jogoOnline && minhaCor !== jogadorAtual) {
        alert("Aguarde sua vez!");
        return;
    }

    fecharMenuDados();

    if (dadosPendentes.length > 0 && bonusGiros === 0) {
        alert("Use os dados acumulados antes de jogar de novo!");
        return;
    }

    if (bonusGiros > 0) {
        bonusGiros--;
    }

    botaoDado.classList.add("rolando");
    dadoVisual.textContent = "🎲";

    await esperar(500);

    const numero = Math.floor(Math.random() * 6) + 1;

    botaoDado.classList.remove("rolando");
    dadoVisual.textContent = facesDado[numero];

    dadosPendentes.push(numero);
atualizarPainel();
enviarEstadoOnline();

if (numero === 6) {

        seisSeguidos++;

        if (seisSeguidos >= 3) {
            pararTimerAFK();
            info.textContent = `${nomes[jogadorAtual]} tirou 6 - 6 - 6 e perdeu a vez!`;
            limparTurno();
            setTimeout(passarTurno, 1000);
            return;
        }

        bonusGiros++;
        info.textContent = `${nomes[jogadorAtual]} tirou 6! Gire de novo.`;
        return;
    }

    seisSeguidos = 0;

    const jogadas = jogadasValidas(jogadorAtual);

    if (jogadas.length === 0) {
        pararTimerAFK();
        info.textContent = `${nomes[jogadorAtual]} não tem jogada válida.`;
        limparTurno();
        setTimeout(passarTurno, 800);
        return;
    }

    info.textContent = `${nomes[jogadorAtual]}, escolha uma peça. Tempo: 15s.`;
    iniciarTimerAFK();
});

function clicarNaPeca(jogador, pecaIndex) {
    if (animando) return;

    if (jogoOnline && jogador !== minhaCor) {
        alert("❌ Essa não é sua cor!");
        return;
    }

    if (jogoOnline && jogadorAtual !== minhaCor) {
        alert("❌ Não é sua vez!");
        return;
    }

    if (jogador !== jogadorAtual) {
        alert("❌ Não é sua vez!");
        return;
    }

    if (dadosPendentes.length === 0) {
        alert("🎲 Primeiro jogue o dado!");
        return;
    }

    if (bonusGiros > 0) {
        alert("Você ainda tem giro extra. Gire o dado primeiro!");
        return;
    }

    const dadosValidos = [];

    for (let i = 0; i < dadosPendentes.length; i++) {
        if (jogadaValidaComDado(jogador, pecaIndex, dadosPendentes[i])) {
            dadosValidos.push(i);
        }
    }

    if (dadosValidos.length === 0) {
        alert("❌ Essa peça não pode usar nenhum dado acumulado!");
        return;
    }

    mostrarMenuDados(jogador, pecaIndex, dadosValidos);
}

function mostrarMenuDados(jogador, pecaIndex, dadosValidos) {
    fecharMenuDados();

    const peca = pecasDOM[jogador][pecaIndex];

    const menu = document.createElement("div");
    menu.id = "menu-dados";

    menu.style.position = "absolute";
    menu.style.left = "50%";
    menu.style.top = "-46px";
    menu.style.transform = "translateX(-50%)";
    menu.style.background = "rgba(0,0,0,0.85)";
    menu.style.border = "2px solid white";
    menu.style.borderRadius = "12px";
    menu.style.padding = "5px";
    menu.style.display = "flex";
    menu.style.gap = "5px";
    menu.style.zIndex = "9999";
    menu.style.boxShadow = "0 4px 12px rgba(0,0,0,0.7)";

    dadosValidos.forEach(dadoIndex => {
        const valor = dadosPendentes[dadoIndex];

        const botao = document.createElement("button");
        botao.textContent = `🎲${valor}`;
        botao.style.fontSize = "15px";
        botao.style.fontWeight = "bold";
        botao.style.border = "none";
        botao.style.borderRadius = "8px";
        botao.style.padding = "5px 7px";
        botao.style.cursor = "pointer";
        botao.style.background = "white";
        botao.style.color = "black";

        botao.onclick = async (e) => {
            e.stopPropagation();
            fecharMenuDados();
            await usarDadoNaPeca(jogador, pecaIndex, dadoIndex);
        };

        menu.appendChild(botao);
    });

    peca.style.position = "relative";
    peca.appendChild(menu);
}

function fecharMenuDados() {
    const menu = document.getElementById("menu-dados");

    if (menu) {
        menu.remove();
    }
}

async function usarDadoNaPeca(jogador, pecaIndex, dadoIndex) {
    if (animando) return;

    pararTimerAFK();

    const dadoUsado = dadosPendentes[dadoIndex];
    dadosPendentes.splice(dadoIndex, 1);
    atualizarPainel();

    if (progresso[jogador][pecaIndex] === -1) {
        tirarDaBase(jogador, pecaIndex);
        terminarJogada(false);
        return;
    }

    await moverPeca(jogador, pecaIndex, dadoUsado);

    const capturou = verificarCaptura(jogador, pecaIndex);
    const fezGol = progresso[jogador][pecaIndex] === GOL;

    if (capturou || fezGol) {
        bonusGiros++;
    }

    verificarVitoria(jogador);
    terminarJogada(capturou || fezGol);
}

function jogadasValidas(jogador) {
    const validas = [];

    for (let p = 0; p < 4; p++) {
        for (let d = 0; d < dadosPendentes.length; d++) {
            if (jogadaValidaComDado(jogador, p, dadosPendentes[d])) {
                validas.push(p);
                break;
            }
        }
    }

    return validas;
}

function jogadaValidaComDado(jogador, pecaIndex, dado) {
    const prog = progresso[jogador][pecaIndex];
    if (jogoOnline && jogador !== minhaCor) {
    return false;
}

    if (golsFeitos[jogador][pecaIndex]) return false;
    if (prog === GOL) return false;

    if (prog === -1) {
        return dado === 6;
    }

    return prog + dado <= GOL;
}

function tirarDaBase(jogador, pecaIndex) {

    if (jogoOnline && jogador !== minhaCor) {
        return;
    }

    progresso[jogador][pecaIndex] = 0;
    renderizarPeca(jogador, pecaIndex);
    info.textContent = `${nomes[jogador]} tirou uma peça da base!`;
}

async function moverPeca(jogador, pecaIndex, passos) {
    animando = true;

    for (let i = 0; i < passos; i++) {
        progresso[jogador][pecaIndex]++;
        renderizarPeca(jogador, pecaIndex);
        await esperar(250);
    }

    animando = false;

    if (progresso[jogador][pecaIndex] === GOL) {
        golsFeitos[jogador][pecaIndex] = true;
        renderizarPeca(jogador, pecaIndex);
        info.textContent = `⚽ GOL do ${nomes[jogador]}!`;
    }
}

function renderizarPeca(jogador, pecaIndex) {
    const prog = progresso[jogador][pecaIndex];
    const peca = pecasDOM[jogador][pecaIndex];

    if (prog === -1) {
        const base = bases[jogador][pecaIndex];
        pegarCasa(base.r, base.c).appendChild(peca);
        return;
    }

    if (prog <= 47) {
        const indiceGlobal = (indicesSaida[jogador] + prog) % caminho.length;
        const casa = caminho[indiceGlobal];
        pegarCasa(casa.r, casa.c).appendChild(peca);
        return;
    }

    if (prog >= 48 && prog <= 52) {
        const indiceReta = prog - 48;
        const casa = retasFinais[jogador][indiceReta];
        pegarCasa(casa.r, casa.c).appendChild(peca);
        return;
    }

    if (prog === GOL) {
        const base = bases[jogador][pecaIndex];
        pegarCasa(base.r, base.c).appendChild(peca);

        if (!peca.dataset.coroada) {
            peca.dataset.coroada = "true";

            const coroa = document.createElement("div");
            coroa.textContent = "👑";
            coroa.style.position = "absolute";
            coroa.style.top = "-18px";
            coroa.style.left = "50%";
            coroa.style.transform = "translateX(-50%)";
            coroa.style.fontSize = "14px";
            coroa.style.pointerEvents = "none";

            peca.style.position = "relative";
            peca.appendChild(coroa);
        }

        return;
    }
}

function verificarCaptura(jogador, pecaIndex) {
    const prog = progresso[jogador][pecaIndex];

    if (prog > 47) return false;

    const posicaoGlobal = (indicesSaida[jogador] + prog) % caminho.length;

    if (casasSeguras.includes(posicaoGlobal)) {
        return false;
    }

    let capturou = false;

    for (let outroJogador = 0; outroJogador < 4; outroJogador++) {
        if (outroJogador === jogador) continue;

        for (let outraPeca = 0; outraPeca < 4; outraPeca++) {
            const progOutro = progresso[outroJogador][outraPeca];

            if (progOutro < 0 || progOutro > 47) continue;

            const posicaoOutro = (indicesSaida[outroJogador] + progOutro) % caminho.length;

            if (posicaoOutro === posicaoGlobal) {
                mandarParaBase(outroJogador, outraPeca);
                capturou = true;
                info.textContent = `🔥 ${nomes[jogador]} capturou ${nomes[outroJogador]}!`;
            }
        }
    }

    return capturou;
}

function mandarParaBase(jogador, pecaIndex) {
    progresso[jogador][pecaIndex] = -1;
    renderizarPeca(jogador, pecaIndex);
}

function terminarJogada(ganhouGiro) {
    pararTimerAFK();

    if (ganhouGiro) {
        info.textContent += " Ganhou giro extra!";
    }

    if (dadosPendentes.length > 0) {
        const jogadas = jogadasValidas(jogadorAtual);

        if (jogadas.length > 0) {
            atualizarPainel();
            info.textContent += ` Dados restantes.`;
            iniciarTimerAFK();
            return;
        }
    }

    if (bonusGiros > 0) {
        atualizarPainel();
        info.textContent += " Gire o dado.";
        return;
    }

    limparTurno();
    passarTurno();
}

function limparTurno() {
    dadosPendentes = [];
    bonusGiros = 0;
    seisSeguidos = 0;
    pararTimerAFK();
    atualizarPainel();
}

function passarTurno() {
    limparTurno();

    jogadorAtual++;

    if (jogadorAtual > 3) jogadorAtual = 0;

    turnoTexto.textContent = nomes[jogadorAtual];
    info.textContent = `Vez de ${nomes[jogadorAtual]}.`;

    atualizarPainel();
    enviarEstadoOnline();
}
function verificarVitoria(jogador) {
    const venceu = golsFeitos[jogador].every(gol => gol === true);

    if (venceu) {
        pararTimerAFK();
        info.textContent = `🏆 ${nomes[jogador]} venceu o jogo!`;
        botaoDado.disabled = true;
    }
}

function iniciarTimerAFK() {
    pararTimerAFK();

    timerAFK = setTimeout(() => {
        const jogadas = jogadasValidas(jogadorAtual);

        if (jogadas.length === 0) {
            limparTurno();
            passarTurno();
            return;
        }

        info.textContent = `${nomes[jogadorAtual]} ficou 15s sem jogar. O jogo escolheu uma peça.`;

        const pecaEscolhida = jogadas[0];

        for (let i = 0; i < dadosPendentes.length; i++) {
            if (jogadaValidaComDado(jogadorAtual, pecaEscolhida, dadosPendentes[i])) {
                usarDadoNaPeca(jogadorAtual, pecaEscolhida, i);
                return;
            }
        }
    }, 15000);
}

function pararTimerAFK() {
    if (timerAFK) {
        clearTimeout(timerAFK);
        timerAFK = null;
    }
}

function atualizarPainel() {
    nickJogador.textContent = nomes[jogadorAtual];
    turnoTexto.textContent = nomes[jogadorAtual];

    painelJogador.classList.remove(
        "painel-vermelho",
        "painel-azul",
        "painel-amarelo",
        "painel-verde"
    );

    painelJogador.classList.add(classesPainel[jogadorAtual]);

    if (dadosPendentes.length === 0) {
        dadosAcumuladosTexto.textContent = "Dados: -";
    } else {
        dadosAcumuladosTexto.textContent = dadosPendentes.map(d => `🎲${d}`).join(" ");
    }
}

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

criarTabuleiro();
criarPecas();
atualizarPainel();
info.textContent = `Vez de ${nomes[jogadorAtual]}.`;

// ==================== LOBBY ONLINE ====================

const socket = io("https://ludo-de-louco.onrender.com");

const lobby = document.getElementById("lobby");
const nickInput = document.getElementById("nick-input");
const criarSalaBtn = document.getElementById("criar-sala");
const entrarSalaBtn = document.getElementById("entrar-sala");
const codigoSalaInput = document.getElementById("codigo-sala");
const infoSala = document.getElementById("info-sala");
const listaJogadores = document.getElementById("lista-jogadores");
const iniciarPartidaBtn = document.getElementById("iniciar-partida");

iniciarPartidaBtn.style.display = "none";

criarSalaBtn.onclick = () => {
    meuNick = nickInput.value.trim();

    if (!meuNick) {
        alert("Digite seu nick!");
        return;
    }

    socket.emit("criarSala", meuNick);
};

entrarSalaBtn.onclick = () => {
    meuNick = nickInput.value.trim();
    const codigo = codigoSalaInput.value.trim();

    if (!meuNick) {
        alert("Digite seu nick!");
        return;
    }

    if (!codigo) {
        alert("Digite o código da sala!");
        return;
    }

    socket.emit("entrarSala", { codigo, nick: meuNick });
};

iniciarPartidaBtn.onclick = () => {
    if (!minhaSala) {
        alert("Você precisa criar ou entrar em uma sala primeiro!");
        return;
    }

    socket.emit("iniciarPartida", minhaSala);
};

socket.on("salaCriada", (dados) => {
    minhaSala = dados.codigo;
    souDonoDaSala = true;
    atualizarLobby(dados);
});

socket.on("atualizarSala", (dados) => {
    minhaSala = dados.codigo;
    souDonoDaSala = socket.id === dados.dono;
    atualizarLobby(dados);
});

socket.on("erroSala", (mensagem) => {
    alert(mensagem);
});

socket.on("partidaIniciada", (dados) => {
    jogoOnline = true;

    dados.jogadores.forEach(jogador => {
        nomes[jogador.corIndex] = jogador.nick;
    });

    const eu = dados.jogadores.find(jogador => jogador.id === socket.id);

    if (eu) {
        minhaCor = eu.corIndex;
        alert(`Sua cor é: ${eu.corNome}`);
    }

    lobby.style.display = "none";
    document.getElementById("area-jogo").style.display = "block";
    document.querySelector(".controles").style.display = "block";

    atualizarPainel();
    info.textContent = `Sua cor: ${nomes[minhaCor]}. Vez de ${nomes[jogadorAtual]}.`;
});

function atualizarLobby(dados) {
    infoSala.innerHTML = `<h3>Sala: ${dados.codigo}</h3>`;

    listaJogadores.innerHTML = "<h3>Jogadores:</h3>";

    dados.jogadores.forEach((jogador, index) => {
        const cor = jogador.corNome ? ` - ${jogador.corNome}` : "";
        listaJogadores.innerHTML += `<p>${index + 1}. ${jogador.nick}${cor}</p>`;
    });

    if (souDonoDaSala && dados.jogadores.length >= 2) {
        iniciarPartidaBtn.style.display = "block";
    } else {
        iniciarPartidaBtn.style.display = "none";
    }
}
function enviarEstadoOnline() {
    if (!jogoOnline || !minhaSala) return;

    socket.emit("estadoJogo", {
        codigo: minhaSala,
        estado: {
            jogadorAtual,
            progresso,
            golsFeitos,
            dadosPendentes,
            bonusGiros,
            seisSeguidos,
            nomes,
            infoTexto: info.textContent,
            dadoTexto: dadoVisual.textContent
        }
    });
}

socket.on("estadoJogo", (estado) => {
    jogadorAtual = estado.jogadorAtual;
    progresso = estado.progresso;
    golsFeitos = estado.golsFeitos;
    dadosPendentes = estado.dadosPendentes;
    bonusGiros = estado.bonusGiros;
    seisSeguidos = estado.seisSeguidos;

    for (let i = 0; i < estado.nomes.length; i++) {
        nomes[i] = estado.nomes[i];
    }

    if (estado.infoTexto) info.textContent = estado.infoTexto;
    if (estado.dadoTexto) dadoVisual.textContent = estado.dadoTexto;

    renderizarTodasPecas();
    atualizarPainel();
});

function renderizarTodasPecas() {
    for (let jogador = 0; jogador < 4; jogador++) {
        for (let peca = 0; peca < 4; peca++) {
            renderizarPeca(jogador, peca);
        }
    }
}
