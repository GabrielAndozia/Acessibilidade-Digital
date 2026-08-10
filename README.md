# FigureForge — Marketplace de Action Figures com Acessibilidade

**Pesquisa de Acessibilidade Digital — Dimensão A: Ferramentas de Teste e Diagnóstico**
Instituto J&F — Escola de Tecnologia · DAD 2026

## Integrantes

- Caio Eiken Chinen França
- Enzo D'angio Mota
- Gabriel Andozia Pinheiro Masagão
- Guilherme Guedes Montoni
- Yasmin Benevenuto Holando

---

## Sobre este projeto

Esta pesquisa investiga a **Dimensão A — Ferramentas de Teste e Diagnóstico**, guiada pela pergunta central: **como os desenvolvedores descobrem, medem e corrigem falhas de acessibilidade em produtos digitais?**

A entrega tem duas partes complementares:

1. **A pesquisa** — levantamento e comparação das ferramentas de auditoria (Lighthouse, axe-core, WAVE e NVDA), com uma auditoria prática aplicada a um site real.
2. **O MVP** — o **FigureForge**, um marketplace funcional de action figures construído do zero seguindo as diretrizes **WCAG 2.1 AA**, aplicando na prática o que a pesquisa apontou. Além da loja, o site permite criar action figures personalizadas com IA via Hugging Face e possui uma área de conscientização para desenvolvedores.

O MVP é **Full Stack** e usa **JavaScript Vanilla, HTML semântico, CSS com foco em A11y, backend e banco de dados** — sem frameworks de frontend, de propósito.

> Para a apresentação técnica e a divisão em cinco entregas do time, veja
> [docs/GUIA_DE_APRESENTACAO.md](docs/GUIA_DE_APRESENTACAO.md) e [docs/PLANO_DE_COMMITES.md](docs/PLANO_DE_COMMITES.md).

---

## O que descobrimos (principais achados)

- O relatório **WebAIM Million 2024** aponta que **95,9%** das home pages analisadas apresentaram falhas de acessibilidade detectáveis automaticamente — erros básicos que continuam frequentes até em sites grandes e populares. *(WebAIM, 2024)*

- **Ferramentas automáticas não substituem testes manuais.** Lighthouse, axe-core e WAVE encontram problemas técnicos e estruturais com rapidez, mas não reproduzem a experiência real de quem usa leitor de tela ou navega apenas por teclado. Estima-se que a detecção automática cubra cerca de **30% a 40%** dos problemas reais. *(Deque Systems)*

- **Cada ferramenta enxerga um pedaço diferente.** O Lighthouse detecta contraste, alt text e semântica básica, mas não pega ARIA inválido nem falhas de fluxo de navegação — para isso é preciso complementar com o axe DevTools.

- O **NVDA** é indispensável para validar a ordem real de leitura, a clareza dos rótulos anunciados e o comportamento do foco do teclado. *(NV Access)*

- O **PicPay Empresas** obteve score **89 de acessibilidade** no Lighthouse (desktop, 25/04/2026), mas ainda apresenta falhas concretas de severidade alta: botões sem nome acessível e links sem texto compreensível no carrossel de cards. *(auditoria própria)*

- **Acessibilidade não é só para deficiência visual** — inclui motricidade reduzida (navegação por teclado), deficiência cognitiva (linguagem clara) e deficiência auditiva (legendas).

- **Decisões de acessibilidade precisam vir desde o início.** HTML semântico, nomes acessíveis, headings corretos, landmarks e formulários bem estruturados são escolhas de construção, não correção tardia. *(Deque University)*

- **A Lei 13.146/2015 (LBI) obriga** sites brasileiros a serem acessíveis, com penalidades reais.

---

## Ferramentas de teste e diagnóstico

### Comparativo rápido

