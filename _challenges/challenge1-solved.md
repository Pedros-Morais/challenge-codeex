# Guia de Testes para o Sistema de Gerenciamento de Áreas e Equipamentos

Este guia explica como testar as novas funcionalidades implementadas para gerenciar áreas vizinhas e associar equipamentos a múltiplas áreas.

## Pré-requisitos

- Servidor backend rodando em `localhost:3001`
- Cliente HTTP como Postman ou cURL para fazer as requisições

## Testes de Áreas Vizinhas

### 1. Criação de Áreas para Teste

Primeiro, crie algumas áreas para testar as relações de vizinhança:

**Endpoint:** `POST http://localhost:3001/area`

**Payload para Área 1:**
```json
{
  "name": "Área de Produção",
  "locationDescription": "Setor Norte",
  "plantId": "ID_DA_PLANTA_EXISTENTE"
}
```

**Payload para Área 2:**
```json
{
  "name": "Área de Estoque",
  "locationDescription": "Setor Norte",
  "plantId": "ID_DA_PLANTA_EXISTENTE"
}
```

**Payload para Área 3:**
```json
{
  "name": "Área de Manutenção",
  "locationDescription": "Setor Sul",
  "plantId": "ID_DA_PLANTA_EXISTENTE"
}
```

### 2. Definir Áreas como Vizinhas

**Endpoint:** `POST http://localhost:3001/area/{areaId}/neighbors/{neighborId}`

Exemplo: Para definir a Área 1 (Produção) como vizinha da Área 2 (Estoque):
```
POST http://localhost:3001/area/ID_AREA_1/neighbors/ID_AREA_2
```

### 3. Verificar Vizinhanças de uma Área

**Endpoint:** `GET http://localhost:3001/area/{areaId}/neighbors`

Exemplo:
```
GET http://localhost:3001/area/ID_AREA_1/neighbors
```

### 4. Remover Relação de Vizinhança

**Endpoint:** `DELETE http://localhost:3001/area/{areaId}/neighbors/{neighborId}`

Exemplo:
```
DELETE http://localhost:3001/area/ID_AREA_1/neighbors/ID_AREA_2
```

### 5. Verificar se Duas Áreas são Vizinhas

**Endpoint:** `GET http://localhost:3001/area/{areaId}/neighbors/{neighborId}`

Exemplo:
```
GET http://localhost:3001/area/ID_AREA_1/neighbors/ID_AREA_2
```

## Testes de Equipamentos em Múltiplas Áreas

### 1. Criar um Equipamento

**Endpoint:** `POST http://localhost:3001/equipment`

**Payload:**
```json
{
  "name": "Empilhadeira Industrial",
  "description": "Empilhadeira para transporte de materiais",
  "areaId": "ID_AREA_1",
  "areas": [
    { "id": "ID_AREA_1" }
  ]
}
```

### 2. Adicionar Equipamento a uma Área Vizinha

**Endpoint:** `POST http://localhost:3001/equipment/{equipmentId}/areas/{areaId}`

Exemplo: Adicionar o equipamento à Área 2 (que deve ser vizinha da Área 1):
```
POST http://localhost:3001/equipment/ID_EQUIPAMENTO/areas/ID_AREA_2
```

### 3. Verificar Áreas Associadas a um Equipamento

**Endpoint:** `GET http://localhost:3001/equipment/{equipmentId}/areas`

Exemplo:
```
GET http://localhost:3001/equipment/ID_EQUIPAMENTO/areas
```

### 4. Remover Equipamento de uma Área

**Endpoint:** `DELETE http://localhost:3001/equipment/{equipmentId}/areas/{areaId}`

Exemplo:
```
DELETE http://localhost:3001/equipment/ID_EQUIPAMENTO/areas/ID_AREA_2
```

## Possíveis Erros e Soluções

### Erro: InvalidNeighboringAreaError

Se você tentar adicionar um equipamento a áreas que não são vizinhas, receberá um erro semelhante a:

```json
{
  "error": "InvalidNeighboringAreaError",
  "message": "Equipment can only be added to neighboring areas",
  "areaIds": ["ID_AREA_1", "ID_AREA_3"],
  "details": "The area ID_AREA_3 is not a neighbor of any of the equipment's current areas: ID_AREA_1"
}
```

**Solução:** Certifique-se de que as áreas são vizinhas antes de adicionar o equipamento. Use o endpoint de verificação de vizinhança para confirmar.

### Erro: AreaNotFoundError

Se uma das áreas não existir no sistema, você receberá:

```json
{
  "name": "AreaNotFoundError",
  "message": "Area not found"
}
```

**Solução:** Verifique se o ID da área está correto e se a área existe no sistema.

### Erro: EquipmentNotFoundError

Se o equipamento não existir no sistema, você receberá:

```json
{
  "name": "EquipmentNotFoundError",
  "message": "Equipment not found"
}
```

**Solução:** Verifique se o ID do equipamento está correto e se o equipamento existe no sistema.

