# Customer Validator

## Descrição
Valida dados de potenciais clientes para determinar elegibilidade, retornando motivos caso o cliente seja inelegível, ou o valor esperado de economia anual de CO2 caso o mesmo seja elegível.

## Tipos
No request e response, serão usados os tipos abaixo:
```javascript
const cpf = {
  type: 'string',
  pattern: '^\\d{11}$',
  example: '21554495008',
}

const cnpj = {
  type: 'string',
  pattern: '^\\d{14}$',
  example: '33400689000109',
}

const tiposDeConexao = ['monofasico', 'bifasico', 'trifasico']

const classesDeConsumo = [
  'residencial',
  'industrial',
  'comercial',
  'rural',
  'poderPublico',
]

const modalidadesTarifarias = ['azul', 'branca', 'verde', 'convencional']
```

## Request

Schema do request:
```javascript
{
  type: 'object',
  additionalProperties: false,
  required: [
    'numeroDoDocumento',
    'tipoDeConexao',
    'classeDeConsumo',
    'modalidadeTarifaria',
    'historicoDeConsumo',
  ],
  properties: {
    numeroDoDocumento: { oneOf: [cpf, cnpj] },
    tipoDeConexao: enumOf(tiposDeConexao),
    classeDeConsumo: enumOf(classesDeConsumo),
    modalidadeTarifaria: enumOf(modalidadesTarifarias),
    historicoDeConsumo: { // em kWh
      type: 'array',
      minItems: 3,
      maxItems: 12,
      items: {
        type: 'integer',
        minimum: 0,
        maximum: 9999,
      },
    },
  },
}
```

## Response

Schema da Response:
```javascript
{
  oneOf: [
    {
      type: 'object',
      additionalProperties: false,
      required: ['elegivel', 'economiaAnualDeCO2'],
      properties: {
        elegivel: enumOf([true]), // always true
        economiaAnualDeCO2: { type: 'number', minimum: 0 },
      },
    },
    {
      type: 'object',
      additionalProperties: false,
      required: ['elegivel', 'razoesDeInelegibilidade'],
      properties: {
        elegivel: enumOf([false]), // always false
        razoesDeInelegibilidade: {
          type: 'array',
          uniqueItems: true,
          items: {
            type: 'string',
            enum: [
              'Classe de consumo não aceita',
              'Modalidade tarifária não aceita',
              'Consumo muito baixo para tipo de conexão',
            ],
          },
        },
      },
    },
  ],
}
```

## Critérios de Elegibilidade

- Classe de consumo da cliente
    - Possíveis Valores: Comercial, Residencial, Industrial, Poder Público, e Rural.
    - Elegíveis: Comercial, Residencial e Industrial.
- Modalidade tarifária
    - Possíveis Valores: Branca, Azul, Verde, e Convencional.
    - Elegíveis: Convencional, Branca.
- Consumo mínimo do cliente
    - O cálculo deve ser feito utilizando a média dos 12 valores mais recentes do histórico de consumo.
        - Clientes com tipo de conexão Monofásica só são elegíveis caso tenham consumo médio acima de 400 kWh.
        - Clientes com tipo de conexão Bifásica só são elegíveis caso tenham consumo médio acima de 500 kWh.
        - Clientes com tipo de conexão Trifásica só são elegíveis caso tenham consumo médio acima de 750 kWh.

## Outras Regras

- Para calcular a projeção da economia anual de CO2, considere que para serem gerados 1000 kWh no Brasil são emitidos em média 84kg de CO2. A projeção considera o valor total esperado de consumo anual (consumo médio mensal * 12)
