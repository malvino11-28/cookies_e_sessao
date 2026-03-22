import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

const host = "0.0.0.0";
const port = 3000;
const app = express();

var dadosProdutos = [];
var logado;

// sessão deverá ser parametrizada (escolher o comportamento desejado)
app.use(
  session({
    secret: "secret",
    resave: true, // a cada requisição, a sessão se manterá salva
    saveUninitialized: true, // mesmo sem informação, sessões vazias serão criadas
    cookie: {
      secure: false, // false para desenvolvimento, true para produção (HTTPS)
      httpOnly: true, // Apenas paginas http terão acessos ao cookie
      maxAge: 1000 * 60 * 15, // 15 minutos
    }, // cookie acompanha as requisições
  }),
);

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.get("/", verificaLogin, (req, res) => {
  res.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
      crossorigin="anonymous"
    />
    <title>Document</title>
  </head>
  <body>
    <div
      class="d-flex justify-content-center mw-100 mt-5"
      style="max-width: 580px"
    >
      <div class="d-flex row gap-3">
        <a href="/cadastro">
          <button type="button" class="btn btn-primary btn-lg">
            CADASTRAR PRODUTO
          </button>
        </a>
        <a href="/login">
          <button type="button" class="btn btn-secondary btn-lg">LOGIN</button>
        </a>
        <a href="/logout">
          <button type="button" class="btn btn-primary btn-lg" name="log">
            LOGOUT
          </button>
        </a>
        <a href="/lista">
          <button type="button" class="btn btn-secondary btn-lg">
            VER LISTA DE PRODUTOS
          </button>
        </a>
      </div>
    </div>
  </body>
  <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
    crossorigin="anonymous"
  ></script>
</html>
  `);
});

app.get("/cadastro", (req, res) => {
  if (req.session?.logado) {
    res.send(`<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
      crossorigin="anonymous"
    />
  </head>

  <body>
    <div class="form-row mx-auto text-center m-5 container">
      <form method="POST" action="/produto">
        <h1>Informações</h1>

        <label class="label--desc">CADASTRO DE PRODUTO</label>

        <div class="form-row">
          <div class="name">Código de Barras</div>
          <div class="input-group mb-3">
            <input class="form-control" type="text" name="codigo" placeholder="" />
          </div>
        </div>

        <div class="form-row">
          <div class="name">Descrição do Produto</div>
          <div class="input-group mb-3">
            <input class="form-control" type="text" name="desc" />
          </div>
        </div>

        <div class="form-row">
          <div class="name">Preço de Custo</div>
          <div class="input-group mb-3">
            <input class="form-control" type="text" name="precusto" />
          </div>
        </div>

        <div class="form-row">
          <div class="name">Preço de Venda</div>
          <div class="input-group mb-3">
            <input class="form-control" type="text" name="prevenda" placeholder="" />
          </div>
        </div>

        <div class="form-row">
          <div class="name">Data de Validade</div>
          <div class="input-group mb-3">
            <input class="form-control" type="date" name="data" />
            <label class="label--desc"></label>
          </div>
        </div>

        <div class="form-row">
          <div class="name">Quantidade em Estoque</div>
          <div class="input-group mb-3">
            <input class="form-control" type="text" name="qtd" />
          </div>
        </div>

        <div class="form-row">
          <div class="name">Nome do Fabricante</div>
          <div class="input-group mb-3">
            <input class="form-control" type="text" name="fabri" />
          </div>
        </div>

        <div>
          <button class="btn btn-success" type="submit">Registrar</button>
        </div>
      </form>
    </div>
  </body>
  <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
    crossorigin="anonymous"
  ></script>
</html>
  `);
  } else {
    res.send(`
    <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
        <div class="container mt-5 text-center">
          <div class="alert alert-danger">
            <h3>Login necessário!</h3>
            <p>Você precisa estar logado para acessar essa página.</p>
          </div>

          <a href="/login" class="btn btn-primary">Ir para login</a>
        </div>
      </body>
    </html>
    `);
  }
});

app.get("/logout", verificaLogin, (req, res) => {
  res.send(`
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    <div class="container mt-5 text-center">
      <div class="alert alert-info">
        <h3>Logout efetuado com sucesso!</h3>
      </div>
      <a href="/" class="btn btn-primary">Voltar para a tela de Login</a>
    </div>
  `);
  req.session.destroy();
});

app.get("/login", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
      crossorigin="anonymous"
    />
  </head>

  <body>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <form method="POST" action="/login_ver" class="border p-4 rounded shadow">
            <h1 class="text-center mb-4">LOGIN</h1>

            <div class="mb-3">
              <label class="form-label">E-mail</label>
              <input
                class="form-control"
                type="text"
                name="email"
                placeholder="exemplo@exemplo.com"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Senha</label>
              <input
                class="form-control"
                type="password"
                name="senha"
                placeholder="*****"
              />
            </div>

            <div class="d-grid">
              <button class="btn btn-success" type="submit">Entrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
      crossorigin="anonymous"
    ></script>
  </body>
</html>`);
});

