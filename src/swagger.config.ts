export const swaggerConfig = {
    "swaggerDefinition" : {
       "openapi": "3.1.0",
       "info": {
           "version": "1.0.0",
           "title": "Dates App",
           "description": "Este es un proyecto de una app de citas."
       },
       "servers": [
           {
               "url": "http://localhost:8473",
               "description": "Local server"
           }
       ]
   },
   "apis": ["src/**/*.ts"]
}