<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ludo De Loucos 🎲</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Ludo De Loucos 🎲</h1>

    <div id="lobby">
        <h2>Entrar no jogo 🎲</h2>

        <input id="nick-input" placeholder="Digite seu nick">

        <button id="criar-sala">Criar Sala</button>

        <input id="codigo-sala" placeholder="Código da sala">
        <button id="entrar-sala">Entrar na Sala</button>

        <div id="info-sala"></div>
        <div id="lista-jogadores"></div>

        <button id="iniciar-partida">
            🚀 Iniciar Partida
        </button>
    </div>

    <div id="area-jogo" style="display:none;">
        <div id="tabuleiro"></div>

        <div id="painel-jogador" class="painel-vermelho">
            <div id="dados-acumulados">Dados: -</div>
            <div id="nick-jogador">Vermelho</div>

            <button id="dado">
                <span id="dado-visual">🎲</span>
            </button>
        </div>
    </div>

    <div class="controles">
        <p id="resultado"></p>
        <p id="turno">Turno: <span id="jogador-atual">Vermelho</span></p>
        <p id="info">Vez de Vermelho.</p>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script src="script.js"></script>
</body>
</html>