app.post("/login_ver", (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  if (!email || !senha) {
    let login = `
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  </head>
  
  <body>
<div class="container mt-5">
  <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
  <form method="POST" action="/login_ver"> 
  <h1>LOGIN</h1>
    
        </div> <div class="form-row">
            <div class="name">E-mail</div>
            <div class="input-group mb-3">
                <input class="form-control" type="text" name="email" placeholder="exemplo@exemplo.com" />
            `;
    if (!email) {
      login += `<div class="alert alert-warning" role="alert">
  Preencha o seu e-mail!
</div>`;
    }
    login += `</div>
        </div>
        </div> <div class="form-row">
            <div class="name">Senha</div>
            <div class="input-group mb-3">
                <input class="form-control" type="password" name="senha" placeholder="*****" />`;
    if (!senha) {
      login += `<div class="alert alert-warning" role="alert">
      Preencha uma senha!
</div>`;
    }
    login += `</div>
            
            <div>
                <button class="btn btn-success" type="submit">Entrar</button>
            </div>
        </div>
         </form>
          </div>
          </div>
          </div>
  
  </body>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>`;
    res.write(login);
    res.end();
  } else {
    // validação estática
    if (email == "admin@test.com.br" && senha == "admin") {
      req.session.logado = true; // cria info de que usuario esta logado
      // adicionar cookie com os dados do ultimo acesso
      const dataUltimoAcesso = new Date();
      res.cookie("dataUltimoAcesso", dataUltimoAcesso.toLocaleString(), {
        maxAge: 100 * 60 * 60 * 24 * 30,
        httpOnly: true,
      });
      res.redirect("/");
    }
    res.end();
  }
});

