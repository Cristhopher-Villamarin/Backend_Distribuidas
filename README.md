# Backend Microservicios - Instrucciones de Instalación y Ejecución

Este proyecto contiene una arquitectura de microservicios con Node.js, Docker y CockroachDB, gestionados mediante Docker Compose. Incluye los siguientes microservicios:

- usuarios
- categorias
- eventos
- localidades
- compras
- entradas
- notificaciones (si lo agregas)

Además, utiliza Kong como API Gateway, RabbitMQ para mensajería y Redis para cache.

## Requisitos previos

- [Docker](https://www.docker.com/products/docker-desktop) instalado y funcionando
- [Docker Compose](https://docs.docker.com/compose/) (si tu Docker no lo incluye)

## Instalación de dependencias y herramientas necesarias

Sigue estos pasos si es la primera vez que trabajas con este proyecto y no tienes nada instalado en tu máquina:

### 1. Instalar Docker y Docker Compose

- Descarga e instala Docker Desktop desde: https://www.docker.com/products/docker-desktop
  - Sigue el proceso de instalación para tu sistema operativo (Windows, Mac o Linux).
  - Reinicia tu computadora si es necesario.
- Docker Compose ya viene incluido con Docker Desktop. No necesitas instalarlo aparte.
- Verifica la instalación abriendo una terminal y ejecutando:
  ```sh
  docker --version
  docker compose version
  ```
  Ambas deben mostrar un número de versión.

### 2. Clonar el repositorio

Abre una terminal y ejecuta:
```sh
git clone <url-del-repo>
cd Backend_Distribuidas
```

### 3. (Opcional) Instalar Git

Si no tienes Git instalado, descárgalo desde: https://git-scm.com/downloads

### 4. (Opcional) Instalar Postman

Para probar los endpoints, descarga e instala Postman desde: https://www.postman.com/downloads/

### 5. (Opcional) Configurar variables de entorno

Cada microservicio puede tener un archivo `.env` con sus variables de entorno. Puedes copiar el archivo `.env.example` (si existe) o crear uno nuevo siguiendo los ejemplos del README.

### 6. Instalar dependencias de Node.js (solo si quieres desarrollo local sin Docker)

Si quieres correr algún microservicio fuera de Docker (por ejemplo para debug), necesitas Node.js y npm:
- Descarga Node.js desde: https://nodejs.org/
- Instala las dependencias de cada microservicio:
  ```sh
  cd usuarios && npm install && cd ..
  cd categorias && npm install && cd ..
  cd eventos && npm install && cd ..
  cd localidades && npm install && cd ..
  cd compras && npm install && cd ..
  cd entradas && npm install && cd ..
  # Repite para otros microservicios si los agregas
  ```

### 7. Levantar todos los servicios con Docker Compose

Desde la raíz del proyecto:
```sh
docker compose up --build
```
Esto descargará las imágenes necesarias, construirá los microservicios y levantará todas las dependencias (bases de datos, RabbitMQ, Kong, Redis, etc).

---

## Estructura del proyecto

```
Backend_Distribuidas/
├── docker-compose.yml
├── kong.yml
├── usuarios/
├── categorias/
├── eventos/
├── localidades/
├── compras/
├── entradas/
└── ...
```

## Instalación y ejecución

1. **Clona el repositorio**

```sh
git clone <url-del-repo>
cd Backend_Distribuidas
```

2. **(Opcional) Configura variables de entorno**

Cada microservicio puede tener su propio archivo `.env`. Revisa y ajusta los valores si es necesario.

3. **Construye y levanta todos los servicios**

```sh
docker-compose up --build
```
Esto descargará las imágenes necesarias, construirá los microservicios y levantará todas las dependencias (bases de datos, RabbitMQ, Kong, Redis, etc).

4. **Verifica que todo esté corriendo**

Puedes ver los logs en tiempo real:
```sh
docker-compose logs -f
```

O ver el estado de los contenedores:
```sh
docker-compose ps
```

5. **Acceso a servicios**

- **Kong API Gateway:**
  - Proxy: http://localhost:8000
  - Admin: http://localhost:8001
- **RabbitMQ UI:** http://localhost:15672 (usuario/contraseña: guest/guest)
- **CockroachDB UI:** http://localhost:8081
- **Microservicios:**
  - usuarios: http://localhost:3000
  - categorias: http://localhost:3001
  - eventos: http://localhost:3002
  - localidades: http://localhost:3003
  - compras: http://localhost:3004
  - entradas: http://localhost:3005

6. **Parar todos los servicios**

```sh
docker-compose down
```

## Notas importantes

- Si cambias dependencias en algún microservicio, ejecuta `docker-compose build` para reconstruir.
- Puedes agregar más microservicios siguiendo la estructura y agregándolos al `docker-compose.yml`.
- La configuración de rutas y plugins de Kong está en `kong.yml`.
- Si tienes problemas de conexión entre servicios, revisa los logs y asegúrate de que los servicios estén "healthy".

## Troubleshooting

- Si algún servicio no levanta, revisa los logs con:
  ```sh
  docker-compose logs <nombre-servicio>
  ```
- Si necesitas limpiar los volúmenes de la base de datos (¡esto borra los datos!):
  ```sh
  docker-compose down -v
  ```

## Dependencias de cada microservicio

- **usuarios**
  - CockroachDB (DB_HOST: cockroachdb-node1)
  - RabbitMQ (RABBITMQ_HOST: rabbitmq)

- **categorias**
  - CockroachDB (DB_HOST: cockroachdb-node1)
  - RabbitMQ (RABBITMQ_HOST: rabbitmq)

- **eventos**
  - CockroachDB (DB_HOST: cockroachdb-node1)
  - RabbitMQ (RABBITMQ_HOST: rabbitmq)
  - Redis (opcional, para cache o sesiones)
  - Microservicio categorias (para validar idCategoria)

- **localidades**
  - CockroachDB (DB_HOST: cockroachdb-node1)
  - RabbitMQ (RABBITMQ_HOST: rabbitmq)

- **compras**
  - CockroachDB (DB_HOST: cockroachdb-node1)
  - RabbitMQ (RABBITMQ_HOST: rabbitmq)

- **entradas**
  - CockroachDB (DB_HOST: cockroachdb-node1)
  - RabbitMQ (RABBITMQ_HOST: rabbitmq)

- **notificaciones** (si lo agregas)
  - RabbitMQ (RABBITMQ_HOST: rabbitmq)

- **Todos los microservicios** pueden depender de Kong para exponer sus APIs externamente y de variables de entorno para configuración.

## Flujo y rutas de los microservicios

A continuación se describe el flujo básico de cada microservicio, sus rutas principales (usando Kong como gateway) y cómo probarlos con Postman usando archivos `.json` de colección.

### 1. usuarios
- **Flujo:** Registro, login, gestión de usuarios, autenticación JWT.
- **Rutas principales (a través de Kong):**
  - POST   http://localhost:8000/api/usuarios/registro
  - POST   http://localhost:8000/api/usuarios/login
  - GET    http://localhost:8000/api/usuarios/
  - GET    http://localhost:8000/api/usuarios/:id
  - PUT    http://localhost:8000/api/usuarios/:id
  - DELETE http://localhost:8000/api/usuarios/:id
- **Postman:** Usa el archivo `usuarios.postman_collection.json` (deberás crearlo/exportarlo desde Postman)

### 2. categorias
- **Flujo:** CRUD de categorías, validación de datos.
- **Rutas principales (a través de Kong):**
  - POST   http://localhost:8000/api/categorias/
  - GET    http://localhost:8000/api/categorias/
  - GET    http://localhost:8000/api/categorias/:id
  - PUT    http://localhost:8000/api/categorias/:id
  - DELETE http://localhost:8000/api/categorias/:id
- **Postman:** Usa el archivo `categorias.postman_collection.json`

### 3. eventos
- **Flujo:** Creación y gestión de eventos, validación de categoría, consulta de eventos.
- **Rutas principales (a través de Kong):**
  - POST   http://localhost:8000/api/eventos/
  - GET    http://localhost:8000/api/eventos/
  - GET    http://localhost:8000/api/eventos/:id
  - PUT    http://localhost:8000/api/eventos/:id
  - DELETE http://localhost:8000/api/eventos/:id
- **Postman:** Usa el archivo `eventos.postman_collection.json`

### 4. localidades
- **Flujo:** CRUD de localidades, asociadas a eventos.
- **Rutas principales (a través de Kong):**
  - POST   http://localhost:8000/api/localidades/
  - GET    http://localhost:8000/api/localidades/
  - GET    http://localhost:8000/api/localidades/:id
  - PUT    http://localhost:8000/api/localidades/:id
  - DELETE http://localhost:8000/api/localidades/:id
- **Postman:** Usa el archivo `localidades.postman_collection.json`

### 5. compras
- **Flujo:** Gestión de compras de entradas, integración con usuarios y eventos.
- **Rutas principales (a través de Kong):**
  - POST   http://localhost:8000/api/compras/
  - GET    http://localhost:8000/api/compras/
  - GET    http://localhost:8000/api/compras/:id
- **Postman:** Usa el archivo `compras.postman_collection.json`

### 6. entradas
- **Flujo:** Generación y validación de entradas, consulta de entradas por usuario o evento.
- **Rutas principales (a través de Kong):**
  - POST   http://localhost:8000/api/entradas/
  - GET    http://localhost:8000/api/entradas/
  - GET    http://localhost:8000/api/entradas/:id
- **Postman:** Usa el archivo `entradas.postman_collection.json`

### 7. notificaciones (si lo agregas)
- **Flujo:** Envío de notificaciones a usuarios vía RabbitMQ.
- **Rutas principales (a través de Kong):**
  - POST   http://localhost:8000/api/notificaciones/
- **Postman:** Usa el archivo `notificaciones.postman_collection.json`

---

**Para probar con Postman:**
1. Importa el archivo `.postman_collection.json` correspondiente a cada microservicio.
2. Modifica los ejemplos de request si es necesario (por ejemplo, para incluir JWT en el header Authorization).
3. Ejecuta las peticiones usando las rutas de Kong (`http://localhost:8000/...`).

---

¡Listo! Ahora puedes trabajar con tu arquitectura de microservicios de manera local usando Docker Compose.
