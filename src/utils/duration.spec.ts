import { Duration, isDuration } from './duration'

describe('isDuration', () => {
  it.each(['1s', '30s', '15m', '2h', '7d', '999d'])(
    'should accept %j',
    value => {
      expect(isDuration(value)).toBe(true)
    },
  )

  it.each([
    '',
    '30',
    '0m',
    '1.5h',
    '-5m',
    '30 m',
    '2 days',
    '30min',
    '30M',
    'm30',
    'abc',
    '30ms',
    '30w',
  ])('should reject %j', value => {
    expect(isDuration(value)).toBe(false)
  })

  it('should narrow the value to Duration when it returns true', () => {
    const value = '15m' as string

    const expiresIn: Duration | null = isDuration(value) ? value : null

    expect(expiresIn).toBe('15m')
  })
})
