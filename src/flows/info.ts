
import { addKeyword, EVENTS } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";

// Ensure API_JUNTA environment variable is set
if (!process.env.API_JUNTA) {
  throw new Error("La variable para la api de la junta es necesaria!");
}

// Function to calculate age based on date of birth
function calculateAge(dobStr: string): number {
  const dob = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
    age--; // Adjust age if birthday hasn't passed yet this year
  }
  return age;
}

// Function to determine Western zodiac sign
function getWesternZodiacSign(dob: Date): string{
  const zodiacSignsWestern = {
    Capricornio: [1, 19],
    Acuario: [1, 20],
    Piscis: [2, 19],
    Aries: [3, 21],
    Tauro: [4, 20],
    Géminis: [5, 20],
    Cáncer: [6, 21],
    Leo: [7, 22],
    Virgo: [8, 22],
    Libra: [9, 22],
    Escorpio: [10, 23],
    Sagitario: [11, 21],
    Capricornio2: [12, 31],
  };

  for (const sign in zodiacSignsWestern) {
    const [startMonth, startDay] = zodiacSignsWestern[sign];
    if (
      (dob.getMonth() + 1 === startMonth && dob.getDate() >= startDay) ||
      dob.getMonth() + 1 > startMonth
    ) {
      return sign.replace("Capricornio2", "Capricornio");
    }
  }
}

// Function to determine Chinese zodiac sign
function getChineseZodiacSign(dob: Date): string {
  const chineseZodiac = [
    "Mono",
    "Gallo",
    "Perro",
    "Cerdo",
    "Rata",
    "Buey",
    "Tigre",
    "Conejo",
    "Dragón",
    "Serpiente",
    "Caballo",
    "Cabra",
  ];
  const chineseYear = (dob.getFullYear() - 1900) % 12;
  return chineseZodiac[chineseYear];
}

// Function to calculate days lived
function calculateDaysLived(dob: Date): number {
  const today = new Date();
  return Math.floor((+today - +dob) / (1000 * 60 * 60 * 24));
}

// Function to calculate next birthday and days until
function calculateNextBirthday(dob: Date): (number | string)[] {
  const today = new Date();
  const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  if (today > nextBirthday) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  const daysToNextBirthday = Math.floor((+nextBirthday - +today) / (1000 * 60 * 60 * 24));
  return [nextBirthday.toISOString().slice(0, 10), daysToNextBirthday];
}

// Function to determine birth season
function getBirthSeason(dob: Date) {
  const seasons = {
    Primavera: [2, 20],
    Verano: [5, 20],
    Otoño: [8, 21],
    Invierno: [11, 20],
  };

  for (const season in seasons) {
    const [month, date] = seasons[season];
    if (
      (month > dob.getMonth() + 1 || (month === dob.getMonth() + 1 && date >= dob.getDate())) &&
      (season !== "Invierno" || dob.getMonth() + 1 !== 12) // Special case for December
    ) {
      return season;
    }
  }
}

export default addKeyword<Provider, Database>(EVENTS.ACTION).addAnswer(
  "Proporciona una cedula de la persona que deseas obtener informacion",
  { capture: true, sensitive: true },
  async (MsgContext, { fallBack, endFlow }) => {
    if (MsgContext.body.toLowerCase() === "cancel") {
      return endFlow("Haciendome perder el tiempo...");
    }

    const cedula = MsgContext.body.replace("-", "");
    if (!Number.isInteger(parseInt(cedula)) || cedula.length !== 11) {
      return fallBack("El numero de cedula es invalido");
    }

    const url = `${process.env.API_JUNTA}?cedula=${cedula.slice(0, 3)}-${cedula.slice(3, 10)}-${cedula.slice(-1)}`;
    const request = await fetch(url);
    const response = await request.json();

    if ((await response.nombres) == null) {
      return fallBack("Cedula no valida o no existe aun :p");
    }

    const dobStr: string = response.fechaNacimiento;
    const dob = new Date(dobStr);

    const age = calculateAge(dobStr);
    const westernZodiacSign = getWesternZodiacSign(dob);
    const chineseZodiacSign = getChineseZodiacSign(dob);
    const daysLived = calculateDaysLived(dob);
    const [nextBirthday, daysToNextBirthday] = calculateNextBirthday(dob);
    const birthSeason = getBirthSeason(dob);

    const result = [
      `Nombres: *${response.nombres}*`,
      `Apellidos: *${response.apellidos}*`,
      `Cédula: *${response.cedula}*`,
      `Fecha de Nacimiento: *${response.fechaNacimiento}*`,
      `Lugar de Nacimiento: *${response.lugarNacimiento}*`,
      `Sexo: *${response.sexo}*`,
      `Edad: *${age}* años`,
      `Signo zodiacal: *${westernZodiacSign}*`,
      `Signo zodiacal chino: *${chineseZodiacSign}*`,
      `Ha vivido: *${daysLived}* días`,
      `Próximo cumpleaños: ${nextBirthday} (faltan *${daysToNextBirthday}* días)`,
      `Estación del año de nacimiento: *${birthSeason}*`,
    ];

    return endFlow(result.join("\n"));
  }
);