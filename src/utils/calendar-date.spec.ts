import { formatCalendarDate, parseCalendarDate } from './calendar-date'

const TIME_ZONES = ['America/Sao_Paulo', 'UTC', 'Europe/Berlin', 'Asia/Tokyo']

describe('calendar date', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('parseCalendarDate', () => {
    it('should read the string as midnight UTC', () => {
      expect(parseCalendarDate('1990-01-20').toISOString()).toBe(
        '1990-01-20T00:00:00.000Z',
      )
    })

    it.each(TIME_ZONES)('should land on the same instant in %s', timeZone => {
      vi.stubEnv('TZ', timeZone)

      expect(parseCalendarDate('1990-01-20').toISOString()).toBe(
        '1990-01-20T00:00:00.000Z',
      )
    })
  })

  describe('formatCalendarDate', () => {
    it('should render the UTC calendar day', () => {
      expect(formatCalendarDate(new Date('1990-01-20T00:00:00.000Z'))).toBe(
        '1990-01-20',
      )
    })

    it.each(TIME_ZONES)('should render the same day in %s', timeZone => {
      vi.stubEnv('TZ', timeZone)

      expect(formatCalendarDate(new Date('1990-01-20T00:00:00.000Z'))).toBe(
        '1990-01-20',
      )
    })
  })

  it.each(TIME_ZONES)('should survive a round trip in %s', timeZone => {
    vi.stubEnv('TZ', timeZone)

    expect(formatCalendarDate(parseCalendarDate('1990-01-20'))).toBe(
      '1990-01-20',
    )
  })
})
