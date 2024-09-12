const { abbrev, getAbbreviation } = require('../')
const t = require('tap')
const util = require('util')

function test (list, expect) {
  let actual = abbrev(list)
  t.same(actual, expect,
    'abbrev(' + util.inspect(list) + ') === ' + util.inspect(expect) + '\n' +
    'actual: ' + util.inspect(actual))

  actual = abbrev(...list)
  t.same(abbrev(...list), expect,
    'abbrev(' + list.map(JSON.stringify).join(',') + ') === ' + util.inspect(expect) + '\n' +
    'actual: ' + util.inspect(actual))
}

test(['ruby', 'ruby', 'rules', 'rules', 'rules'],
  { rub: 'ruby',
    ruby: 'ruby',
    rul: 'rules',
    rule: 'rules',
    rules: 'rules',
  })
test(['fool', 'foom', 'pool', { toString: () => 'pope' }],
  { fool: 'fool',
    foom: 'foom',
    poo: 'pool',
    pool: 'pool',
    pop: 'pope',
    pope: 'pope',
  })
test(['a', 'ab', 'abc', 'abcd', 'abcde', 'acde'],
  { a: 'a',
    ab: 'ab',
    abc: 'abc',
    abcd: 'abcd',
    abcde: 'abcde',
    ac: 'acde',
    acd: 'acde',
    acde: 'acde',
  })
test(['a', 'ab', 'abc', 'abcd', 'abcde', 'acde'].reverse(),
  { a: 'a',
    ab: 'ab',
    abc: 'abc',
    abcd: 'abcd',
    abcde: 'abcde',
    ac: 'acde',
    acd: 'acde',
    acde: 'acde',
  })

t.notOk([].abbrev)
t.notOk({}.abbrev)

// Testing getAbbreviation function
function testGetAbbreviation (str, abbrevs, options, expect) {
  const actual = getAbbreviation(str, abbrevs, options)
  t.same(actual, expect,
    'getAbbreviation(' + util.inspect(str) + ', '
     + util.inspect(abbrevs) + ', ' + util.inspect(options) + ') === ' +
      util.inspect(expect) + '\n' +
    'actual: ' + util.inspect(actual))
}

// Add tests for getAbbreviation function
testGetAbbreviation(
  'ruby',
  {
    rub: 'ruby',
    ruby: 'ruby',
    rul: 'rules',
    rule: 'rules',
    rules: 'rules',
  },
  {},
  'ruby'
)
testGetAbbreviation(
  'rul',
  {
    rub: 'ruby',
    ruby: 'ruby',
    rul: 'rules',
    rule: 'rules',
    rules: 'rules',
  },
  {},
  'rules'
)

testGetAbbreviation(
  'abc',
  {
    a: 'a',
    ab: 'ab',
    abc: 'abc',
    abcd: 'abcd',
    abcde: 'abcde',
    ac: 'acde',
    acd: 'acde',
    acde: 'acde',
  },
  {},
  'abc'
)

// Additional test cases
testGetAbbreviation(
  'Ruby',
  {
    ruby: 'ruby',
    rules: 'rules',
  },
  { caseSensitive: false },
  'ruby'
)

testGetAbbreviation(
  'unknown',
  {
    rub: 'ruby',
    rules: 'rules',
  },
  { defaultAbbreviation: 'default' },
  'default'
)

testGetAbbreviation(
  'unknown',
  {
    rub: 'ruby',
    rules: 'rules',
  },
  { fallback: (str) => `No match for ${str}` },
  'No match for unknown'
)

testGetAbbreviation(
  'unknown',
  {
    rub: 'ruby',
    rules: 'rules',
  },
  {},
  'unknown'
)

t.notOk([].getAbbreviation)
t.notOk({}.getAbbreviation)
