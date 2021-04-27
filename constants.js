const CENTERS = {
  aldabe: 35,
  sanandres: 49
}

const SEXO = {
  hombre: "V",
  mujer: "H"
}

const DAYS = {
  lunes: "L",
  martes: "M",
  miercoles: "X",
  jueves: "J",
  viernes: "V",
  sabado: "S",
  domingo: "D"
}

const DAYS_TO_ISO = {
  L: 1,
  M: 2,
  X: 3,
  J: 4,
  V: 5,
  S: 6,
  D: 7
}

const SLOTS = {
  "8:00": 1,
  "9:30": 2,
  "11:00": 3,
  "12:30": 4,
  "14:00": 5,
  "15:30": 6,
  "17:00": 7,
  "18:30": 8,
  "20:00": 9
}

module.exports = {
  CENTERS,
  SEXO,
  DAYS,
  DAYS_TO_ISO,
  SLOTS
}
