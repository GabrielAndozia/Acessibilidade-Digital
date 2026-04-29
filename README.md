# Pesquisa de Acessibilidade Digital — Dimensão A: Ferramentas de Teste e Diagnóstico

## Integrantes
- Caio Eiken Chinen França
- Enzo D'angio Mota
- Gabriel Andozia Pinheiro Masagão
- Guilherme Guedes Montoni
- Yasmin Benevenuto Holanda

## Sobre esta pesquisa

Esta pesquisa investiga a **Dimensão A — Ferramentas de Teste e Diagnóstico** no contexto do projeto de Acessibilidade Digital (DAD 2026). A pergunta central que guiou a investigação foi: **como os desenvolvedores descobrem, medem e corrigem falhas de acessibilidade em produtos digitais?**

O objetivo desta etapa não é construir a loja de action figures, mas entender quais ferramentas ajudam a avaliar acessibilidade e como essas descobertas devem orientar o desenvolvimento futuro do nosso MVP Full Stack, que será construído com **JavaScript Vanilla, HTML semântico, CSS com foco em A11y, backend e banco de dados**.

---

## O que descobrimos

- O relatório **WebAIM Million 2024** aponta que **95,9%** das home pages analisadas apresentaram falhas de acessibilidade detectáveis automaticamente — erros básicos que continuam frequentes até em sites grandes e populares. _(Fonte: WebAIM. The WebAIM Million, 2024. https://webaim.org/projects/million/)_

- Ferramentas automáticas como **Lighthouse**, **axe-core** e **WAVE** são úteis para encontrar problemas técnicos e estruturais, mas não conseguem reproduzir totalmente a experiência real de uma pessoa que usa leitor de tela ou navega apenas por teclado. _(Fonte: Google Chrome Developers. Lighthouse Accessibility. https://developer.chrome.com/docs/lighthouse/accessibility/)_

- O **NVDA** se destaca como ferramenta essencial para testes manuais, permitindo verificar se a ordem de leitura faz sentido, se os rótulos são compreensíveis e se o foco do teclado está correto. _(Fonte: NV Access. NVDA. https://www.nvaccess.org/)_

- O **PicPay Empresas** obteve score **89 de acessibilidade** no Lighthouse (desktop, 25/04/2026), mas ainda apresenta falhas concretas: botões sem nome acessível e links sem texto compreensível no carrossel de cards — ambos classificados como severidade alta pelo critério WCAG. _(Fonte: auditoria própria via Lighthouse, 25/04/2026)_

- Decisões como usar **HTML semântico**, nomes acessíveis, headings corretos, landmarks e formulários bem estruturados precisam acontecer desde o início do desenvolvimento — não como correção tardia. _(Fonte: Deque University. Axe Rules and Remediation Advice. https://dequeuniversity.com/rules/axe/)_

---

## Ferramentas de teste e diagnóstico

### Lighthouse

O **Lighthouse** é uma ferramenta de auditoria do ecossistema Chrome usada para avaliar páginas web em categorias como acessibilidade, desempenho, SEO e boas práticas. No contexto desta pesquisa, ele foi importante por gerar uma análise rápida com score de acessibilidade e lista objetiva de falhas detectáveis automaticamente.

**Como usar:**
1. Abrir o site no Google Chrome
2. Pressionar `F12` para abrir o DevTools
3. Ir até a aba **Lighthouse**
4. Marcar a categoria **Accessibility**
5. Clicar em **Analyze page load**

**O que detecta bem:**
- Falta de nomes acessíveis em botões e links
- Problemas de contraste em parte da interface
- Uso inadequado de atributos ARIA
- Problemas básicos de semântica e estrutura

**Limitação principal:** score alto não significa acessibilidade completa. A pontuação é baseada em auditorias automáticas com critérios específicos e não substitui teste manual.

---

### axe-core / axe DevTools

O **axe-core** é uma engine open source de testes automatizados de acessibilidade, amplamente usada para verificar conformidade com regras relacionadas às **WCAG**. Ele pode ser usado por extensão de navegador, testes automatizados e integração em pipelines.

**O que detecta bem:**
- Problemas estruturais no HTML
- Falhas em formulários, headings, imagens e landmarks
- Problemas de ARIA e nomes acessíveis
- Violações com orientação de correção

**Limitação principal:** não substitui a validação manual da experiência de navegação real.

---

### WAVE

O **WAVE**, da WebAIM, mostra visualmente na própria página onde estão erros, alertas, headings, landmarks e elementos de acessibilidade. Ele é útil porque ajuda a entender **onde** o problema aparece no layout, não apenas **qual** regra foi violada.

**O que detecta bem:**
- Problemas visuais de estrutura
- Erros de contraste
- Problemas em headings, formulários e landmarks
- Situações em que o contexto visual facilita a interpretação

**Limitação principal:** não simula uso real com teclado ou leitor de tela.

---

### NVDA

O **NVDA (NonVisual Desktop Access)** é um leitor de tela gratuito e open source para Windows. Diferente das outras ferramentas listadas, ele não faz apenas uma auditoria do código: ele permite experimentar a interface como uma pessoa com deficiência visual pode experimentá-la.

**O que detecta melhor que as ferramentas automáticas:**
- Ordem real de leitura
- Clareza dos rótulos anunciados
- Qualidade da navegação por teclado
- Coerência de foco e compreensão da interface

**Limitação principal:** exige mais tempo, prática e interpretação humana.

---

## Comparativo rápido

| Ferramenta | Tipo | Melhor para | Limitação principal |
|---|---|---|---|
| Lighthouse | Automática | Auditoria rápida com score | Não valida experiência real |
| axe-core / axe DevTools | Automática | Testes técnicos e integração em fluxo de desenvolvimento | Não substitui teste manual |
| WAVE | Automática visual | Ver erros no contexto da interface | Não testa navegação real |
| NVDA | Manual | Validar experiência real com leitor de tela | Requer tempo e prática |

---

## Demonstração prática — Relatório de acessibilidade do PicPay Empresas

**Site analisado:** [picpay.com/empresas](https://picpay.com/empresas)  
**Data da análise:** 25/04/2026  
**Ferramenta:** Lighthouse (Google Chrome DevTools)  
**Modo:** Desktop

### Scores obtidos

| Categoria | Score |
|---|---:|
| Desempenho | 86 |
| **Acessibilidade** | **89** |
| Práticas recomendadas | 100 |
| SEO | 92 |

O score **89** mostra um resultado bom, mas ainda insuficiente para considerar a página plenamente acessível. Na documentação do Lighthouse, scores entre **50 e 89** ficam na faixa intermediária, enquanto **90 a 100** representam a faixa "boa". Mesmo assim, a própria ferramenta não afirma que uma nota alta garante acessibilidade total.

---

### Erro 1 — Botões sem nome acessível

**Categoria:** Nomes e etiquetas  
**Impacto:** Alto

#### Elementos com falha
```html
<!-- Botão de retroceder no carrossel -->
<button class="button card-carousel__backward" disabled="" data-gtm-button-decorated="true">

<!-- Botão de avançar no carrossel -->
<button class="button card-carousel__forward" data-gtm-button-decorated="true">
```

#### Por que isso é um problema
Quando um usuário de leitor de tela chega nesses botões, o sistema anuncia apenas "botão", sem informar sua função. Isso compromete a navegação e a compreensão da interface.

#### Proposta de correção
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

**Categoria:** Nomes e etiquetas  
**Impacto:** Alto

#### Elementos com falha
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

#### Por que isso é um problema
Esses links não têm texto visível nem nome acessível. O atributo `data-gtm-name` serve para analytics, não para acessibilidade. Para um leitor de tela, o destino ou objetivo do link fica incompreensível.

#### Proposta de correção
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

Um fluxo de desenvolvimento mais maduro não espera o produto ficar pronto para testar. A prática recomendada é combinar ferramentas e etapas complementares ao longo do desenvolvimento:

- **Construção com semântica correta** — usar HTML adequado desde o início
- **Teste automático com Lighthouse e axe** — localizar erros detectáveis rapidamente
- **Revisão visual com WAVE** — entender onde e como o erro aparece na interface
- **Teste manual com teclado e NVDA** — validar foco, leitura, contexto e navegação real
- **Correção, reteste e documentação** — registrar erros, prints e soluções aplicadas

---

## Como isso afeta o nosso trabalho como desenvolvedores

### 1. Usar nome acessível em elementos interativos sem texto visível

Qualquer botão ou link que não tenha texto visível precisa de um nome acessível.

```html
<!-- Errado -->
<button class="carousel__forward"></button>

<!-- Correto -->
<button class="carousel__forward" aria-label="Próximo slide"></button>
```

### 2. Rodar testes automáticos durante o desenvolvimento

O ideal é testar acessibilidade antes da entrega final, e não apenas no fim do projeto. Ferramentas como **axe DevTools** podem fazer parte da revisão de cada etapa da interface.

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

### 3. Usar HTML semântico desde o início

Em vez de usar `div` para funções interativas e tentar corrigir depois com ARIA, o ideal é usar elementos nativos corretos.

```html
<!-- Errado -->
<div role="button" onclick="submit()">Enviar</div>

<!-- Correto -->
<button type="submit">Enviar</button>
```

Também devem ser usados:
- headings em ordem lógica (`h1`, `h2`, `h3`)
- `<main>` para conteúdo principal
- `<nav>` para navegação
- `<label>` associado aos campos de formulário

### 4. Testar navegação por teclado antes de considerar o componente pronto

Todo componente interativo precisa funcionar corretamente com **Tab**, **Enter** e, quando necessário, teclas de seta.

```javascript
const botaoAvancar = document.querySelector('.carousel__forward');

botaoAvancar.addEventListener('click', () => {
  const proximoCard = document.querySelector('.card-carousel__item.active');
  proximoCard.setAttribute('tabindex', '-1');
  proximoCard.focus();
});
```

---

## Aplicação no nosso MVP — Loja de Action Figures

As descobertas desta pesquisa vão orientar diretamente o desenvolvimento da nossa loja de action figures. Na prática, isso significa:

- usar **HTML semântico** em todas as páginas da loja
- garantir **nomes acessíveis** em botões, ícones, banners e carrosséis
- validar **formulários, filtros e carrinho** com ferramentas automáticas
- testar navegação por **teclado e leitor de tela** nas páginas principais
- incorporar acessibilidade desde o início do frontend, e não como correção final

Essas decisões impactam diretamente o futuro projeto em Figma, a implementação em **JavaScript Vanilla** e a qualidade da experiência do usuário final.

---

## Conclusão

A pesquisa mostrou que nenhuma ferramenta resolve sozinha o problema da acessibilidade. Ferramentas automáticas são importantes para detectar falhas técnicas com rapidez, mas testes reais com teclado e leitor de tela continuam indispensáveis.

Para um time de desenvolvimento, a melhor prática é combinar **Lighthouse**, **axe-core**, **WAVE** e **NVDA** em um fluxo contínuo de construção, validação e correção. Esse aprendizado será aplicado na construção do MVP da nossa loja de action figures nativamente acessível.

---

## Referências

1. Instituto J&F — Escola de Tecnologia. **Projeto de Pesquisa: Acessibilidade Digital — Tecnologia para Todos DAD 2026**. PDF da atividade.
2. Google Chrome Developers. **Lighthouse Accessibility**. Disponível em: https://developer.chrome.com/docs/lighthouse/accessibility/
3. Google Chrome Developers. **Lighthouse accessibility score**. Disponível em: https://developer.chrome.com/docs/lighthouse/accessibility/scoring?hl=pt-br
4. Deque Systems. **axe-core Documentation**. Disponível em: https://www.deque.com/axe/core-documentation/
5. Deque Labs. **axe-core (GitHub)**. Disponível em: https://github.com/dequelabs/axe-core
6. Deque University. **Axe Rules and Remediation Advice**. Disponível em: https://dequeuniversity.com/rules/axe/
7. WebAIM. **WAVE Web Accessibility Evaluation Tools**. Disponível em: https://wave.webaim.org/
8. WebAIM. **The WebAIM Million (2024)**. Disponível em: https://webaim.org/projects/million/
9. NV Access. **NVDA**. Disponível em: https://www.nvaccess.org/
10. W3C. **Web Content Accessibility Guidelines (WCAG) 2.1**. Disponível em: https://www.w3.org/Translations/WCAG21-pt-BR/