| Ferramenta | Tipo | O que detecta bem | O que NÃO detecta |
|---|---|---|---|
| **Google Lighthouse** | Automática | Contraste, alt text, labels, landmarks, ordem de headings, nomes acessíveis | ARIA roles inválidos, navegação por teclado, fluxo lógico |
| **axe DevTools / axe-core** | Automática | ARIA inválido, tabindex errado, fieldsets ausentes, violações com orientação de correção | Contexto semântico, experiência real do usuário |
| **WAVE** | Automática visual | Headings fora de ordem, links vazios, tabelas sem `th`, erros no contexto do layout | Componentes dinâmicos, SPAs, conteúdo gerado por JS |
| **NVDA** | Manual | Experiência completa do usuário cego: ordem de leitura, foco, clareza dos rótulos | Não é automático — exige tempo, prática e interpretação humana |

---

### Lighthouse

Ferramenta de auditoria do ecossistema Chrome que avalia páginas em acessibilidade, desempenho, SEO e boas práticas. Foi importante nesta pesquisa por gerar uma análise rápida com score e lista objetiva de falhas.

**Como usar:**
1. Abrir o site no Google Chrome
2. Pressionar `F12` para abrir o DevTools
3. Ir até a aba **Lighthouse**
4. Marcar a categoria **Accessibility**
5. Clicar em **Analyze page load**

**Limitação principal:** score alto não significa acessibilidade completa. A pontuação vem de auditorias automáticas com critérios específicos e não substitui teste manual.

---

### axe-core / axe DevTools

Engine open source de testes automatizados de acessibilidade, amplamente usada para verificar conformidade com as WCAG. Pode ser usada por extensão de navegador, testes automatizados ou integração em pipelines de CI.

**Limitação principal:** não substitui a validação manual da experiência de navegação real.

---

### WAVE

Ferramenta da WebAIM que marca visualmente na própria página onde estão erros, alertas, headings e landmarks. É útil porque mostra **onde** o problema aparece no layout, não apenas **qual** regra foi violada.

**Limitação principal:** não simula uso real com teclado ou leitor de tela.

---

### NVDA

Leitor de tela gratuito e open source para Windows. Diferente das outras ferramentas, não faz auditoria de código: permite **experimentar** a interface como uma pessoa com deficiência visual a experimenta — ordem real de leitura, clareza dos rótulos, qualidade da navegação por teclado e coerência do foco.

**Limitação principal:** exige mais tempo, prática e interpretação humana.

---

## Demonstração prática — Relatório de acessibilidade do PicPay Empresas

