const fs = require("fs").promises
const fetch = require("node-fetch")
const cheerio = require("cheerio")

const { extractArguments } = require("./params")

const NO_PLAZAS =
  "No se puede inscribir en esta actividad. Consulte si aún quedan plazas libres."
const SUCCESS =
  "La inscripción se ha realizado correctamente. Si lo desea, puede imprimir esta página como justificante de la misma."

const serialize = d =>
  Object.entries(d)
    .map(([k, v]) => `${k}=${v}`)
    .join("&")

const BASE_URL =
  "https://sedeelectronica.vitoria-gasteiz.org/m01-10s/actividadAction.do"

const getAvailableSpotsUrl = (activity, center, week, slot) =>
  BASE_URL +
  `?accion=verObjetivos&prog=25&cen=${center}&activ=${activity}&detalle=detalle&id=2020||${center}||${activity}||${slot}||${week}&anio=2020&nuevaPag=1`

const getAvailableSpots = async (activity, center, week, slot) => {
  const content = await fetch(
    getAvailableSpotsUrl(activity, center, week, slot)
  )
  const $ = cheerio.load(await content.text())

  // console.log($.html());
  return await $("#detalleAct > dl > dd").last().text()
}

const signup = async (data, activity, center, week, slot) => {
  const body = {
    id: [2020, center, activity, slot, week].join("%7C%7C"),
    accion: "enviar",
    opcion: 1,
    anio: 2020,
    nuevaPag: 1,
    jspResultadoVisualizar: 0,
    urlEstatica: `verObjetivos%26prog%3D25%26cen%3D${center}%26activ%3D${activity}`,
    codTercero: 0,
    m0110ss: "Confirmar+inscripci%C3%B3n",
    ...data
  }

  return await fetch(BASE_URL, {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
      "Content-Type": "application/x-www-form-urlencoded",
      "Upgrade-Insecure-Requests": "1",
      Pragma: "no-cache",
      "Cache-Control": "no-cache"
    },
    referrer: BASE_URL,
    body: serialize(body),
    method: "POST",
    mode: "cors"
  })
}

const main = async () => {
  const { data, center, week, day, slot, activity } = extractArguments()

  console.log(
    "URL para apuntarse:",
    getAvailableSpotsUrl(activity, center, week, slot)
  )

  const libres = (await getAvailableSpots(activity, center, week, slot)).trim()
  switch (libres) {
    case "":
      console.log("Todavía no han abierto esas plazas")
      return
    case "--":
      console.log(
        "Pinta que te has equivocado de semana (semana pasada seleccionada)"
      )
      return
    case "0":
      console.log("No hay plazas libres")
      return
    default:
      console.log(`${libres} plazas libres`)
  }

  const result = await signup(data, activity, center, week, slot)
  const resHtml = await result.text()
  await fs.writeFile(
    `reserva_${data.nombre.toLowerCase()}_${day}_${week}.html`,
    resHtml
  )

  // const resHtml = await fs.readFile("result.html", "utf8");

  const $ = cheerio.load(resHtml)
  const resultSentence = $(".contenido > p").last().text()

  switch (resultSentence) {
    case NO_PLAZAS:
      console.log("No quedan plazas")
      break
    case SUCCESS:
      console.log("¡Apuntado correctamente!")
      break
    default:
      console.log(resultSentence)
  }
}

main()
