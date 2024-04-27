# dates_app

#### Atención!!! Se migró de MongoDB a PostgreSQL, lee estos requerimientos

## Descripción del Proyecto

Este es un proyecto de una app de citas, enfocado en el backend, donde se utilizan y se ponen a prueba los conocimientos adquiridos a lo largo del curso,
por ejemplo:

1. Diseño MVC
2. Separación de responsabilidades
3. Autenticación
4. ORMs y bases de datos
5. Motores de vistas
6. Middlewares
7. Archivos estáticos

## Set - up

### Instalación de dependencias

Este proyecto utiliza _Yarn_ para las dependencias, solo corre el siguiente comando para limpiar e instalar las dependencias
Si necesitas instalar _Yarn_, utiliza esta [documentación](https://yarnpkg.com/getting-started/install)

```bash
yarn
```

### .env

El proyecto utiliza un par de variables de entorno para su funcionamiento seguro,asegurate de tener un archivo `.env` con los siguientes nombres

```bash
DATABASE_URL="your-postgresql-connection"
SECRET_KEY="your-secret-key"
PORT=8473
S3_ACCESS_KEY="your-access-key-to-s3"
S3_SECRET_KEY="your-secret-key-to-s3"
S3_REGION="your-s3-region"
S3_BUCKET_NAME="your-s3-bucket-name"
NODE_ENV="Production | Development"
```

Es importante que definas tus valores y respetes los nombres.

### ORM con PostgreSQL

Este proyecto utiliza _Prisma_ como un ORM para la base de datos relacional usando _PostgreSQL_, es sumamente importante que coloques la conexión con la base de datos en el campo `DATABASE_URL` del archivo `.env`, una vez realizado esto, corre el siguiente comando:

```bash
npx prisma generate
```

Después utiliza el siguiente script luego de haber instalado las dependencias

```bash
yarn postinstall
```

Esto empujará los cambios a la base de datos y asegurará que se creé la colección indicada en el archivo `~/prisma/schema.prisma`.

### Pre - uso

La aplicación utiliza _typescript_ como lenguaje de programación principal, dentro del `package.json` ya vienen varios scripts para poder utilizar el proyecto de manera eficiente. Si deseas utilizar correr la aplicación en modo _producción_, es necesario primero construir y traspilar el proyecto de _ts_ a _js_, utiliza el siguiente comando

```bash
yarn build
```

Después, ya podras inicializar el servidor con `yarn start`.
Si lo que deseas es inicializar el modo _desarrollo_, entonces basta con correr la aplicación utilizando el comando `yarn dev`
