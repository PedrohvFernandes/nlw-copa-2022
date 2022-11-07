# NLW-Copa 2022 - Rocketseat <img  align='center' width='100px' src='https://yt3.ggpht.com/ytc/AKedOLQkXnYChXAHOeBQLzwhk1_BHYgUXs6ITQOakoeNoQ=s176-c-k-c0x00ffffff-no-rj'/>

<p align='center'>
  <img src=''/>
</p>

## Sobre:

### Quer fazer apostas com seus amigos ? Pois bem, ai vem o app a onde vocês podem criar bolões e chamar seus amigos para participar através de um codigo gerado no momento da criação no bolão. Vocês terão total controle de quem esta participando, quem é dono do bolão, pra qual data é o jogo, o nome do bolão

## 🔖 Layout, prototipo e demonstração de como sera feito a aplicação

- [Prototipo](<https://www.figma.com/file/kljGN04X1AskPMV4o5pqbo/Bolão-da-Copa-(Community)?node-id=0%3A1>)

## 🌐 Demonstração do app na web e mobile:

### Web:
<img src='https://github.com/PedrohvFernandes/NLW-eSports-Ignite/blob/main/screenshot/screens/web/Screen1.png'/>

### Mobile:
<img width='300' src='https://github.com/PedrohvFernandes/NLW-eSports-Ignite/blob/main/screenshot/screens/Mobile/Screen1.jpeg'/>

## ✨Tecnologias:

### Principais Stacks:

- React
- ReactNative
- Expo
- TypeScript
- Node
- NextJs
- fastify
- Sqlite
- JWT(Geração de token)
- Axios

### Secundarias Stacks:

- TailwindCSS
- Prisma(ORM)
- country-list
- Phosphor icons
- native-base
- country-list
- dayjs
- zod

## 🛠️ Features:

- Cadastro de bolões sem um usuario pela web / com usuario pelo mobile
- Listagens dos bolões
- Auth com o google
- Compartilhar o codigo do bolão para conseguir participar

## 🛠️ Futuras Features e Atualizações:

## Getting started

#### Para clonar o projeto e abrir na pasta raiz dele.
```
  git clone https://github.com/PedrohvFernandes/nlw-copa-2022
  cd nlwcopamobile - para a aplicação Mobile
  cd web - para a aplicação Web
  cd server - para a aplicação Server
  
```

#### Inicie o comando abaixo no terminal para instalar as dependencias em cada uma das aplicações
```
  npm install
```
### Mobile:

#### Axios para mobile: src/services/api.ts alterar a url da API localmente
```
   baseURL: 'http://IPDASUAMAQUINA:3333'
   cmd>ipconfig>ipv4 / cd nlwcopamobile expo start>Metro waiting on exp://192.168.15.111:19000
```

#### CLIENT_ID no .env.example: CLIENT_ID=EXAMPLE.apps.googleusercontent.com --> ID do cliente OAuth no console da google
```
  https://console.cloud.google.com/apis/credentials?project=teak-runner-367617
  
  Apos fazer o ID, na raiz da pasta nlwcopamobile -> cd nlwcopamobile>new file> .env>CLIENT_ID=EXAMPLE.apps.googleusercontent.com
```

### Server:

#### DATABASE_URL="file:./dev.db" variavel de embiente(.env na raiz da aplicação web) pro prisma conseguir acessar o banco de dados. Nesse projeto foi utilizado o 
sqlite localmente, por conta disso não tem restrição de compartilhar, mas caso usar um serviço pro banco de dados / um banco de dados real NÃO SUBIR O 
.ENV PARA O GITHUB
```
  cd web>new file>.env>DATABASE_URL="file:./dev.db"
```

#### no src/server.ts comente //0.0.0.0 se for usar o web e caso for usar o android pra ver a interface mobile descomente 0.0.0.0 
```
  // Para a web
  await fastify.listen({
    port: 3333,
    // host: '0.0.0.0'
  })
  
  // Para mobile
  await fastify.listen({
    port: 3333,
    host: '0.0.0.0'
  })
```

### Web, mobile e server:

#### Inicie o comando abaixo no terminal para ver a interface localmente(Localhost:${PORTA}) server e web
```
  npm run dev 1°no server
  npm run dev 2°na web
    ex para web apos o comando: http://localhost:3000 > colar em um navegador e verá a interface da pagina 
```

#### Inicie o comando abaixo no terminal para ver a interface localmente(Localhost:${PORTA}) mobile
```
  expo start
    Usar o expo go para escanear qrcode no terminal e ver a interface / usar o android studio
```


## 👨‍💻 Autor:

- Linkedin: https://www.linkedin.com/in/pedro-henrique-vieira-fernandes
- Git: https://github.com/PedrohvFernandes
- Instagram: pedro17fernandes
- portfolio: PedrohvFernandes.github.io
