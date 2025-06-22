// #region DateTime

export class DateTime extends Date {
	/** Returns whether the given time is before the current time. */
	isBefore(date: DateInput) {
	  return this < new Date(date)
	}
  
	/** Returns whether the given time is after the current time. */
	isAfter(date: DateInput) {
	  return this > new Date(date)
	}
  
	/** Returns whether the given time is the same time, optionally for the specified unit (e.g., 'year', 'month', 'day', 'week'). */
	is(date: DateInput, unit = "" as DateUnit) {
	  const thisDate = new Date(this)
	  const nextDate = new Date(date)
  
	  switch (unit) {
		// @ts-ignore for deliberate fallthrough
		case "year":
		  thisDate.setMonth(0)
		  nextDate.setMonth(0)
		// @ts-ignore for deliberate fallthrough
		case "month":
		  thisDate.setDate(1)
		  nextDate.setDate(1)
		// @ts-ignore for deliberate fallthrough
		case "day":
		  thisDate.setHours(0)
		  nextDate.setHours(0)
		// @ts-ignore for deliberate fallthrough
		case "hour":
		  thisDate.setMinutes(0)
		  nextDate.setMinutes(0)
		// @ts-ignore for deliberate fallthrough
		case "minute":
		  thisDate.setSeconds(0)
		  nextDate.setSeconds(0)
		case "second":
		  thisDate.setMilliseconds(0)
		  nextDate.setMilliseconds(0)
	  }
  
	  return thisDate.getTime() === nextDate.getTime()
	}
  
	/** Returns a new DateTime with the given time added. */
	with(number = 0, unit: keyof typeof _mapOfDateFns) {
	  number = _getNumber(number)
  
	  const datetime = new DateTime(this)
  
	  if (unit === "week") {
		datetime.setDate(this.getDate() + number * 7)
	  } else if (Object.hasOwn(_mapOfDateFns, unit)) {
		datetime[("set" + _mapOfDateFns[unit]) as Setter<typeof unit>](
		  datetime[("get" + _mapOfDateFns[unit]) as Getter<typeof unit>]() + number,
		)
	  } else {
		datetime.setTime(this.getTime() + number)
	  }
  
	  return datetime
	}
  
	/** Returns a relative time string describing how much time has passed since the given time. */
	since(time: DateInput, locale = DateTime.format.locale) {
	  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  
	  // @ts-expect-error left-hand date coerces to number
	  const delta = new Date(time) - new Date(this)
  
	  for (const [unit, ms] of _formats) {
		const value = Math.round(delta / ms)
  
		if (value !== 0) return rtf.format(-value, unit)
	  }
  
	  return rtf.format(-Math.floor(delta / 1e3), "second")
	}
  
	/** Returns a relative time string describing how much time is left until the given time. */
	until(time: DateInput, locale = DateTime.format.locale) {
	  return new DateTime(time).since(this, locale)
	}
  
	toParts(format = DateTime.format) {
	  const { locale, ...options } = Object(format) as typeof format
	  const formatter = new Intl.DateTimeFormat(locale, options)
  
	  return formatter.formatToParts(this).map(
		_formatPart({
		  ...formatter.resolvedOptions(),
		  ...Object(options),
		}),
	  )
	}
  
	toString(format = DateTime.format) {
	  return this.toParts(format)
		.map(({ value }) => value)
		.join("")
	}
  
