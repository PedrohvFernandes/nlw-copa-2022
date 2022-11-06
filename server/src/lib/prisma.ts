//singleton --> pattern de projeto, a onde a gente consegue fazer com que uma info  ela não precisa ser recriada e sim reaproveitada entre os demais arquivos da aplicação. Então o node, o sistema de modules de arquivos do js, ele toda vez que a gente importa o mesmo arquivo, mesmo que este mesmo arquivo ja esteja sendo importado em varios arquivos ao mesmo tempo, ele reaproveita, digamos que ele não executa o codigo de novo. Ou seja, se eu importar a conexão com o banco do prisma em 50 arquivos ele vai reutilizar a mesma conexao com o banco em demais arquivos que eu importar o prisma. Com isso, o prisma foi separado dos demais em um so arquivo, para somente importar
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  // O prisma vai dar um log de todas as querys que foram feitas no banco de dados
  log: ['query']
})