# Code Hack

Landing page do hackathon do Code Club, feita com **HTML, CSS e JavaScript**, sem framework ou etapa de compilação.

## Como rodar localmente

### Requisitos

- Python 3 para iniciar o servidor local.
- Um navegador atualizado.
- Internet para carregar as fontes do Google Fonts e o mapa do Google Maps.

Não é necessário instalar pacotes com `npm` nem configurar banco de dados ou variáveis de ambiente.

### Iniciar a página

Abra um terminal **na pasta do projeto**, onde está o arquivo `index.html`, e execute:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

No Windows, se o comando `python` não estiver disponível, tente:

```powershell
py -m http.server 4173 --bind 127.0.0.1
```

Abra **[http://127.0.0.1:4173](http://127.0.0.1:4173)** no navegador. Mantenha o terminal aberto enquanto usar a página. Para encerrar o servidor, pressione **Ctrl + C**.

Se a porta estiver ocupada, troque `4173` por `4174` no comando e acesse `http://127.0.0.1:4174`.

## Estrutura do projeto

```text
landingpage-codehack/
├── index.html       # Conteúdo e estrutura da página
├── styles.css       # Estilos gerais e componentes
├── campaign.css     # Personalizações visuais mais recentes
├── script.js        # Animações, carrossel, contador, menu e FAQ
├── favicon.svg      # Ícone {i} da aba do navegador
├── assets/          # Logos, ilustrações e fontes dos recursos
├── exports/         # Banner em PNG, SVG e HTML
├── dist/            # Cópia estática preparada para publicação
├── outputs/         # Capturas de conferência; ignoradas pelo Git
└── PRODUCT.md       # Contexto e requisitos do projeto
```

`campaign.css` é carregado depois de `styles.css`, portanto suas regras podem sobrescrever os estilos gerais. As referências das imagens e marcas estão em [assets/SOURCES.md](assets/SOURCES.md).

## Como editar

1. Altere os textos e as seções em `index.html`.
2. Ajuste os estilos em `styles.css` ou `campaign.css`.
3. Altere os comportamentos em `script.js`.
4. Coloque novos arquivos de imagem em `assets/`.
5. Salve e atualize o navegador. O servidor do Python não recarrega a página automaticamente.

Se uma alteração visual não aparecer, use **Ctrl + F5** para atualizar sem o cache.

## Comportamentos da página

- **Menu:** navegação resumida no computador e menu expansível no celular.
- **Crachás:** passagem automática em telas de até 760 px, com rolagem manual e pausa durante a interação. A reprodução respeita a preferência de reduzir movimentos e para quando a faixa sai da tela.
- **Perguntas frequentes:** abrem ao passar o mouse e também funcionam por clique, toque e teclado.
- **Localização:** mapa incorporado do Inteli e link para abrir a rota no Google Maps.
- **Inscrições:** os botões “Quero participar” abrem a pergunta sobre inscrições. Ainda não há formulário de inscrição integrado.

### Contador demonstrativo

O contador é **fictício**: começa com 20 dias, 8 horas e 30 minutos e não é calculado a partir da data do evento exibida na página.

O prazo fica salvo no `localStorage` do navegador para continuar contando após recarregar. Para reiniciá-lo, abra o console do navegador na página do projeto e execute:

```javascript
localStorage.removeItem('codehack-demo-countdown-v1');
location.reload();
```

Para ajustar a duração, procure por `const duration` no bloco do contador em `script.js`.

## Preparar para publicação

A hospedagem deste projeto está configurada para servir a pasta **`dist/`**. Depois de editar os arquivos da raiz, atualize essa cópia. No PowerShell, execute na pasta do projeto:

```powershell
New-Item -ItemType Directory -Path dist/assets -Force | Out-Null
Copy-Item index.html, styles.css, campaign.css, script.js, favicon.svg -Destination dist -Force
Copy-Item assets/* -Destination dist/assets -Recurse -Force
```

Para conferir exatamente a versão de publicação:

```powershell
python -m http.server 4174 --bind 127.0.0.1 --directory dist
```

Acesse **[http://127.0.0.1:4174](http://127.0.0.1:4174)**. Em uma hospedagem estática, use `dist` como diretório publicado; não há comando de build.

## Banner

O banner tem **1600 × 400 px** e está disponível em:

- [PNG pronto para uso](exports/code-hack-banner.png).
- [SVG editável](exports/code-hack-banner.svg).
- [HTML usado na renderização](exports/code-hack-banner.html).

As fontes usadas na arte são DM Sans e Space Mono. Os arquivos de `exports/` são entregáveis separados da página e não são copiados automaticamente para `dist/`.