	static format =
	  new Intl.DateTimeFormat().resolvedOptions() as RelativeTimeFormatOptions
  }
  
  // #endregion
  
  interface RelativeTimeFormatOptions extends Intl.DateTimeFormatOptions {
	locale: Locale
  }
  
  // #region Internals
  
  const _isNumeric = RegExp.prototype.test.bind(/^\d+$/)
  
  const _formatPart =
	(options: Intl.ResolvedDateTimeFormatOptions) =>
	<T extends Intl.DateTimeFormatPart>(part: T) =>
	  ({
		type: part.type,
		value:
		  // 2-digit hour
		  part.type === "hour" && options.hour === "2-digit" && _isNumeric(part.value)
			? String(Number(part.value)).padStart(2, "0")
			: // numeric hour
			  part.type === "hour" &&
				(options.hour === "numeric" || options.timeStyle === "short") &&
				_isNumeric(part.value)
			  ? String(Number(part.value))
			  : // 2-digit minute
				part.type === "minute" &&
				  options.minute === "2-digit" &&
				  _isNumeric(part.value)
				? String(Number(part.value)).padStart(2, "0")
				: // numeric minute
				  part.type === "minute" &&
					options.minute === "numeric" &&
					_isNumeric(part.value)
				  ? String(Number(part.value))
				  : // 2-digit second
					part.type === "second" &&
					  options.second === "2-digit" &&
					  _isNumeric(part.value)
					? String(Number(part.value)).padStart(2, "0")
					: // numeric second
					  part.type === "second" &&
						options.second === "numeric" &&
						_isNumeric(part.value)
					  ? String(Number(part.value))
					  : // any other value
						part.value,
	  }) as T
  
  const _getNumber = (value: any) => Number(value) || 0
  
  const _mapOfDateFns = {
	year: "FullYear",
	month: "Month",
	week: "Date",
	day: "Date",
	hour: "Hours",
	minute: "Minutes",
	second: "Seconds",
  } as const
  
  type Getter<T extends keyof typeof _mapOfDateFns> = `get${(typeof _mapOfDateFns)[T]}`
  type Setter<T extends keyof typeof _mapOfDateFns> = `set${(typeof _mapOfDateFns)[T]}`
  
  const _formats = [
	["year", 31536e6],
	["month", 2592e6],
	["week", 6048e5],
	["day", 864e5],
	["hour", 36e5],
	["minute", 6e4],
  ] as const
  
  // #endregion
  
  // #region DateTime Types
  
  export type DateInput = number | string | Date
  
  export type DateParts = Record<Intl.DateTimeFormatPartTypes, string>
  
  export type DateUnit =
	| "year"
	| "quarter"
	| "month"
	| "week"
	| "day"
	| "hour"
	| "minute"
	| "second"
  
  export type Locale =
	| "aa"
	| "ab"
	| "ae"
	| "af"
	| "ak"
	| "am"
	| "an"
	| "ar"
	| "as"
	| "av"
	| "ay"
	| "az"
	| "ba"
	| "be"
	| "bg"
	| "bh"
	| "bi"
	| "bm"
	| "bn"
	| "bo"
	| "br"
	| "bs"
	| "ca"
	| "ce"
	| "ch"
	| "co"
	| "cr"
	| "cs"
	| "cu"
	| "cv"
	| "cy"
	| "da"
	| "de"
	| "dv"
	| "dz"
	| "ee"
	| "el"
	| "en"
	| "eo"
	| "es"
	| "et"
	| "eu"
	| "fa"
	| "ff"
	| "fi"
	| "fj"
	| "fo"
	| "fr"
	| "fy"
	| "ga"
	| "gd"
	| "gl"
	| "gn"
	| "gu"
	| "gv"
	| "ha"
	| "he"
	| "hi"
	| "ho"
	| "hr"
	| "ht"
	| "hu"
	| "hy"
	| "hz"
	| "ia"
	| "id"
	| "ie"
	| "ig"
	| "ii"
	| "ik"
	| "io"
	| "is"
	| "it"
	| "iu"
	| "ja"
	| "jv"
	| "ka"
	| "kg"
	| "ki"
	| "kj"
	| "kk"
	| "kl"
	| "km"
	| "kn"
	| "ko"
	| "kr"
	| "ks"
	| "ku"
	| "kv"
	| "kw"
	| "ky"
	| "la"
	| "lb"
	| "lg"
	| "li"
	| "ln"
	| "lo"
	| "lt"
	| "lu"
	| "lv"
	| "mg"
	| "mh"
	| "mi"
	| "mk"
	| "ml"
	| "mn"
	| "mr"
	| "ms"
	| "mt"
	| "my"
	| "na"
	| "nb"
	| "nd"
	| "ne"
	| "ng"
	| "nl"
	| "nn"
	| "no"
	| "nr"
	| "nv"
	| "ny"
	| "oc"
	| "oj"
	| "om"
	| "or"
	| "os"
	| "pa"
	| "pi"
	| "pl"
	| "ps"
	| "pt"
	| "qu"
	| "rm"
	| "rn"
	| "ro"
	| "ru"
	| "rw"
	| "sa"
	| "sc"
	| "sd"
	| "se"
	| "sg"
	| "si"
	| "sk"
	| "sl"
	| "sm"
	| "sn"
	| "so"
	| "sq"
	| "sr"
	| "ss"
	| "st"
	| "su"
	| "sv"
	| "sw"
	| "ta"
	| "te"
	| "tg"
	| "th"
	| "ti"
	| "tk"
	| "tl"
	| "tn"
	| "to"
	| "tr"
	| "ts"
	| "tt"
	| "tw"
	| "ty"
	| "ug"
	| "uk"
	| "ur"
	| "uz"
	| "ve"
	| "vi"
	| "vo"
	| "wa"
	| "wo"
	| "xh"
	| "yi"
	| "yo"
	| "za"
	| "zh"
	| "zu"
	| (string & Record<never, never>) // any other locale
  
  // #endregion
  