**Site analisado:** [picpay.com/empresas](https://picpay.com/empresas)
**Data da análise:** 25/04/2026
**Ferramenta:** Lighthouse (Google Chrome DevTools) · **Modo:** Desktop

### Scores obtidos

| Categoria | Score |
|---|---:|
| Desempenho | 86 |
| **Acessibilidade** | **89** |
| Práticas recomendadas | 100 |
| SEO | 92 |

O score **89** é um resultado bom, mas insuficiente para considerar a página plenamente acessível. Na documentação do Lighthouse, scores entre **50 e 89** ficam na faixa intermediária, enquanto **90 a 100** representam a faixa "boa". Ainda assim, a própria ferramenta não afirma que nota alta garante acessibilidade total.

---

### Erro 1 — Botões sem nome acessível

**Categoria:** Nomes e etiquetas · **Impacto:** Alto · **Critério WCAG:** 4.1.2 — Nome, Função, Valor

**Elementos com falha:**
```html
<!-- Botão de retroceder no carrossel -->
<button class="button card-carousel__backward" disabled="" data-gtm-button-decorated="true">

<!-- Botão de avançar no carrossel -->
<button class="button card-carousel__forward" data-gtm-button-decorated="true">
```

**Por que isso é um problema:** quando um usuário de leitor de tela chega nesses botões, o sistema anuncia apenas "botão", sem informar a função. Isso compromete a navegação e a compreensão da interface.

**Proposta de correção:**
```html
<button
  class="button card-carousel__backward"
  disabled=""
  data-gtm-button-decorated="true"
  aria-label="Retroceder cards">
</button>

<button
  class="button card-carousel__forward"
  data-gtm-button-decorated="true"
  aria-label="Avançar cards">
</button>
```

---

### Erro 2 — Links sem nome compreensível

**Categoria:** Nomes e etiquetas · **Impacto:** Alto · **Critério WCAG:** 2.4.4 — Propósito do link

**Elementos com falha:**
```html
<a href="https://blog.picpay.com/pro-labore/" role="button"
   data-gtm-name="PRO_LABORE_O_QUE_E_E_COMO_E_O_CALCULO_DIA_A_DIA"
   data-gtm-button-decorated="true">
</a>

<a href="https://blog.picpay.com/cofrinho-pj/" role="button"
   data-gtm-name="COFRINHO_PJ_DO_PICPAY_COMO_USAR_ESSE_NOVO_ALIADO_DA_SUA_EMPRESA"
   data-gtm-button-decorated="true">
</a>
```

**Por que isso é um problema:** esses links não têm texto visível nem nome acessível. O atributo `data-gtm-name` serve para analytics, não para acessibilidade. Para um leitor de tela, o destino do link fica incompreensível.

**Proposta de correção:**
```html
<!-- Opção 1: adicionar aria-label -->
<a href="https://blog.picpay.com/pro-labore/"
   role="button"
   aria-label="Saiba o que é pró-labore e como calcular">
</a>

<!-- Opção 2: adicionar texto visível -->
<a href="https://blog.picpay.com/pro-labore/" role="button">
  <span>Pró-labore: o que é e como calcular</span>
</a>

<!-- Opção 3: associar ao título do card -->
<a href="https://blog.picpay.com/pro-labore/"
   role="button"
   aria-labelledby="card-proLabore-titulo">
</a>
```

---

### Resumo dos erros

| Erro | Severidade | Critério WCAG | Correção sugerida |
|---|---|---|---|
| Botões sem nome acessível | Alta | 4.1.2 — Nome, Função, Valor | Adicionar `aria-label` descritivo |
| Links sem nome compreensível | Alta | 2.4.4 — Propósito do link | Adicionar texto visível ou `aria-label` |

---

## Como um desenvolvedor leva acessibilidade a sério

Um fluxo maduro não espera o produto ficar pronto para testar. A prática recomendada combina ferramentas e etapas complementares ao longo do desenvolvimento:

1. **Construção com semântica correta** — usar HTML adequado desde o início
2. **Teste automático com Lighthouse e axe** — localizar erros detectáveis rapidamente
3. **Revisão visual com WAVE** — entender onde e como o erro aparece na interface
4. **Teste manual com teclado e NVDA** — validar foco, leitura, contexto e navegação real
5. **Correção, reteste e documentação** — registrar erros, prints e soluções aplicadas

---

## Como isso afeta o nosso trabalho como desenvolvedores

### Prática 1 — Usar HTML semântico antes de ARIA

Em vez de usar `div` para funções interativas e corrigir depois com ARIA, use o elemento nativo correto. Elementos nativos já vêm com role, foco e interação por teclado de graça.

```html
<!-- ERRADO: div com role -->
<div role="button" onclick="submit()">Enviar</div>

<!-- CERTO: elemento nativo -->
<button type="submit">Enviar</button>
```

Também devem ser usados:
- headings em ordem lógica (`h1`, `h2`, `h3`)
- `<main>` para conteúdo principal
- `<nav>` para navegação
- `<label>` associado aos campos de formulário

### Prática 2 — Sempre incluir `alt` em imagens e `label` em inputs

```html
<img src="produto.jpg" alt="Descrição detalhada do produto">

<label for="email">Seu e-mail</label>
<input type="email" id="email">
```

### Prática 3 — Dar nome acessível a elementos interativos sem texto visível

```html
<!-- Errado -->
<button class="carousel__forward"></button>

<!-- Correto -->
<button class="carousel__forward" aria-label="Próximo slide"></button>
```

### Prática 4 — Testar com teclado antes de entregar

Navegue pela página inteira usando apenas `Tab`, `Shift+Tab`, `Enter` e `Escape`. Se algo não for acessível por teclado, está quebrado para 100% dos usuários de leitor de tela.

Todo componente interativo precisa gerenciar o foco corretamente:

```javascript
const botaoAvancar = document.querySelector('.carousel__forward');

botaoAvancar.addEventListener('click', () => {
  const proximoCard = document.querySelector('.card-carousel__item.active');
  proximoCard.setAttribute('tabindex', '-1');
  proximoCard.focus();
});
```

### Prática 5 — Rodar Lighthouse + axe em todo PR

Antes de abrir um Pull Request:

1. DevTools → Lighthouse → Accessibility (score mínimo: **90**)
2. axe DevTools → Analyze (**0** critical issues)
3. Teste manual com `Tab` por todos os formulários

O axe também pode entrar na suíte de testes automatizados:

```bash
npm install axe-core --save-dev
```

```javascript
import { axe } from 'jest-axe';

test('página não deve ter violações de acessibilidade', async () => {
  const { container } = render(<MeuComponente />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Aplicação no MVP — FigureForge

As descobertas da pesquisa orientaram diretamente a construção da loja. Na prática:

- **HTML semântico** em todas as páginas
- **Nomes acessíveis** em botões, ícones, banners e carrosséis
- **Formulários, filtros e carrinho** validados com ferramentas automáticas
- **Navegação por teclado e leitor de tela** testada nas páginas principais
- Acessibilidade incorporada **desde o início** do frontend, não como correção final

Essas decisões impactaram o projeto no Figma, a implementação em **JavaScript Vanilla** e a qualidade da experiência final.

---

## Como rodar o projeto

### Backend

```bash
cd backend
npm install
HF_API_TOKEN=seu_token ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=sua_senha node server.js
```

O servidor roda em `http://localhost:3001`.

### Frontend

Basta abrir o `frontend/index.html` no navegador, ou usar um servidor local:

```bash
cd frontend
python3 -m http.server 8088
```

---

## Conclusão

Nenhuma ferramenta resolve sozinha o problema da acessibilidade. As automáticas são importantes para detectar falhas técnicas com rapidez, mas testes reais com teclado e leitor de tela continuam indispensáveis — a auditoria do PicPay mostra isso bem: um score de 89 convive com dois erros de severidade alta que tornam parte da interface incompreensível para quem usa leitor de tela.

Para um time de desenvolvimento, a melhor prática é combinar **Lighthouse**, **axe-core**, **WAVE** e **NVDA** em um fluxo contínuo de construção, validação e correção. Foi esse aprendizado que guiou a construção do FigureForge como um MVP nativamente acessível.

---

## Referências

1. Instituto J&F — Escola de Tecnologia. **Projeto de Pesquisa: Acessibilidade Digital — Tecnologia para Todos DAD 2026**. PDF da atividade.
2. Google Chrome Developers. **Lighthouse Accessibility**. https://developer.chrome.com/docs/lighthouse/accessibility/
3. Google Chrome Developers. **Lighthouse accessibility score**. https://developer.chrome.com/docs/lighthouse/accessibility/scoring?hl=pt-br
4. Deque Systems. **axe-core Documentation**. https://www.deque.com/axe/core-documentation/
5. Deque Labs. **axe-core (GitHub)**. https://github.com/dequelabs/axe-core
6. Deque University. **Axe Rules and Remediation Advice**. https://dequeuniversity.com/rules/axe/
7. WebAIM. **WAVE Web Accessibility Evaluation Tools**. https://wave.webaim.org/
8. WebAIM. **The WebAIM Million — Annual Accessibility Analysis (2024)**. https://webaim.org/projects/million/
9. NV Access. **NVDA Screen Reader**. https://www.nvaccess.org/
10. W3C. **Web Content Accessibility Guidelines (WCAG) 2.1 — Tradução PT-BR**. https://www.w3.org/Translations/WCAG21-pt-BR/
11. Brasil. **Lei nº 13.146 (Lei Brasileira de Inclusão)**, 2015. https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm
12. IBGE. **Pesquisa Nacional de Saúde — Pessoas com Deficiência**, 2022.