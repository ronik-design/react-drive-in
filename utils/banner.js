var _ = require('lodash');

module.exports = _.template([
  '/*',
  ' * React Video - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.licenses[0].type %>',
  ' * @author <%= pkg.author.name %> (<%= pkg.author.url %>)',
  '*/\n',
].join('\n'), {
  pkg: require('../package.json')
});
