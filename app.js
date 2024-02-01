require('dotenv').config()
const {
  createBot,
  createProvider,
  createFlow,
} = require("@bot-whatsapp/bot");

const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");

const welcomeFlow = require("./flows/welcome.flow");
const atencionFlow = require('./flows/atencion.flow')
const expertoFlow = require('./flows/ventas.flow')
const pagarFlow = require('./flows/facturacion.flow')

const {init} = require('bot-ws-plugin-openai');
const ServerAPI = require('./http');
const ventasFlow = require('./flows/ventas.flow');
/**
 * Configuracion de Plugin
 */
const employeesAddonConfig = {
  model: "gpt-3.5-turbo-16k",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
};
const employeesAddon = init(employeesAddonConfig);

employeesAddon.employees([
  {
    name: "EMPLEADO_ATENCION",
    description:
      "Soy Rob el vendedor amable encargado de atentender si tienes intencion de comprar o interesado en algun producto, mis respuestas son breves.",
    flow: atencionFlow,
  },
  {
    name: "EMPLEADO_VENTAS",
    description:
      "Saludos, mi nombre es Leifer.Soy el engargado especializado en resolver tus dudas sobre nuestro curso de chatbot, el cual está desarrollado con Node.js y JavaScript. Este curso está diseñado para facilitar la automatización de ventas en tu negocio. Te proporcionaré respuestas concisas y directas para maximizar tu entendimiento.",
    flow: ventasFlow,
  },
  {
    name: "EMPLEADO_INSTALACION",
    description:
      "Saludos, mi nombre es Juan encargado de generar los links de pagos necesarios cuando un usuario quiera hacer la recarga de puntos a la plataforma de cursos.",
    flow: instalacionFlow,
  },
  {
    name: "EMPLEADO_FACTURACION",
    description:
      "Saludos, mi nombre es Juan encargado de generar los links de pagos necesarios cuando un usuario quiera hacer la recarga de puntos a la plataforma de cursos.",
    flow: facturacionFlow,
  }
])

/**
 * 
 */


const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    welcomeFlow,
    atencionFlow,
    expertoFlow,
    pagarFlow
  ]);
  
  const adapterProvider = createProvider(BaileysProvider);

  const httpServer = new ServerAPI(adapterProvider, adapterDB)

  const configBot = {
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  }

  const configExtra = {
    extensions:{
      employeesAddon
    }
  }

  await createBot(configBot,configExtra);
  httpServer.start()
};

main();
