import { Actor, CollisionType, Color, Engine, Font, FontUnit, Sound, Loader, Label, Text, vec } from "excalibur"

// 1 - Criar uma instancia de Engine que representa o jogo
const game = new Engine({
	width: 800,
	height: 600
})

// 2 - Criar barra do player
const barra = new Actor({
	x: 150,
	y: game.drawHeight - 40, // game.drwHeight = altura do game
	width: 200,
	height: 20,
	color: Color.Chartreuse,

})

// CollisionType.Fixed = significa que ele nao ira se "mexer" quando colidir
barra.body.collisionType = CollisionType.Fixed

// Insere o Actor barra no game
game.add(barra)

// 3 - Movimentar a barra de acordo com a posicao do mouse
game.input.pointers.primary.on("move", (event) => {
	barra.pos.x = event.worldPos.x
})

// 4 - Criar o Actor bolinha
const bolinha = new Actor({
	x: 100,
	y: 300,
	radius: 10,
	color: Color.Red
})

// 5 - Criar movimentacao da bolinha
const velocidadeBolinha = vec(300, 500)

setTimeout(() => {
	bolinha.vel = velocidadeBolinha
}, 1000)

bolinha.body.collisionType = CollisionType.Passive

let coresBolinha = [
	Color.Black,
	Color.Chartreuse,
	Color.Cyan,
	Color.Green,
	Color.Magenta,
	Color.Orange,
	Color.Red,
	Color.Rose,
	Color.White,
	Color.Yellow
]

let numeroCores = coresBolinha.length

// 6 - Fazer a bolinha rebater na parede
bolinha.on("postupdate", () => {
	// Se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = velocidadeBolinha.x
	}


	// Se a bolinha colidir com o lado direito
	if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = -velocidadeBolinha.x
	}


	// Se a bolinha colidir com a parte superior
	if (bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = velocidadeBolinha.y
	}


	// Se a bolinha colidir com a parte inferior
	////if (bolinha.pos.y + bolinha.height / 2 > game.drawHeight) {
	//bolinha.vel.y = -velocidadeBolinha.y
	//}
})

// 7 - Criar os blocos
// Configuracoes de tamanho e espacamento dos blocos
const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [Color.Red, Color.Orange, Color.Yellow]

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
//const larguraBloco = 136
const alturaBloco = 30

const listaBlocos: Actor[] = []

//Renderizacao dos bloquinhos

// Renderiza 3 linhas
for (let j = 0; j < linhas; j++) {

	//Renderiza 5 bloquinhos
	for (let i = 0; i < colunas; i++) {
		listaBlocos.push(
			new Actor({
				x: xoffset + i * (larguraBloco + padding) + padding,
				y: yoffset + j * (alturaBloco + padding) + padding,
				width: larguraBloco,
				height: alturaBloco,
				color: corBloco[j]
			})
		)
	}
}



listaBlocos.forEach(bloco => {
	// Define o tipo de colisor de cada bloco
	bloco.body.collisionType = CollisionType.Active

	// Adiciona cada bloco no game
	game.add(bloco)
})

// Adicionando a pontuacao
let pontos = 0

// Label = Text + Actor
const textoPontos = new Label({
	text: pontos.toString(),
	font: new Font({
		size: 40,
		color: Color.White,
		strokeColor: Color.Black,
		unit: FontUnit.Px
	}),
	pos: vec(600, 500)
})

game.add(textoPontos)
//const textoPontos = new Text({
//text: "Hello World",
//font: new Font({ size: 20 })
//})

//const objetoTexto = new Actor({
//x: game.drawWidth - 80,
//y: game.drawHeight - 15
//})

//objetoTexto.graphics.use(textoPontos)

//game.add(objetoTexto)

let colidindo: boolean = false

bolinha.on("collisionstart", (event) => {

	// Verifcar se a bolinha colidiu com algum bloco destrutivel
	console.log("Colidiu com", event.other.name);

	if (listaBlocos.includes(event.other)) {
		// Destruir o bloco colidido
		event.other.kill()
		// Executar o som
		baleandoblocoSound.play(1.0)

		// Adiciona um ponto
		pontos++

		// Mudar a cor da bolinha
		bolinha.color = coresBolinha[Math.trunc(Math.random() * numeroCores)]

		// Math.random -> 0 - 1 * numeroCores -> 10
		// 0.5 * 10 = 5
		//0.3 * 10 = 3
		//0.873 * 10 = 8.73

		//Math.trunc() -> Retorna somente a porcao inteira de um numero

		// Muda a cor da bolinha com a cor do bloco atingido por ela
		bolinha.color = event.other.color


		// Se acabarem os blocos, mostrar mensagem de vitoria
		if (pontos == 15) {
			alert("Bom, trabalho, soldado!!! ^-^")
			window.location.reload()
		}

		// Atualiza o valor do placar - TextoPontos
		textoPontos.text = pontos.toString()

		console.log(pontos);

	}

	// Rebater a bolinha - Inverter as direcoes 
	let interseccao = event.contact.mtv.normalize()

	// Se nao esta colidindo
	// !colidindo -> e a mesma coisa que colidindo == false
	if (colidindo == false) {
		colidindo = true
		// interseccao.x e interseccao.y
		// O maoir representa o eixo onde houve o contato
		if (Math.abs(interseccao.x) > Math.abs(interseccao.y)) {
			//bolinha.vel.x = -bolinha.vel.x 
			//bolinha.vel.x *= -1
			bolinha.vel.x = bolinha.vel.x * -1
		} else {
			//bolinha.vel.y = -bolinha.vel.y 
			//bolinha.vel.y *= -1
			bolinha.vel.y = bolinha.vel.y * -1
		}
	}

})

bolinha.on("collisionend", () => {
	colidindo = false
	pancadaSound.play(1.0)
})

bolinha.on("exitviewport", () => {

	fuckshitSound.play(1.0)
		.then(() => {
			gameoverSound.play(1.0);

		})
		.then(() => {
			alert("SIFU-DEU HERMANO, QUE TISTREZA!!! ._.")
			window.location.reload()
		})


})

// Adiciona som ao game
const pancadaSound = new Sound('/sound_effects/330316-Impact_Metal_Pole_Square_Medium_Muted_Wide_Hard_05.wav');
const baleandoblocoSound = new Sound('/sound_effects/M4A1_-Single_Shot_-Interior-05.wav');

const fuckshitSound = new Sound('/sound_effects/Defeat-Fuck_Shit-Medium_Distant.wav');
const gameoverSound = new Sound('/sound_effects/Death-Game-Over-5.wav');

const loader = new Loader([pancadaSound, baleandoblocoSound, fuckshitSound, gameoverSound]);


// Insere a bolinha no game
game.add(bolinha)

// Inicia o game
await game.start(loader);
