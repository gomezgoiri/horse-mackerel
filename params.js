const { CENTERS, SLOTS, DAYS, DAYS_TO_ISO } = require("./constants")
const moment = require("moment")

const BASE_WEEK = 30
const START_BASE_WEEK = "20210422" // Day where the week starts for the webapp (Wednesday)

const getNextIsoDay = isoDay => {
  const now = moment()
  const candidate = now.clone().isoWeekday(isoDay)
  return candidate.isSameOrAfter(now) ? candidate : candidate.add(1, "w")
}

const getWeekNumber = isoDay => {
  const diffWeeks = Math.floor(
    moment
      .duration(getNextIsoDay(isoDay).diff(moment(START_BASE_WEEK, "YYYYMMDD")))
      .as("weeks")
  )

  return BASE_WEEK + diffWeeks
}

const extractArguments = () => {
  const args = process.argv.slice(2)

  if (args.length < 4) {
    console.error("No enough arguments")
    process.exit(1)
  }

  const [usernameArg, centerArg, dayArg, slotArg] = args

  const data = require(`./profiles/${usernameArg}.js`)

  if (!(centerArg in CENTERS)) {
    console.error(
      `Invalid center ${centerArg} (not [${Object.keys(CENTERS).join(",")}])`
    )
    process.exit(1)
  }
  const center = CENTERS[centerArg]

  if (!(dayArg in DAYS)) {
    console.error(
      `Invalid day ${dayArg} (not [${Object.keys(DAYS).join(", ")}])`
    )
    process.exit(1)
  }
  const day = DAYS[dayArg]
  const week = getWeekNumber(DAYS_TO_ISO[day])
  const activity = "IGE" + day // IGE === Piscina grande, ITE === Piscina pequeña

  if (!(slotArg in SLOTS)) {
    console.error(
      `Invalid slot ${slotArg} (not [${Object.keys(SLOTS).join(",")}])`
    )
    process.exit(1)
  }
  const slot = SLOTS[slotArg]

  return { data, center, week, day, slot, activity }
}

module.exports = {
  extractArguments
}
