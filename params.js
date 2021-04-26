const { DAYS, SLOTS, CENTERS } = require("./constants")
const moment = require("moment")

const getWeekNumber = () => {
  const BASE_WEEK = 30
  const diffWeeks = Math.floor(
    moment.duration(moment().diff(moment("20210421", "YYYYMMDD"))).as("weeks")
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
  const activity = "IGE" + day // IGE === Piscina grande, ITE === Piscina pequeña

  if (!(slotArg in SLOTS)) {
    console.error(
      `Invalid slot ${slotArg} (not [${Object.keys(SLOTS).join(",")}])`
    )
    process.exit(1)
  }
  const slot = SLOTS[slotArg]

  return { data, center, day, slot, activity }
}

module.exports = {
  getWeekNumber,
  extractArguments
}
