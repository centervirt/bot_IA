const { addKeyword } = require("@bot-whatsapp/bot");
/**
 * FLujo Inteligente (va a ser activado por una intencion de una persona o por palabra clave)
 * Flujo de bienvenida
 */
module.exports =  addKeyword('atencion',{sensitive:true})
.addAction(async (_, {state, flowDynamic}) => {
    const currentState = state.getMyState()
    return flowDynamic(`Hola soy el empleado IA de atencion al cliente...`)
})