app.post("/produto", verificaLogin, (req, res) => {
  const codigo = req.body.codigo;
  const desc = req.body.desc;
  const precusto = req.body.precusto;
  const prevenda = req.body.prevenda;
  const data = req.body.data;
  const qtd = req.body.qtd;
  const fabri = req.body.fabri;

  if (!codigo || !desc || !precusto || !prevenda || !data || !qtd || !fabri) {
    let html = `<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  </head>
  
  <body>
  <div class="form-row mx-auto text-center m-5 container">
    <form method="POST" action="/produto">
      <h1>Informações</h1>
      <label class="label--desc">CADASTRO DE PRODUTO</label>
    
      <div class="form-row">
        <div class="name">Código de Barras</div>
        <div class="input-group mb-3">
          <input class="form-control" type="text" name="codigo" value="${codigo || ""}" />
        </div>`;
    if (!codigo) {
      html += `<div class="alert alert-warning" role="alert">
  Preencha o código de barras!
</div>`;
    }

    html += `
      </div>

      <div class="form-row">
        <div class="name">Descrição do Produto</div>
        <div class="input-group mb-3">
          <input class="form-control" type="text" name="desc" value="${desc || ""}" />
        </div>`;
    if (!desc) {
      html += `<div class="alert alert-warning" role="alert">
  Preencha a descrição do produto!
</div>`;
    }

    html += `
      </div>

      <div class="form-row">
        <div class="name">Preço de Custo</div>
        <div class="input-group mb-3">
          <input class="form-control" type="text" name="precusto" value="${precusto || ""}" />
        </div>`;
    if (!precusto) {
      html += `<div class="alert alert-warning" role="alert">
  Preencha o preço de custo!
</div>`;
    }

    html += `
      </div>

      <div class="form-row">
        <div class="name">Preço de Venda</div>
        <div class="input-group mb-3">
          <input class="form-control" type="text" name="prevenda" value="${prevenda || ""}" />
        </div>`;
    if (!prevenda) {
      html += `<div class="alert alert-warning" role="alert">
  Preencha o preço de venda!
</div>`;
    }

    html += `
      </div>

      <div class="form-row">
        <div class="name">Data de Validade</div>
        <div class="input-group mb-3">
          <input class="form-control" type="date" name="data" value="${data || ""}" />
        </div>`;
    if (!data) {
      html += `<div class="alert alert-warning" role="alert">
  Preencha a data de validade!
</div>`;
    }

    html += `
      </div>

      <div class="form-row">
        <div class="name">Quantidade em Estoque</div>
        <div class="input-group mb-3">
          <input class="form-control" type="text" name="qtd" value="${qtd || ""}" />
        </div>`;
    if (!qtd) {
      html += `<div class="alert alert-warning" role="alert">
  Preencha a quantidade em estoque!
</div>`;
    }

    html += `
      </div>

      <div class="form-row">
        <div class="name">Nome do Fabricante</div>
        <div class="input-group mb-3">
          <input class="form-control" type="text" name="fabri" value="${fabri || ""}" />
        </div>`;
    if (!fabri) {
      html += `<div class="alert alert-warning" role="alert">
  Preencha o nome do fabricante!
</div>`;
    }

    html += `
      </div>
            
      <div>
        <button class="btn btn-success" type="submit">Registrar</button>
      </div>
    </form>
  </div>
  
  </body>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</html>
    `;

    res.write(html);
    res.end();
  } else {
    dadosProdutos.push({
      codigo: codigo,
      desc: desc,
      precusto: precusto,
      prevenda: prevenda,
      data: data,
      qtd: qtd,
      fabri: fabri,
    });
    res.redirect("/lista");
  }
});

app.get("/lista", verificaLogin, (req, res) => {
  const ultimoAcesso = req.cookies?.dataUltimoAcesso || "Não houve acessos";
  res.write(`<html lang="pt-br">
    <head>
      <meta charset="utf-8">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    </head>

    <body>
      <div class="container mt-5">
        <table class="table table-dark table-striped-columns">
          <thead>
            <tr>
              <th scope="col">Código de Barras</th>
              <th scope="col">Descrição</th>
              <th scope="col">Preço de Custo</th>
              <th scope="col">Preço de Venda</th>
              <th scope="col">Data de Validade</th>
              <th scope="col">Qtd em Estoque</th>
              <th scope="col">Fabricante</th>
            </tr>
          </thead>
          <tbody>`);

  for (let i = 0; i < dadosProdutos.length; i++) {
    const produto = dadosProdutos[i];
    res.write(`<tr>
      <td>${produto.codigo}</td>
      <td>${produto.desc}</td>
      <td>${produto.precusto}</td>
      <td>${produto.prevenda}</td>
      <td>${produto.data}</td>
      <td>${produto.qtd}</td>
      <td>${produto.fabri}</td>
    </tr>`);
  }

  res.write(`
          </tbody>
        </table>
        <a href="/" class="btn btn-success">Voltar para o menu</a>`);

  res.write(`
    <p class="mt-5 mb-3 text-body-secondary">Último acesso: ${ultimoAcesso}</p>
    `);
  res.write(`
    </div> 
    </body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
  </html>
  `);

  res.end();
});

// middleware
function verificaLogin(req, res, next) {
  if (req.session?.logado) {
    // '?' -> verifica se a informação existe
    next();
  } else res.redirect("/login");
}

app.listen(port, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});
