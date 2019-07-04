# hsxkpasswd.js

A baisc JavaScript port of the Perl module `Crypt::HSXKPasswd`.

In future releases this module will support both synchronous and asynchronous password generation (using Promises), but for this initial release only the synchronous API is complete.

This initial release is missing a number of features offered by the original Perl version, most notably, support for named presets. This will be added in a later release.

## Installation

When using NodeJS:

```
npm install hsxkpasswd
```

For use in web browsers:

```
<script src="TO DO"></script>
```

## Basic Usage

Loading the module in NodeJS:

```
const HSXKPasswd = require('hsxkpasswd');
```

In web browsers the module is published as the global variable `HSXKPasswd`.

To generate passwords once using default config and dictionary:

```
const password = HSXKPasswd.passwordSync(); // single password
const passwords = HSXKPasswd.passwordsSync(10); // 10 passwords
```

To generate passwords once using custom settings:

```
const customSettings = {
  allow_accents: 0,
  case_transform: 'ALTERNATE',
  num_words: 3,
  padding_digits_before: 0,
  padding_digits_after: 3,
  padding_type: 'NONE',
  separator_character: 'RANDOM',
  symbol_alphabet: ['-', '.'],
  word_length_min: 4,
  word_length_max: 8
};
const password = HSXKPasswd.passwordSync(customSettings); // single password
const passwords = HSXKPasswd.passwordsSync(10, customSettings); // 10 passwords
```

This module supports the same setting options as the original Perl module — [see the Perl docs for details](https://metacpan.org/pod/Crypt::HSXKPasswd#Password-Generator-Configuration-Keys)

If you plan on generating passwords repeatedly with the same settings you should instantiate a password generator object and use that:

```
const customSettings = {
  allow_accents: 0,
  case_transform: 'ALTERNATE',
  num_words: 3,
  padding_digits_before: 0,
  padding_digits_after: 3,
  padding_type: 'NONE',
  separator_character: 'RANDOM',
  symbol_alphabet: ['-', '.'],
  word_length_min: 4,
  word_length_max: 8
};
const passwordGenerator = new HSXKPasswd.Generator(customSettings);
const password = passwordGenerator.passwordSync(); // single password
const passwords = passwordGenerator.passwordsSync(10); // 10 passwords
```